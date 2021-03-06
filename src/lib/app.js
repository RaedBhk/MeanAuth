var express = require('express');
var app     = express();
const router= express.Router();
const jwt= require('jsonwebtoken');
require('./db')(app);
require('./parser')(app);
const passport= require('passport');
var actors = require('../routes/actors');
var movies = require('../routes/movies');
var User = require('../models/user');var Actor = require('../models/actor');
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./passport')(passport);

//Actors routes
 app.route('/actors')
// .get(actors.getAll)
 .post(actors.createOne);

app.get('/actors',passport.authenticate('jwt' , {session:false}),function (req, res, next) {

    console.log('hhh');
        Actor.find(function(err, actors) {
            if (err) return res.status(400).json(err);

            res.status(200).json(actors);
        });

});

app.post('/register',function (req, res, next) {
    newUser= new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,

    });
    console.log('kkk');
    User.addUser(newUser,function (err, user) {
        if(err){
            res.json({success: false, msg:'failed to register user '});
        }else {
            res.json({success: true, msg:'succ to register user '})
        }
    });

});
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








app.route('/actors/:id')
.get(actors.getOne)
.put(actors.updateOne)
.delete(actors.deleteOne);

app.post('/actors/:id/movies', actors.addMovie);
app.delete('/actors/:id/movies/:mid', actors.deleteMovie);


// Movies routes
app.route('/movies').get(movies.getAll).post(movies.createOne);

app.route('/movies/:id')
.get(movies.getOne)
.put(movies.updateOne)
.delete(movies.deleteOne);

app.post('/movies/:id/actors', movies.addActor);
app.delete('/movies/:id/actors/:mid', movies.deleteActor);


module.exports = app;
