'use strict'
const express = require("express");
const multer = require("multer");
const path = require('path');
const fs = require('fs');
const bodyparser = require('body-parser');

const app = express();
app.use(bodyparser.urlencoded());
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, 'public')));

let dest = "";
let storage = multer.diskStorage({
    destination : function (req, file, cb) {
        cb(null, './public/users/' + dest);
    },

    filename : function (req, file, cb) {
        let extStart=file.originalname.indexOf(path.extname(file.originalname));
        cb(null, dest + path.extname(file.originalname));
    }
});

const upload = multer({storage : storage});


app.get("/",function(req, res){
    res.render("index", function (err, html) {
        if (err) {
            res.statusCode = 404;
            throw err;
        }
    });
});
app.get("/public/form.html",function(req,res){
    res.sendfile("./public/form.html");
});


app.post("/upload",upload.any(), function(req,res,next) {
   console.log(req.files);
   res.statusCode = 200;
   res.send('image received');
});

app.post("/text",function(req, res){
    console.log(req.body);
    fs.exists('./public/users/' + req.body.username, function (exists) {
       if (exists) {
           console.log(exists);
           res.statusCode = 404;
           res.send('user exists');
       } else {
           dest = req.body.username;
           fs.mkdirSync('./public/users/' + req.body.username);
           res.statusCode = 200;
           res.send("Done");
       }
    });
});


app.listen(7777,console.log("server started"));