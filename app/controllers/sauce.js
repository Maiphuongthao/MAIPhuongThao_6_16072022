const Sauce = require("../models/sauce");

//Search if of sauce é get one sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id:req.params.id})
    .then((sauce) => {
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
  console.log(sauceObject);
  //delete the id as it'll be generate automatique
  delete sauceObject._id;
  //delete userId who create sauce as it is'nt reliable. Use only userId which comes from token
  delete sauceObject.userId;
  //create new sauce
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
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



//
