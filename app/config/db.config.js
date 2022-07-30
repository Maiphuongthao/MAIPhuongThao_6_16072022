const mongoose = require(`mongoose`);
const bunyan = require('bunyan');
require("dotenv").config();

if (!process.env.MONGO_URI) {
  console.log("MONGO_URI not found on .env !");
}
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connection to database established ");
  })
  .catch((error) => {
    console.log("Connection failed" + error);
  });

module.exports = mongoose.connection;
