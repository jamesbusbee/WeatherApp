const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

// load user model
const User = require('../models/User');

// DB config
mongo.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongo.connection;
db.on('error', error => console.error(error));

module.exports = function(passport){
  // parse html input
  passport.use(bodyParser.urlencoded({ extended: false }));
  passport.use(
    new LocalStrategy({ usernameField: 'name', passwordField: 'password'}, (email, password, done) => {
      // check if user exists
      db.collection('Users').findOne({email: email}).then(user => {
        if(!user){
          return done(null, false, {message: 'That email has not been registered'});
        }

        // Match the password
        bcrypt.compare(password, user.password, (error, isMatch) => {
          if(error) throw error;
          if(isMatch){
            return done(null, user);
          } else {
            return done(null, false, {message: 'Password Incorrect'})
          }
        });
      }).catch(error => console.log(error));
    })
  );
  // serialize and deserialize user instance --
  // allows cookie to establish and maintain unique login session
  // for each request after initial successful login
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
};
