const mongoose = require('mongoose')
require('dotenv').config()

// Gets the database url environment variable
const { DB_URL } = process.env

mongoose.set('strictQuery', true)

module.exports = connect = async () => {
  mongoose
    .connect(DB_URL, {
      // Set the options for the connection
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log(`Mongoose connected to MongoDb database`))
}
