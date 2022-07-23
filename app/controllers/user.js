const bcrypt = require("bcrypt");

//import cryptojs for encrypt email
const cryptojs = require("crypto-js");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
require("dotenv").config();

function encrypt(value) {
  return cryptojs.AES.encrypt(value, process.env.CRYPTO_KEY).toString();
}

function decrypt(value) {
  return cryptojs.AES.decrypt(value, process.env.CRYPTO_KEY).toString(
    cryptojs.enc.Utf8
  );
}

exports.signup = (req, res, next) => {
  //Encrypt email before sending it to database
  bcrypt
    //call function hash by bcrypt to password with a salt 10 times to make it safer
    //create an user and save it in database, send message if it's created and error if not
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: encrypt(req.body.email),
        password: hash,
      });
      user
        .save()
        .then((newUser) => {
          newUser.email = decrypt(newUser.email);
          res.status(201).json({ message: "User created !", user: newUser });
        })
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
              `${process.env.JWT_TOKEN}`,
              { expiresIn: "24h" }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
