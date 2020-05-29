'use strict';


var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
let jwtOptions = {};
jwtOptions.secretOrKey = 'secretKey';
const { User } = require('../sequelize')

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({
      where: {
        'username': username
      }
    }).then(function (user) {
      if (user == null) {
        return done(null, false)
      }
      //comparing password
      bcrypt.compare(password, user.password, function (err, res) {
        if (err) return done(err);
        if (res === false) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      })

    })
  }
))
passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.findOne({
    where: {
      'id': id
    }
  }).then(function (user) {
    if (user == null) {
      done(new Error('Wrong user id.'))
    }

    done(null, user)
  })
})


router.post('/login', passport.authenticate('local'), function (req, res) {
  var payload = { id: req.user.id };
  var token = jwt.sign(payload, jwtOptions.secretOrKey);
  res.json({ message: "ok", token: token });
});


router.post('/register', function (req, res, next) {
  let newUserPassword
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      if (err) return next(err);
      newUserPassword = hash;
      User.findOne({
        where: {
          username: req.body.username
        }
      })
        .then(user => {
          if (user) {
            res.send({
              message: "user already exist"
            })
          } else {
            User.create({ username: req.body.username, password: newUserPassword })
              .then(result => { res.json({ sucess: 'true' }) })
          }
        })

    });
  });
});

module.exports = router;

