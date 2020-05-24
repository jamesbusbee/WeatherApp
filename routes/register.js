const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongo = require('mongoose');
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

// database connection
mongo.set('useUnifiedTopology', true);
mongo.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
const db = mongo.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log("Connected to Mongodb"));

//const Schema = mongo.Schema;

//const userSchema = new Schema({
  //name: {type: String, unique: true},
  //email: {type: String, unique:true},
  //password: String
//});

//let User = mongo.model('User', userSchema);

// register page route
router.get('/register', (request, response) => {
  response.render('register.ejs');
});

// take form data and insert user into database
router.post('/register', async (request, response) => {
  // bigger the salt the more secure -- but more time to make hash default 10
  const MongoClient = require('mongodb').MongoClient;
  const hashedPassword = await bcrypt.hash(request.body.password, 10);
  const data = {
    "name": request.body.name,
    "email": request.body.email,
    "password": hashedPassword
  }
  db.collection('users').insertOne(data, function(error, collection){
    if (error) throw error;
    console.log("Document inserted successfully");
  });
  return response.redirect('/');
});

module.exports = router;
