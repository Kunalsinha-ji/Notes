const express = require("express");
const router = express.Router();

const Email = require("../globalVariables/Email");

module.exports = (client)=>{
    router.get("/",(req,res)=>{
        res.render("compose");
    });
    
    router.post("/",async(req,res)=>{
        let email = Email.getEmail();
        var ttitle = req.body.title;
        var ppost = req.body.contents;
    
        if (!email || !ttitle) {
            res.redirect("/?message=login%20to%20save%20notes");
        } else {
            const result = await client.query("SELECT * FROM note WHERE title = $1 AND email = $2", [ttitle,email]);
            if (result.rows.length > 0) {
                res.redirect("/home?message=Note%20with%20title%20already%20found");
            } else {
                await client.query("INSERT INTO note (title, contents, email) VALUES ($1, $2, $3)", [ttitle, ppost, email]);
                res.redirect("/home");
            }
        }
    });

    return  router;
}

// done
