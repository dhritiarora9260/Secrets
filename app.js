//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const bcrypt = require('bcrypt');

const saltRounds=10;

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/usersDB');
}

const userSchema = mongoose.Schema({
    email:String,
    password:String
});




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
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const user = new User({
            email:req.body.username,
            password:hash
        });
        user.save(function(err){
            if(!err){
                res.render("secrets");
            }
        })
    });
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
                bcrypt.compare(password, found.password, function(err, result) {
                    if(result==true){
                        res.render("secrets");
                    }
                    else{
                        res.send("Wrong Password!");
                    }
                });
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



