const express = require("express");
const app = express();

app.get("/index.html",function(req,res){
    res.send("<h1>welcome</h1>")

})


app.listen(8081,function(){
    console.log("server is started");
})