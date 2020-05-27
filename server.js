if(process.env.NODE_ENV != 'production'){
  require('dotenv').config();
}

const fetch = require('node-fetch');
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index');
const dashboardRouter = require('./routes/dashboard');
const registerRouter = require('./routes/users');
const mongo = require('mongoose');

// EJS setup - can probably get rid of some od these eventually
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(bodyParser.json());

// Body parser - allows response.body
app.use(express.urlencoded({ extended: false }));
app.use('/static', express.static('public'));

// create welcome route at root
app.use('/', indexRouter);
// create dashboard route
app.use('/dashboard', dashboardRouter);
// create register route
app.use('/users', registerRouter);

// weather functionality
app.get('/weather/:latlng', async (request, response) => {
  const latlng = request.params.latlng.split(',');
  const lat = latlng[0];
  const lng = latlng[1];
  // dark sky request
  const dsKey = process.env.DARK_SKY_KEY;
  const dsUrl = `https://api.darksky.net/forecast/${dsKey}/${lat},${lng}`;
  const dsResponse = await fetch(dsUrl);
  const dsJson = await dsResponse.json();
  console.log(dsJson);
  // Here location request
  const hereKey = process.env.HERE_KEY;
  const hereUrl = `https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?prox=${lat},${lng}&mode=retrieveAddresses&maxresults=1&gen=9&apiKey=${hereKey}`;
  const hereResponse = await fetch(hereUrl);
  const hereJson = await hereResponse.json();

  const data = {
    weather: dsJson,
    current_location: hereJson
  };
  response.json(data);
});

console.log("Creating server");
app.listen(process.env.PORT || 80);
