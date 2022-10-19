//Packeges refrences

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

//Routes refrences
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

const app = express();

/**
 * This tells Express to take any incoming request that has Content-Type(Header) application/json
 * and make its  body  available on the  req  object, allowing
 * us to write the  POST middleware with console.log(req.body);
 */

app.use(express.json());

/**
 *  Normalize a port into a number, string, or false.
 * @param {*} val
 * @returns {boolean||string} Safety railguard to make sure the port provided is number, if not a number then a string and if anything else set it to false.
 * @example normalizePort('string') => false
 * @example normalizePort('3000') => 3000
 * @example normalizePort(3000) => 3000
 **/
const normalizePort = (value) => {
  const port = parseInt(value, 10);
  if (isNaN(port)) {
    return value;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

/**
 * Set port number by calling normalizePort
 **/
const port = normalizePort(process.env.PORT || "3000");

app.listen(port);
//Using mongooses framework to connect our MongoDB
mongoose
  .connect(
    `mongodb+srv://${process.env.MongoDbUser}:${process.env.MongoDbPass}@${process.env.MongoDbCluster}`
  )
  .then(() => {
    console.log("succesfuly connected to MongoDB atlas");
  })
  .catch((err) => console.log(err));

/**
 * images route
 */
app.use("/images", express.static(path.join(__dirname, "images")));
/**
 * Avoiding Cross Origin issues
 */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//Any call for the server will be routed accordingly
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

module.exports = app;
