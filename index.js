const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportJWT = require('passport-jwt');
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'secretKey';
const app = express()
const { User } = require('./sequelize')

app.use(bodyParser.json())

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  console.log('payload received', jwt_payload);
  User.findOne({
    where: {
      id: jwt_payload.id
    }
  })
    .then(user => {
      if (user) {
        next(null, user);
      } else {
        next(null, false);
      }
    });
});
passport.use(strategy);
app.use(passport.initialize());


let course = require('./routes/course')
let category = require('./routes/category')
let user = require('./routes/user')
app.use('/course', course)
app.use('/category', category)
app.use('/user', user)
app.use('/auth/course', passport.authenticate('jwt', { session: false }), course);
app.use('/auth/category', passport.authenticate('jwt', { session: false }), category);


const port = 3001
app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`)
})
