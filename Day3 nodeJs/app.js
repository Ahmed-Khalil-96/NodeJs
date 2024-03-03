const express = require('express');
const bodyParser = require("body-parser");
const mongodb = require('mongodb');
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require('uuid');

const app = express();
app.set("view-engine", "ejs");
const parser = bodyParser.json();

app.use(parser);
app.use(cookieParser());

const uri = 'mongodb://localhost:27017';
const client = new mongodb.MongoClient(uri);

let dbo = null;

async function initializeDB() {
    try {
        await client.connect();
        dbo = client.db("Day3");
        app.listen(5000, function () {
            console.log('Server Started');
        });
    } catch (error) {
        console.error("Error connecting to database:", error);
    }
}

initializeDB();

app.get('/login', function (req, res) {
    res.render('login.ejs');
});

async function authenticate(req, res, next) {
    try {
        if (req.cookies.sid) {
            let user = await dbo.collection("users").findOne({ sid: req.cookies.sid });

            if (user) {
                req.user = user;
                next();
            } else {
                res.send({ msg: "Error: Not Authenticated User" });
            }
        } else {
            res.send({ msg: "Error: Not Authenticated User" });
        }
    } catch (error) {
        console.error("Authentication error:", error);
        res.send({ msg: "Error: Authentication failed" });
    }
}

app.post('/login', async function (req, res) {
    try {
        let data = req.body;
        if (data.username && data.password && data.password.length >= 8) {
            let user = await dbo.collection("users").findOne({ username: data.username, password: data.password });
            if (user) {
                const uuid = uuidv4();
                await dbo.collection("users").updateOne({ _id: user._id }, { $set: { sid: uuid } });
                res.cookie("sid", uuid);
                res.send({ msg: "Success" });
            } else {
                res.send({ msg: "User Not Found" });
            }
        } else {
            res.send({ msg: "Invalid username or password" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.send({ msg: "Error: Login failed" });
    }
});

app.get("/", async function (req, res) {
    try {
        let users = await dbo.collection("users").find().toArray();
        res.send({ msg: "Welcome" });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.send({ msg: "Error: Unable to fetch data" });
    }
});

app.get("/index", async function (req, res) {
    res.render("index.ejs");
});

app.get("/currentUser", authenticate, async function (req, res) {
    res.send(req.user);
});

app.get("/logout", authenticate, function (req, res) {
    try {
        dbo.collection("users").updateOne({ _id: req.user._id }, { $set: { sid: "" } });
        res.cookie("sid", "");
        res.send({ msg: "Logout success" });
    } catch (error) {
        console.error("Logout error:", error);
        res.send({ msg: "Error: Logout failed" });
    }
});
