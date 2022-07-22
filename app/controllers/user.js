const bcrypt = require("bcrypt");

//import cryptojs for encrypt email
const cryptojs = require("crypto-js");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
require("dotenv").config();

exports.signup = (req, res, next) => {
  //Encrypt email before sending it to database
  const emailCryptoJs = cryptojs
    .HmacSHA256(req.body.email, process.env.CLE_SECRETE)
    .toString();
  bcrypt
    //call function hash by bcrypt to password with a salt 10 times to make it safer
    //create an user and save it in database, send message if it's created and error if not
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: emailCryptoJs,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "User created !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "User not found !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ error: "Your password is incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            //chiffrer un nouveau token
            token: jwt.sign(
              //userId entant playload
              { userId: user._id },
              //random token dispo pendant 24h
              process.env.RANDOM_TOKEN_SECRET,
              { expiresIn: "24h" }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
