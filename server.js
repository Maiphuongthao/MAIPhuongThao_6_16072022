const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./app/config/db.config");
const app = express();
const router = require("./app/routes/index");
//require path module to interact with file systems
const path = require("path");
const mongoSanitize = require('express-mongo-sanitize');
//add helmet to help secure express modules
const helmet = require("helmet");
const slowDown = require("express-slow-down");
const hateoasLinker = require('express-hateoas-links');



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
  origin: "http://localhost:4200",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(hateoasLinker);
app.use(express.urlencoded({ extended: true }));


app.use("/api", router);
//Mangae images as static eachtime its running after /images
app.use("/images", express.static(path.join(__dirname, "images")));


// To remove data using these defaults:
app.use(mongoSanitize());

//Add slowdown speed limiter to slowdown the responses
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 100, // allow 100 requests per 15 minutes, then...
  delayMs: 500 // begin adding 500ms of delay per request above 100:
  // request # 101 is delayed by  500ms
  // request # 102 is delayed by 1000ms
  // request # 103 is delayed by 1500ms
  // etc.
});
//  apply to all requests
app.use(speedLimiter);
app.use(helmet());


//running port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
