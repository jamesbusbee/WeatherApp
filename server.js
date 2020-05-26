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
const indexRouter = require('./routes/dashboard');
const registerRouter = require('./routes/users');

app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use('/static', express.static('public'));

// CORS fix supposedly
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// create root route
app.use('/dashboard', indexRouter);
// create register route
app.use('/users', registerRouter);

// register and login/user authentication
app.use(express.json());

// user login
app.get('/login', async (request, response) => {
  response.render('login.ejs');
});
app.post('/login', async (request, response) => {
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
