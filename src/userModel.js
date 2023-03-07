const mongoose = require('mongoose')

const userModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})

const UserModel = new mongoose.model('LogInCollection', userModel)

module.exports = UserModel
