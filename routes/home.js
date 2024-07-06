const express = require("express");
const path = require("path");
const Email = require("../globalVariables/Email");

module.exports = (client) => {
    const router = express.Router();

    router.get("/", async (req, res) => {
        const email = Email.getEmail();
        
        if (!email) {
            return res.redirect("/");
        }

        try {
            const result = await client.query('SELECT * FROM note WHERE email = $1', [email]);
            res.render("home", { notes: result.rows });
        } catch (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
        }
    });

    return router;
};

// done



