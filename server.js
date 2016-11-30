/**
 * Created by Edvard Asus on 11/29/2016.
 */
'use strict'
const express=require("express");
const app=express();
const Multer=require("multer");
const upload=Multer({dest:"uploads/"});

app.use(express.static("public"));

app.get("/",function(req,res){
res.send("index");
});



app.post("/Pic",upload.any(),function(req,res,next){
console.log("We received image Edo jan");
})






app.listen(7777,console.log("server started"));
