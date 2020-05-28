const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const passport = require('passport');
//const PassportHerokuAddon = require('passport-heroku-addon');

//passport.use(new PassportHerokuAddon({
  //sso_salt: process.env.SSO_SALT
//}));

//if(process.env.NODE_ENV == 'production'){
  //passport.use(new PassportHerokuAddon({
    //sso_salt: process.env.SSO_SALT
  //}));
  //router.get('/heroku/resources/:id',
  //passport.authenticate('heroku-addon'),
  //function(request, response) {
    //response.redirect('./dashboard', {
      //name: request.user.name
    //});
  //});
//} else {
  // create root route
  router.get('/', ensureAuthenticated, async (request, response) => {
    response.render('dashboard', {
      name: request.user.name
    });
  });
//}

module.exports = router;
