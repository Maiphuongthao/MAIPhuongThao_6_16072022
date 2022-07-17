const express = require('express');
const cors = require('cors');
require('dotenv').config();
require("./config/db.config");


const app = express();


const corsOptions = {
    origin: 'http://localhost:4200/'
};




app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.json({ message: "Welcome to piiquante application." });
  });
const PORT= process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}.`);
})
