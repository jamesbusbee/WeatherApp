const mongo = require('mongoose');

// create user attributes
const userSchema = new mongo.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    unique: true,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

let User = mongo.model('User', userSchema);

module.exports = User;
