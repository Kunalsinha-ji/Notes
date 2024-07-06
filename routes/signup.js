const express = require("express");
const bcrypt = require("bcrypt");
const path = require('path');
const saltRounds = 10;
const Email = require("../globalVariables/Email");

module.exports = (client) => {
    const router = express.Router();

    router.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "../Auth/signup.html"));
    });

    router.post("/", async (req, res) => {
        const { email, password, firstname, lastname } = req.body;
        
        if (!email || !password || !firstname || !lastname) {
            return res.status(400).send("All fields are required");
        }

        try {
            const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
            
            if (existingUser.rows.length > 0) {
                return res.status(400).send("User already signed up");
            }
            
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            await client.query("INSERT INTO users (first_name, last_name, email, pass) VALUES ($1, $2, $3, $4)", [firstname, lastname, email, hashedPassword]);
            
            Email.setEmail(email);
            res.redirect("/home");
        } catch (error) {
            console.error('Database query error:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    return router;
};


// done