require('dotenv').config();
const fs = require('fs');
const http = require('http');
const https = require('https');
const fetch = require('node-fetch');
const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');
const credentials = {key: privateKey, cert: certificate};
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const bodyParser = require('body-parser');

app.set('view-agent', 'ejs');

app.use(bodyParser.json());
app.use('/static', express.static('public'));

// CORS fix supposedly
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// create root route
app.get('/', async (request, response) => {
  response.render('index.ejs');
});

// weather endpoint
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


// user authentication
app.use(express.json());
const users = [];

app.get('/login', async (request, response) => {
  response.render('login.ejs');
});
app.get('/register', (request, response) => {
  response.render('register.ejs');
});

// user login
app.post('/login', async (request, response) => {
  const user = users.find(user => user.name === request.body.name);
  if(user == null){
    return response.status(400).send("Can't find user");
  } else{
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

// create and push users to database
app.post('/register', async (request, response) => {
  try{
    // bigger the salt the more secure -- but more time to make hash default 10
    const hashedPassword = await bcrypt.hash(request.body.password, 10);
    console.log(hashedPassword);
    const user = {name: request.body.name, password: hashedPassword};
    users.push(user);
    response.status(201).send();
  } catch(error) {
    response.status(500).send();
    console.log(error);
  }
});

const httpServer = http.createServer(app);
//const httpsServer = https.createServer(credentials, app);
console.log("Creating server");
httpServer.listen(80);
//httpsServer.listen(8443);
