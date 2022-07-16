const mongoose = require(`mongoose`);
require("dotenv").config();

if (!process.env.MONGO_URI) {
  console.log("MONGO_URI not found on .env !");
}
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection to database established ");
  })
  .catch((error) => {
    console.log("Connection failed" + error);
  });

module.exports = mongoose.connection;
