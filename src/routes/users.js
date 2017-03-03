const express = require('express');
var app=express();

const User = require('../models/user');
const passport= require('passport');
const jwt= require('jsonwebtoken');
//const config = require('../lib/database');

//Register
app.post('/register',function (req, res, next) {
    newUser= new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,

    });
    User.addUser(newUser,function (err, user) {
        if(err){
            res.json({success: false, msg:'failed to register user '});
        }else {
            res.json({success: true, msg:'succ to register user '})
        }
    });

});

//Authenticate
app.post('/authenticate',function (req, res, next) {
    const username= req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, function (err, user) {
        if(err) throw err;
        if(!user){
            return res.json({success:false, msg: 'User not found'});
        }
        User.comparePassword(password, user.password, function (err, isMatch) {

            if(err) throw err;
            if(isMatch){
                const token = jwt.sign(user,"secrettoken", {
                    expiresIn: 604800 //1week
                });
                res.json({
                    success:true,
                    token: 'JWT ' +token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            }else {
                return res.json({success:false, msg: 'Invalid password'});
            }
        });

    });

});

// Profile
app.get('/profile', passport.authenticate('jwt' , {session:false}),function (req, res, next) {
    res.json({user:req.user});

});

// Validate
app.get('/register',function (req, res, next) {
    res.send('validate');

});
