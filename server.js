'use strict';
const express = require("express");
const fs = require("fs");
const multer = require("multer");
const app = express();
const bodyparser = require("body-parser");
const path = require("path");
const atob=require("atob");

app.use(bodyparser.urlencoded({
    extended : true
}));
app.use(bodyparser.json());
app.use(express.static("public"));

//Useful Functions


const AddInfo = function(folder, Obj) {
    fs.writeFile("./private/users/" + folder + "/name.txt", JSON.stringify({
        fname: Obj.firstName
    }), function(err) {
        if (err) console.log("There was an error while loading name");
    }); //Writing Names
    fs.writeFile("./private/users/" + folder + "/Last_Name.txt", JSON.stringify({
        lname: Obj.lastName
    }), function(err) {
        if (err) console.log("There was an error while loading last name");
    });
    fs.writeFile("./private/users/" + folder + "/email.txt", JSON.stringify({
        mail: Obj.email
    }), function(err) {
        if (err) console.log("There was an error while loading email");
    });
    fs.mkdirSync('./private/users/' + folder + "/Private");
    fs.writeFile("./private/users/" + folder + "/Private/username.txt", JSON.stringify({
        user: Obj.username
    }), function(err) {
        if (err) console.log("There was an error while loading username");
    });
    fs.writeFile("./private/users/" + folder + "/Private/password.txt", JSON.stringify({
        pass: Obj.password
    }), function(err) {
        if (err) console.log("There was an error while loading password");
    });
    if (Obj.team != "") {
        fs.mkdirSync('./private/users/' + folder + "/Team");
        fs.writeFile("./private/users/" + folder + "/Team/team.txt", JSON.stringify({
            team: Obj.team
        }), function(err) {
            if (err) console.log("There was an error while loading Team Name");
        });
    }
    return 1;

};
//End of Useful functions




//Setup

let dest = "";
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        fs.mkdirSync('./private/users/' + dest + "/Images");
        cb(null, './private/users/' + dest + "/Images");
    },

    filename: function(req, file, cb) {
        let extStart = file.originalname.indexOf(path.extname(file.originalname));
        cb(null, dest + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});
//End of Setup



app.get("/public/Form.html", function(req, res, next) { //get the form
    res.sendFile(path.join(__dirname, "./public/Form.html"));
});
app.get("/public/LogIn.html", function(req, res, next) { //get to the login page
    res.sendFile(path.join(__dirname, "./public/LogIn.html"));
});
app.get("/private/ProfPage/prof.html", function(req, res, next) {
    if(req.query.hdgcSaSAsSADASucac) {

        if (req.query.hdgcSaSAsSADASucac.length >= 6) {
            res.sendFile(path.join(__dirname, '/private/ProfPage/prof.html'));
        }
        else {
            res.send("Not Found");
        }
    }
    else{
        res.send("Not Found");
    }
});
app.get("/GetThingsReady",function(req,res){
   console.log(atob(atob(req.query.smth)));
   const Dat=atob(atob(req.query.smth));
   fs.exists("./private/users/"+atob(atob(req.query.smth)),function(exists){
       if(exists){
           fs.readFile("./private/users/"+Dat+"/Images/"+Dat+".jpg",function(err,data){
               console.log(data);
           })
       }
       else{
           console.log("Blown");
           res.statusCode=500;
           res.send("OOPS Smth blown");
       }
   });


});

app.post("/lol", upload.any(), function(req, res) {
    console.log(req.files);
    res.send("OK");
});
app.post("/TXT", function(req, res, next) {
    console.log(req.body);
    fs.exists('./private/users/' + req.body.username, function(exists) {
        if (exists) {
            console.log(exists);
            res.statusCode = 404;
            res.send('user exists');
        } else {
            dest = req.body.username;
            fs.mkdirSync('./private/users/' + req.body.username);
            res.statusCode = 200;
            if (AddInfo(req.body.username, req.body)) res.send("Done");

        }
    });

});
//End of Form


//Logging in
app.post("/CheckAndLogIn", function(req, res) {
    console.log(req.body);
    //checking process
    fs.exists("./private/users/" + req.body.user, function(exists) {
        if (exists) {
            console.log("Username matches");
            fs.readFile("./private/users/" + req.body.user + "/Private/password.txt", function(err, data) {
                if (err) {
                    console.log("Error Checking Password");
                    res.send('Denied');
                } else {
                    if (JSON.parse(data).pass === req.body.pass) {
                        console.log("Password matches");
                        res.send('Logged in');
                    } else {
                        console.log("Password doesn't match");
                        res.send("Denied");
                    }
                }
            })

        } else {
            console.log("Username doesn't match");
            res.send("Denied");
        }
    });
});


app.listen(3333, console.log("Server Started"));