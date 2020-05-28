const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongo = require('mongoose');
const bodyParser = require('body-parser');
const User = require('../models/User');
const passport = require('passport');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

// DB config
mongo.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongo.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log("Connected to Mongodb"));

// register page route
router.get('/register', async (request, response) => {
  response.render('register.ejs');
});

// handle user registration
router.post('/register', async (request, response) => {
  let name = request.body.name;
  let email = request.body.email;
  let password = request.body.password;
  let password2 = request.body.confirmPassword;
  let errors = [];

  // Check for required fields
  if(!name || !email || !password || !password2){
    errors.push({msg: 'Please fill out all fields'});
  }

  // check if passwords match
  if(password != password2){ errors.push({msg: 'Passwords do not match'}); }

  // check password length
  if(password.length < 6){ errors.push({msg: 'Password must be at least 6 characters'}); }

  // check if errors are present
  if(errors.length > 0){
    response.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  // Create user and push to Mongo
  } else {
    // check if user exists -- if no, go on to insert into mongo
    db.collection('Users').findOne({email: email}).then(user => {
        if(user){
          // user exists
          errors.push({msg: 'Account with that email already exists'});
          response.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            name,
            email,
            password
          });
          // bigger the salt the more secure -- but more time to make hash default 10
          // hash password
          bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(newUser.password, salt, (error,hash) => {
              if(error) throw error;
              // set password to hashed version
              newUser.password = hash;
              // save the newly created user
              db.collection('Users').insertOne(newUser, (error, response) =>{
                if(error) throw error;
                console.log('User created successfully');
              });
              request.flash('success_msg', 'You are registered and can now log in');
              response.redirect('/users/login');
              console.log(newUser);
            });
          }); // end of gen salt
        }
      });
    }
});

// get login
router.get('/login', async (request, response) => {
  response.render('login.ejs');
});
// handles login
router.post('/login', async (request, response, next) => {
  // authenticate user using local strategy
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(request, response, next);
});

// handles Logout
router.get('/logout', async (request, response) => {
// using passport middelware gives access
  request.logout();
  request.flash('success_msg', 'You are logged out');
  response.redirect('/users/login');
});

module.exports = router;
