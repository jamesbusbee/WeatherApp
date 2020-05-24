const mongo = require('mongoose');

const userSchema = new mongodb.Schema({
  name: {type: String, unique: true},
  email: {type: String, unique:true},
  password: String
});

const User = mongo.model('myuser', userSchema);
module.exports = User;
