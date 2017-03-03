const JwtStrategie = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
//const config = require('../config/database');


module.exports = function (passport) {
    var opts = {};
    opts.jwtFromRequest= ExtractJwt.fromAuthHeader();
    opts.secretOrKey = "secrettoken";
    passport.use(new JwtStrategie(opts, function (jwt_payload, done) {

        User.getUserById(jwt_payload._doc._id,function (err, user) {
            if(err){
                return done(err, false);
            }
            if(user){
                return done(null, user);
            } else {
                return done(null, false);
            }

        });

    }));

}