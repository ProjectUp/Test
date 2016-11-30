'use strict'
const express = require("express");
const multer = require("multer");
const path = require('path');
const fs = require('fs');

const app = express();

let storage = multer.diskStorage({
    destination : function (req, file, cb) {
        cb(null, './uploads');
    },

    filename : function (req, file, cb) {
        let extStart=file.originalname.indexOf(path.extname(file.originalname));
        cb(null, file.originalname.substr(0, extStart) + path.extname(file.originalname));
    }
});

const upload = multer({storage : storage});
app.use(express.static(path.join(__dirname, 'public')));

app.get("/",function(req,res){
    res.render("index", function (err, html) {
        if (err) {
            throw err;
        }
    });
});

app.post("/upload",upload.any(), function(req,res,next){
   res.statusCode = 200;
   res.send('image received');
});


app.listen(7777,console.log("server started"));