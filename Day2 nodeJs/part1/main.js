const express = require('express');
const bodyParser = require("body-parser");
let app = express();

app.set("view-engine","ejs");
app.use(bodyParser.urlencoded());

let message = "";
let pass = '';

app.get('/', function(req, res) {
    res.render("index.ejs", {message, pass});
});

app.post('/', function(req, res) {
    pass = req.body.password;
    if (pass.length < 8) {
        message = "Error: password is less than 8 characters";
    } else {
        message = "Registered successfully";
    }
    
    res.render('index.ejs', {message, pass});
})

app.listen(5000, function() {
    console.log('Server Started');
})