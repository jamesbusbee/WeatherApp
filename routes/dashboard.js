const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const passport = require('passport');

  // create root route
  router.get('/', ensureAuthenticated, async (request, response) => {
    response.render('dashboard', {
      name: request.user.name
    });
  });


module.exports = router;
