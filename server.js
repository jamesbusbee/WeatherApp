require('dotenv').config();
const fs = require('fs');
const http = require('http');
const https = require('https');
const fetch = require('node-fetch');
const privateKey = fs.readFileSync('/static/key.pem', 'utf8');
const certificate = fs.readFileSync('/static/cert.pem', 'utf8');
const credentials = {key: privateKey, cert: certificate};
const express = require('express');
const path = require('path');
const app = express();

app.use('/static', express.static('public'));
// create root route
app.get('/', async (request, response) => {
  response.sendFile(path.join(__dirname, '/index.html'));
});

// location endpoint
//app.get('/', async (request, response) => {
  //response.sendFile(path.join(__dirname, '/index.html'));
//});

// weather endpoint
app.get('/weather/:latlng', async (request, response) => {
  const latlng = request.params.latlng.split(',');
  const lat = latlng[0];
  const lng = latlng[1];
  const dsKey = process.env.DARK_SKY_KEY;
  const dsUrl = `https://api.darksky.net/forecast/${dsKey}/${lat},${lng}`;
  const fetchResponse = await fetch(dsUrl);
  const json = await fetchResponse.json();
  console.log(json);
  response.json(json);
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
console.log("Creating server");
httpServer.listen(80);
httpsServer.listen(8443);
