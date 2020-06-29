var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

var User = require('../models/user');  // user model 
var config = require('../config/db'); // db config file


//console.log("..................{ im on passport now JwtStrategy }..................", JwtStrategy)
//console.log("..................{ im on passport now ExtractJwt}..................", ExtractJwt)

module.exports = function (passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");

    opts.secretOrKey = config.secret;
    //   console.log("..................opts(1)................", opts)

    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        User.findOne({ id: jwt_payload.id }, function (err, user) {
            console.log(".................. user on passpooort.................", user)
            console.log(".................. err on passpooort..is...............", err)
            if (err) {
                return done(err, false);
            }
            if (user) {
                //                console.log(".................. jwt_payload.................", user)

                done(null, user);
            } else {
                done(null, false);
            }

        });
    }));
};
