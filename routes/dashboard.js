const express = require('express');
const router = express.Router();

// create root route
router.get('/', async (request, response) => {
  response.render('dashboard');
});

module.exports = router;
