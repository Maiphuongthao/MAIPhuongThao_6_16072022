const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./app/config/db.config");


const app = express();

const router = require("./app/routes/index");

const corsOptions = {
  origin: "http://localhost:4200/",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
