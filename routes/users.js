const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongo = require('mongoose');
const bodyParser = require('body-parser');
const User = require('../models/User');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

// DB config
mongo.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true});
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
  if(password != password2){
    errors.push({msf: 'Passwords do not match'});
  }

  // check password length
  if(password.length < 6){
    errors.push({msg: 'Password must be at least 6 characters'});
  }

  // bigger the salt the more secure -- but more time to make hash default 10
  const MongoClient = require('mongodb').MongoClient;
  let user = new User();

  // hash password
  const hashedPassword = bcrypt.hash(request.body.password, 10);
  user.name = name;
  user.email = email;
  user.password = hashedPassword;

  db.collection('Users').insertOne(user, function(error, collection){
    if (error) throw error;
    console.log("Document inserted successfully");
  });
  response.redirect('/dashboard');
  return console.log(user.name + ' ' + user.email + ' ' + user.password);
});

// login page route
router.get('/login', (request, response) => {
  response.render('login.ejs');
});

router.post('/login', async (request, response) => {
  const user = users.find(user => user.name === request.body.name);
  if(user == null){
    return response.status(400).send("Can't find user");
  } else{
    // comparison for password
    try{
      if(await bcrypt.compare(request.body.password, user.password)){
        response.send('Success');
      } else {
        response.send('Error');
      }
    } catch(error){
      response.status(500).send()
    }
  }
});
module.exports = router;
