//Packages and ENV file refrences
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: __dirname + "../.env" });

//Mongoose schema
const User = require("../models/user");

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 12).then((hash) => {
    // 12 is the number of salts, secure enough for most usage
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then(() => {
        res.status(201).json({
          message: "User added successfully!",
        });
      })
      .catch((error) => {
        res.status(500).json({
          error: "User already exists",
        });
      });
  });
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          error: new Error("User not found!"),
        });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              error: new Error("Incorrect password!"),
            });
          }
          const token = jwt.sign(
            { userId: user._id }, //serielize user id
            `${process.env.saltString}`,
            {
              expiresIn: "300m",
            }
          );
          res.status(200).json({
            //send token to client
            userId: user._id,
            token: token,
          });
        })
        .catch((error) => {
          res.status(500).json({
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};
