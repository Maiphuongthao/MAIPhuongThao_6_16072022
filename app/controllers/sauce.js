const Sauce = require('../models/sauce');

//Search if of sauce é get one sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
      _id: req.params.id,
    })
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

