const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
//import cryptojs for encrypt email
const CryptoJS = require("crypto-js");
const { json } = require("express");

require("dotenv").config();

function encrypt(value) {
  return CryptoJS.AES.encrypt(
    value,
    CryptoJS.enc.Base64.parse(process.env.CRYPTO_KEY),
    {
      iv: CryptoJS.enc.Base64.parse(process.env.CRYPTO_IV),
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString();
}

function decrypt(value) {
  var bytes = CryptoJS.AES.decrypt(
    value,
    CryptoJS.enc.Base64.parse(process.env.CRYPTO_KEY),
    {
      iv: CryptoJS.enc.Base64.parse(process.env.CRYPTO_IV),
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  return bytes.toString(CryptoJS.enc.Utf8);
}

exports.signup = (req, res, next) => {
  //Encrypt email before sending it to database
  bcrypt
    //call function hash by bcrypt to password with a salt 10 times to make it safer
    //create a new user and save it in database with encrypted email, send message if it's created and error if not
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
  //Showing encrypted email and check with user given email
  const encryptedEmail = encrypt(req.body.email);
  User.findOne({ email: encryptedEmail })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "User not found !" });
      }

      //decrypte email from encrypted to compare with given email by user
      user.email = decrypt(user.email);
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
              process.env.JWT_TOKEN,
              { expiresIn: "24h" }
            ),
            //return user as correct user
            user: user,
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// read user
exports.readUser = (req, res, next) => {
  // Check the user login if it's existe
  User.findById(req.auth.userId)
    .then((user) => {
      if (!user) {
        res.status(401).json({ message: "user not found" });
      } else {
        // decrypt the email to be returned
        user.email = decrypt(user.email);
        res.status(200).json({ user });
      }
    })
    .catch((error) => res.status(500).json(error));
};

//export userData to txt file
exports.exportData = (req, res, next) => {
  // Check the user login if it's existe
  User.findById(req.auth.userId)
    .then((user) => {
      if (!user) {
        res.status(401).json({ message: "user not found" });
      } else {
        // decrypt the email to be returned
        user.email = decrypt(user.email);
        res.attachment("userData.txt");
        res.status(200).json(user.toString());
      }
    })
    .catch((error) => res.status(500).json(error));
};

//Modify user
exports.updateUser = (req, res, next) => {
  User.findById(req.auth.userId)
    // check the email of user
    .then((user) => {
      if (!user) {
        res.status(401).json({ message: "user not found" });
      } else {
        // update user data with new info, email need to be encrypted before adding to database
        User.findByIdAndUpdate(
          { _id: req.auth.userId },
          { ...req.body, email: encrypt(req.auth.email) },
          { new: true }
        )
          .then((updatedUser) => {
            //decrypt email to be returned
            updatedUser.email = decrypt(updatedUser.email);
            res
              .status(200)
              .json({ message: "User has been updated", updatedUser });
          })
          .catch((error) => res.status(400).json(error));
      }
    })
    .catch((error) => res.status(500).json(error));
};

//delete account
exports.deleteUser = (req, res, next) => {
  User.deleteOne({ _id: req.auth.userId })
    .then(() => {
      res.status(204).json({ message: "User deleted" });
    })
    .catch((error) => ({ error }));
};
