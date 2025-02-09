const express=  require('express');
const app= express();
const userModel =require("./models/user");  
const postModel=require("./models/post");
const cookieParser = require('cookie-parser');
const { name } = require('ejs');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');


app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.get('/',(req,res)=>{
   res.render("index");
});

app.post('/register',(req,res)=>{
    let(email,password,username,age,name)=req.body;
    let user=userModel.findOne({email});
    if(user)return res.status(500).send("user Already registered");

    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async (err,hash)  => {
         let user= await userModel.create({
                username,
                email,
                age,
                name,
                password:hash,
            });

            let token=jwt.sign({email:email,userid:user._id},"shhh");
            res.cookie("token",token);
            res.send("registered");
        })
    })
})

app.listen("3000");