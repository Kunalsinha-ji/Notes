const express = require("express");
const router = express.Router();
const path = require("path");
const Title = require("../globalVariables/title");
const Email = require("../globalVariables/Email");

module.exports = (client) => {
    router.get("/:title", async (req, res) => {
        Title.setTitle(req.params.title);
        res.render("edit");
    });

    router.post("/", async (req, res) => {
        var ttl = Title.getTitle();
        const content = req.body.contents;
        var email = Email.getEmail();
        try {
            await client.query("DELETE FROM note WHERE title = $1 AND email = $2",[ttl,email]);
            await client.query("INSERT INTO note (title, contents,email) VALUES ($1, $2,$3)", [ttl, content,email]);
            res.redirect("/home");
        } catch (error) {
            console.error('Error updating note:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    return router;
};
