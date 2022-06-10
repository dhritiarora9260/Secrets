//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/usersDB');
}

const userSchema = mongoose.Schema({
    email:String,
    password:String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields: ["password"] });

const User = mongoose.model("User",userSchema);


const app = express();

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/",function(req,res){
    res.render("home");
})

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const user = new User({
        email:req.body.username,
        password:req.body.password
    });
    user.save(function(err){
        if(!err){
            res.render("secrets");
        }
    })
    console.log(req.body);
})

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email:username},function(err,found){
        if(!err){
            if(found){
                if(found.password===password){
                    res.render("secrets");
                }
                else{
                    res.send("Wrong password! Try again!")
                }
            }
            else{
                res.send("user doesnt exist. Please register first")
            }
        }
    })
})

app.listen(3000,function(){
    console.log("The server has started on port 3000");
})



