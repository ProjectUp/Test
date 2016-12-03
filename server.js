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

//Functions
const AddInfo=function(folder,Obj){
    fs.writeFile("./public/users/"+folder+"/name.txt",Obj.firstName,function(err){
        if(err) console.log("There was an error while loading name");
    });//Writing Names
    fs.writeFile("./public/users/"+folder+"/Last_Name.txt",Obj.lastName,function(err){
        if(err) console.log("There was an error while loading last name");
    });
    fs.writeFile("./public/users/"+folder+"/email.txt",Obj.email,function(err){
        if(err) console.log("There was an error while loading email");
    });
    fs.mkdirSync('./public/users/' + folder+"/Private");
    fs.writeFile("./public/users/"+folder+"/Private/username.txt",Obj.username,function(err){
        if(err) console.log("There was an error while loading username");
    });
    fs.writeFile("./public/users/"+folder+"/Private/password.txt",Obj.password,function(err){
        if(err) console.log("There was an error while loading password");
    });
    if(Obj.team!=""){
        fs.mkdirSync('./public/users/' + folder+"/Team");
        fs.writeFile("./public/users/"+folder+"/Team/team.txt",Obj.team,function(err){
            if(err) console.log("There was an error while loading Team Name");
        });
    }
    return true;
};

let dest = "";
let storage = multer.diskStorage({
    destination : function (req, file, cb) {
        fs.mkdirSync('./public/users/' + dest+"/Images");
        cb(null, './public/users/' + dest+"/Images");
    },

    filename : function (req, file, cb) {
        let extStart=file.originalname.indexOf(path.extname(file.originalname));
        cb(null, dest + path.extname(file.originalname));
    }
});

const upload = multer({storage : storage});


app.get("/",function(req, res){
    res.render("index", function (err) {
        if (err) {
            res.statusCode = 404;
            throw err;
        }
    });
});

app.get("/public/form.html",function(req, res) {
    res.statusCode = 200;
    res.sendfile("./public/form.html");
});

app.post("/upload",upload.any(), function(req, res) {
    res.statusCode = 200;
    res.send('Done');
});

app.post("/text",function(req, res){
    fs.exists('./public/users/' + req.body.username, function (exists) {
        if (exists) {
            res.statusCode = 404;
            res.send('user exists');
        } else {
            dest = req.body.username;
            fs.mkdirSync('./public/users/' + req.body.username);
            res.statusCode = 200;
            if(AddInfo(req.body.username,req.body)) res.send("Done");
        }
    });
});


app.listen(7777,console.log("server started"));