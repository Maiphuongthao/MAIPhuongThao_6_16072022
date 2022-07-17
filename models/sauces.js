const mongoose = require("mongoose");

const saucesSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  inStock: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true, min: 1, max: 10},
  likes: { type: Number, default: 0, required: true },
  dislikes: { type: Number, default: 0, required: true },
  usersLiked: { type: String, ref: 'User', required: true },
  usersDisliked: { type: String, ref: 'User', required: true }
});

module.exports = mongoose.model("Thing", thingSchema);
