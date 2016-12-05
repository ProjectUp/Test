'use strict';


const express = require("express");
const fs = require("fs");
const multer = require("multer");
const app = express();
const bodyparser = require("body-parser");
const path = require("path");


app.use(bodyparser.urlencoded());
app.use(bodyparser.json());
app.use(express.static("public"));


const AddInfo = function(folder, Obj) {
    fs.writeFile("./public/users/" + folder + "/name.txt", Obj.firstName, function(err) {
        if (err) console.log("There was an error while loading name");
    }); //Writing Names
    fs.writeFile("./public/users/" + folder + "/Last_Name.txt", Obj.lastName, function(err) {
        if (err) console.log("There was an error while loading last name");
    });
    fs.writeFile("./public/users/" + folder + "/email.txt", Obj.email, function(err) {
        if (err) console.log("There was an error while loading email");
    });
    fs.mkdirSync('./public/users/' + folder + "/Private");
    fs.writeFile("./public/users/" + folder + "/Private/username.txt", Obj.username, function(err) {
        if (err) console.log("There was an error while loading username");
    });
    fs.writeFile("./public/users/" + folder + "/Private/password.txt", Obj.password, function(err) {
        if (err) console.log("There was an error while loading password");
    });
    if (Obj.team != "") {
        fs.mkdirSync('./public/users/' + folder + "/Team");
        fs.writeFile("./public/users/" + folder + "/Team/team.txt", Obj.team, function(err) {
            if (err) console.log("There was an error while loading Team Name");
        });
    }
    return 1;
};


let dest = "";
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        fs.mkdirSync('./public/users/' + dest + "/Images");
        cb(null, './public/users/' + dest + "/Images");
    },

    filename: function(req, file, cb) {
        let extStart = file.originalname.indexOf(path.extname(file.originalname));
        cb(null, dest + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});

app.get("/public/form.html", function(req, res, next) {
    res.statusCode = 200;
    res.sendfile("./public/form.html");
});

app.get('/public/login.html', function (req, res) {
   res.statusCode = 200;
   res.sendfile("./public/login.html");
});

app.post("/upload", upload.any(), function(req, res) {
    console.log(req.files);
    res.statusCode = 200;
    res.send("OK");
});
app.post("/TXT", function(req, res, next) {
    console.log(req.body);
    fs.exists('./public/users/' + req.body.username, function(exists) {
        if (exists) {
            console.log(exists);
            res.statusCode = 404;
            res.send('user exists');
        } else {
            dest = req.body.username;
            fs.mkdirSync('./public/users/' + req.body.username);
            res.statusCode = 200;
            if (AddInfo(req.body.username, req.body)) res.send("Done");

        }
    });
});

app.post("/CheckAndLogIn", function(req, res) {
    console.log(req.body);
    fs.exists("./public/users/" + req.body.user, function(exists) {
        if (exists) {
            console.log("Username matches");
            fs.readFile("./public/users/" + req.body.user + "/Private/password.txt", function(err, data) {
                if (err) {
                    console.log("Error Checking Password");
                } else {
                    console.log(data.toString());
                    if (data.toString() === req.body.pass) {
                        console.log("Password matches");
                        res.statusCode = 200;
                        res.send("Granted");
                    } else {
                        console.log("Password doesn't match");
                        res.statusCode = 404;
                        res.send("password does not match");
                    }
                }
            })

        }
        else {
            console.log("Username doesn't match");
            res.statusCode = 404;
            res.send("Username does not match");
        }
    });
});

app.listen(3333, console.log("Server Started"));