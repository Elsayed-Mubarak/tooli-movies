var express = require('express');
var passport = require('passport');
var config = require('../config/db');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();


var authController = require("../controller/authController");


console.log("...........im on router here  =====>>")

/* auth router by sayed */
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

//router.get('/getMovieById', authController.getMovieById);


router.get('/getMovieById', passport.authenticate('jwt', { session: false }), authController.getMovieById, function (err, next) {
  if (err) {
    console.log("............err..............", err)
  }
  next()
});


/*
//router.get('/signout', passport.authenticate('jwt', { session: false }), authController.signout);

router.get('/signout', passport.authenticate('jwt', { session: false }), function (req, res) {
  req.logout();
  res.json({ success: true, msg: 'Sign out successfully.' });
});
*/

module.exports = router