'use strict';
const express=require("express");
const fs=require("fs");
const multer=require("multer");
const app=express();
const bodyparser=require("body-parser");
const path=require("path");
app.use(bodyparser.urlencoded());
app.use(bodyparser.json());
app.use(express.static("public"));

//Useful Functions


const AddInfo=function(folder,Obj){
fs.writeFile("./public/users/"+folder+"/name.txt",JSON.stringify({fname:Obj.firstName}),function(err){
  if(err) console.log("There was an error while loading name");
});//Writing Names
fs.writeFile("./public/users/"+folder+"/Last_Name.txt",JSON.stringify({lname:Obj.lastName}),function(err){
  if(err) console.log("There was an error while loading last name");
});
fs.writeFile("./public/users/"+folder+"/email.txt",JSON.stringify({mail:Obj.email}),function(err){
  if(err) console.log("There was an error while loading email");
});
fs.mkdirSync('./public/users/' + folder+"/Private");
fs.writeFile("./public/users/"+folder+"/Private/username.txt",JSON.stringify({user:Obj.username}),function(err){
  if(err) console.log("There was an error while loading username");
});
fs.writeFile("./public/users/"+folder+"/Private/password.txt",JSON.stringify({pass:Obj.password}),function(err){
  if(err) console.log("There was an error while loading password");
});
if(Obj.team!=""){
  fs.mkdirSync('./public/users/' + folder+"/Team");
  fs.writeFile("./public/users/"+folder+"/Team/team.txt",JSON.stringify({team:Obj.team}),function(err){
    if(err) console.log("There was an error while loading Team Name");
  });
}
return 1;

}
//End of Useful functions




//Setup

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
//End of Setup



app.get("/public/Form.html",function(req,res,next){   //get the form
res.sendfile("./public/Form.html");
});
app.get("/public/LogIn.html",function(req,res,next){  //get to the login page
res.sendfile("./public/LogIn.html");
});


//Form

app.post("/lol",upload.any(),function(req,res){
console.log(req.files);
res.send("OK");
});
app.post("/TXT",function(req,res,next){
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
       if(AddInfo(req.body.username,req.body))res.send("Done");

   }
});

})
//End of Form


//Logging in
app.post("/CheckAndLogIn",function(req,res){
console.log(req.body);
//checking process
fs.exists("./public/users/"+req.body.user,function(exists){
if(exists) {
  console.log("Username matches");
  fs.readFile("./public/users/"+req.body.user+"/Private/password.txt",function(err,data){
    if(err){console.log("Error Checking Password");}
    else{
    if(JSON.parse(data).pass===req.body.pass){
console.log("Password matches");
    res.send("Granted");
  }
    else {
      console.log("Password doesn't match");
      res.send("Denied");
      }
    }
  })

}//end of 1st if
else {
  console.log("Username doesn't match");
  res.send("Denied");
  }

});
//end of checking process






});


//End of Logging In

app.listen(3333,console.log("Server Started"));
