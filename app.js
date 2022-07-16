const express = require('express');
const mongoose = require('mongoose');


const app = express();

mongoose
  .connect(
    "mongodb+srv://MongoDbaloalo:MongoDbaloalo@cluster0.iz8ulle.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());