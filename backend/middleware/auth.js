const jwt = require("jsonwebtoken");
require("dotenv").config({ path: __dirname + "../.env" });

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; //Without Bearer
    if (token == null) return res.sendStatus(401); //No Token
    jwt.verify(token, `${process.env.saltString}`, (err, decodedToken) => {
      if (err) return res.sendStatus(403); //Not Authorized
      if (req.query.id !== decodedToken.userId) {
        res.status(401).json({
          error: new Error("Unauthorized Access"),
        });
      } else {
        next();
      }
    });
    //bad request
  } catch {
    res.status(400).json({
      error: new Error("Invalid request!"),
    });
  }
};
