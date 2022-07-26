const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./app/config/db.config");
const app = express();
const router = require("./app/routes/index");
//require path module to interact with file systems
const path = require('path');

//add headers to avoid blocking from corps between 3000 & 4200
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

const corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
//Mangae images as static eachtime its runnign after /images
app.use('/images', express.static(path.join(__dirname, 'images')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
