require("dotenv").config();

const jwt = require("jsonwebtoken");
const { Users } = require("../models");

const validateJWT = async (req, res, next) => {
  if (req.method == "OPTIONS") {
    next();
  } else if (
    req.headers.authorization &&
    req.headers.authorization.includes("Bearer")
  ) {
    const { authorization } = req.headers;

    try {
      const payload = authorization
        ? jwt.verify(
            authorization.includes("Bearer")
              ? authorization.split(" ")[1]
              : authorization,
            process.env.JWT_SECRET
          )
        : undefined;

      if (payload) {
        let foundUser = await Users.findOne({ where: { id: payload.id } });

        if (foundUser) {
          req.user = foundUser;
          next();
        } else {
          res.status(400).send({ message: "Not Authorized" });
        }
      } else {
        res.status(401).send({ message: "Invalid token" });
      }
    } catch (error) {
      res.status(500).send({
        message: "Error with the token",
        authorization: req.headers.authorization,
      });
    }
  } else {
    res.status(403).send({ message: "Forbidden" });
  }
};

module.exports = validateJWT;
