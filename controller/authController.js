var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/db');
require('../config/passport')(passport);
var express = require('express');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var axios = require('axios');
let { client } = require('../config/elasticSearchConfig');


var User = require("../models/user");
var Movie = require("../models/movies")
const movieTokenKey = require('../security/token-keys');

//signup
exports.signup = (req, res) => {
    let uName = req.body.username;
    let pass = req.body.password;

    if (!(uName || pass)) {
        res.status(400).json({ sucess: false, message: "please enter username and password" })
    } else {
        var newUser = new User({ username: uName, password: pass })
        newUser.save((err) => {
            if (err) { return res.status(200).json({ sucess: false, message: "username already exsist" }) }
            res.json({ sucess: true, message: " new user created Successfully" })
        })
    }
}


exports.signin = (req, res) => {
    User.findOne({ username: req.body.username }).then(user => {

        //     if (err) throw err;
        if (!user) {
            res.status(401).send({ sucess: false, message: "authentication faild .... user not found" })
        } else {

            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.sign(user.toJSON(), config.secret, {
                        expiresIn: 604800 // 1 week
                    });
                    // return the information including token as JSON
                    res.json({ success: true, token: 'JWT ' + token });
                } else {
                    res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
                }
            });

        }
    }).catch(err => { console.log(".......catch err on signin.......", err) })
}


exports.signout = (req, res) => {
    console.log("......,,,,,,,,,,,,,,,,,,,,,,,req.....", req)
    req.logout();
    res.json({ success: true, msg: 'Sign out successfully.' });
}



/*

`${}`

*/


module.exports.getMovieById = (req, res) => {
    console.log("...............header ...............", req.headers.authorization.split(' ').length)
    var movie_id = req.body.movieId;
    var api_key = movieTokenKey.apiKey;
    let header = req.headers;

    let token = getToken(header);
    if (!token) {
        return res.send({ sucess: false, message: "Unauthorized" })
    }

    axios.get(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=${api_key}&language=en-US`)
        .then(resp => {

               let _movie = resp.data;

            if (_movie) {
                var movie = new Movie(_movie);
                movie.save();
                //let elasticMovie = _movie
                client.index({ index: 'tooli-movies', type: 'movie', body: _movie })
                         .catch(err => { console.log(".........elastic save movie err.........", err) })
                return res.json({ success: true, message: resp.data });
            }
            res.json({ success: false, message: 'movie not found' });
        }).catch(err => { console.log(".............axios error............", err) })





}

getToken = (header) => {
    if (!(header && header.authorization)) {
        return null;
    }
    var actualToken = header.authorization.split(' ');
    // length fun start count fom 1 but indexes a[i] start from 0
    if (actualToken.length === 2) {
        return actualToken[1]
    } else return null;
}