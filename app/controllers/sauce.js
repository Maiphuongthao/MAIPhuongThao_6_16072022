const { json } = require("express");
const Sauce = require("../models/sauce");
const fs = require("fs");

//Search if of sauce é get one sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      sauce.imageUrl = `${req.protocol}://${req.get("host")}${sauce.imageUrl}`;
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

// get all sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      sauces = sauces.map((sauce) => {
        sauce.imageUrl = `${req.protocol}://${req.get("host")}${
          sauce.imageUrl
        }`;
        return { ...sauce.toObject() };
      });
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.createSauce = (req, res, next) => {
  //parse objet to string
  const sauceObject = JSON.parse(req.body.sauce);
  //delete the id as it'll be generate automatique
  delete sauceObject._id;
  //delete userId who create sauce as it is'nt reliable. Use only userId which comes from token
  delete sauceObject.userId;
  //create new sauce
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `/images/${req.file.filename}`,
  });

  sauce
    .save()
    .then((newSauce) => {
      res.status(201).json({ newSauce });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//Like =1 means like, 0 means nothing, -1 means dislike
//userID adds or remove from array. each user has only one value to one sauce
//total like & dislike be updated each round
//Like & dislike sauce

exports.likeAndDislike = (req, res, next) => {
  //find sauce id
  Sauce.findOne({ _id: req.params.id })
    .then((sauceFound) => {
      const userLikedSauce = sauceFound.usersLiked.includes(req.body.userId);
      const userDislikedSauce = sauceFound.usersDisliked.includes(
        req.body.userId
      );
      //Case like = 1/////////////////////////
      switch (req.body.like) {
        case 1:
          //if userId in usersLiked is true
          if (userDislikedSauce) {
            likeStatement = {
              $inc: { likes: 1, dislikes: -1 },
              $push: { usersLiked: req.body.userId },
              $pull: { usersDisliked: req.body.userId },
            };
          } else if (!userLikedSauce) {
            Sauce.updateOne(
              { _id: req.params.id },
              { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } },
              {
                new: true,
              }
            )
              .then((updateSauce) =>
                res.status(200).json({ message: "Like added", updateSauce })
              )
              .catch((error) => res.status(400).json({ error }));
          } else {
            res.status(200).json({ message: "You already liked the sauce" });
          }
          break;
        //Case like = 0
        case 0:
          if (userLikedSauce) {
            Sauce.updateOne(
              { _id: req.params.id },
              { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } },
              {
                new: true,
              }
            )
              .then((updateSauce) => res.status(200).json({ updateSauce }))
              .catch((error) => res.status(400).json({ error }));
          } else if (userDislikedSauce) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $pull: { usersDisliked: req.body.userId },
                $inc: { dislikes: -1 },
              },
              { new: true }
            )
              .then((updateSauce) => res.status(200).json({ updateSauce }))
              .catch((error) => res.status(400).json({ error }));
          } else if (userDislikedSauce && userLikedSauce) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $pull: {
                  usersDisliked: req.body.userId,
                  usersLiked: req.body.userId,
                },
                $inc: { dislikes: -1, like: -1 },
              },
              { new: true }
            )
              .then((updateSauce) => res.status(200).json({ updateSauce }))
              .catch((error) => res.status(400).json({ error }));
          } else {
            res.status(200).json({ message: " vote is reset" });
          }
          break;

        //Case like = -1//////////////////
        case -1:
          if (userLikedSauce) {
            likeStatement = {
              $inc: { likes: -1, dislikes: 1 },
              $pull: { usersLiked: req.body.userId },
              $push: { usersDisliked: req.body.userId },
            };
          } else if (!userDislikedSauce) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: req.body.userId },
              },
              {
                new: true,
              }
            )
              .then((updateSauce) => res.status(200).json({ updateSauce }))
              .catch((error) => res.status(400).json({ error }));
          } else {
            res.status(200).json({ message: "You already Disliked the sauce" });
          }

          break;
      }
    })
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
};

//update Sauce
exports.modifySauce = (req, res, next) => {
  //Check if image file existe or not, if yes create sauceObject with new img, if not only other info
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `/images/${req.file.filename}`,
      }
    : { ...req.body };

  delete sauceObject._userId; //delete object userId for security

  //get sauce id
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: "Unauthorized request" });
      } else {
        Sauce.updateOne(
          //{ _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then((updatedSauce) =>
            res.status(200).json({ message: "Objet modifié!", updatedSauce })
          )
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//delete Sauce
//Check userId of the sauce if it's correct then appel the img url that we know it's from images file, delete the image with unlink from fs,
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: "Unthorized request" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(204).send();
            })
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
