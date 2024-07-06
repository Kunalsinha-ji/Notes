const express = require("express");
const router = express.Router();

module.exports = (client) => {
    router.get("/:title", async (req, res) => {
        const title = req.params.title;
        try {
            await client.query("DELETE FROM note WHERE title = $1", [title]);
            res.redirect("/home");
        } catch (error) {
            console.error('Error deleting note:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    return router;
};
