const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const sauce = require('./sauce');

//Create schema of user information
const userSchema = mongoose.Schema({
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true}
})

//makesure that 2 users can't share the same email address before register
userSchema.plugin(uniqueValidator);

//export schema
module.exports = mongoose.model('User', userSchema);