const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
/**
 * will check any fields with unique:true and validate before saving in DB
 */
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
