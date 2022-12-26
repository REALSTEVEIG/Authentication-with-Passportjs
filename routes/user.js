var express = require('express');
var router = express.Router();
var passport = require('passport');

const bodyParser = require('body-parser');
var User = require("../models/user");

router.use(bodyParser.json());

router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username, email : req.body.email}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!', user});
      });
    }
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  let user = req.user
  user.hash = undefined
  user.salt = undefined

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, status: 'You are successfully logged in!', user});
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    // res.redirect('/');
    res.json({message : 'Logout was successful!'})
  }
  else {
    // var err = new Error('You are not logged in!');
    res.json({message : 'You have already logged out!'})
    err.status = 403;
    next(err);
  }
});

module.exports = router;