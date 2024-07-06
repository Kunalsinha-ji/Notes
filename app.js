const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const pg = require("pg");
const bcrypt = require('bcrypt');

const Email = require("./globalVariables/Email");

const signupRouter = require('./routes/signup');
const homeRouter = require('./routes/home');
const composeRouter = require('./routes/compose');
const contactRouter = require("./routes/contact");
const aboutRouter = require("./routes/about");
const deleteRouter = require("./routes/delete");
const editRouter = require("./routes/edit");

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const client = new pg.Client({
    user: 'postgres',
    password: 'postgres',
    database: 'NotesNew',
    host: 'localhost',
    port: 5432,
});

client.connect()
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.error("Failed to connect to the database:", err);
    });


app.use('/signup', signupRouter(client));
app.use('/home', homeRouter(client));
app.use('/compose', composeRouter(client));
app.use('/contact', contactRouter);
app.use('/about', aboutRouter);
app.use('/delete', deleteRouter(client));
app.use('/edit', editRouter(client));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/Auth/login.html");
});

app.post("/", async (req, res) => {
    const mail = req.body.email;
    const password = req.body.password;

    try {
        const result = await client.query('SELECT * FROM users WHERE email = $1', [mail]);
        if (result.rows.length === 0) {
            res.redirect('/signup');
        } else {
            const hashedPassword = result.rows[0].pass; 
            const match = await bcrypt.compare(password, hashedPassword);
            if (match) {
                Email.setEmail(mail);
                res.redirect('/home');
            } else {
                res.redirect('/');
            }
        }
    }
    catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server active at port: ${port}`);
});
