const router = require("express").Router();
const { UniqueConstraintError } = require("sequelize");
const { validateJWT } = require("../middleware");
const { Users, Topics, Comments } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/", validateJWT, (req, res) => {
  res.status(200).json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      username: req.user.username,
      role: req.user.role,
    },
  });
});

router.get("/topics/:id", async (req, res) => {
  try {
    let topics = await Topics.findAll({
      where: {
        userId: req.params.id,
      },
    });

    res.status(200).json(topics);
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.get("/comments/:id", async (req, res) => {
  try {
    let comments = await Comments.findAll({
      where: {
        userId: req.params.id,
      },
    });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let user = await Users.findByPk(req.params.id);

    let { id, email, firstName, lastName, username } = user;

    res.status(200).json({
      user: {
        id,
        email,
        username,
        firstName,
        lastName,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error,
    });
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  console.log(req.body);
  try {
    Users.findOne({
      where: {
        username,
      },
    })
      .then((user) => {
        //compare password
        if (bcrypt.compareSync(password, user.password)) {
          //password matches
          let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

          res.status(200).json({
            message: "User successfully logged in",
            token,
            user,
          });
        } else {
          //invalid password
          res.status(401).json({
            error: "Invalid username or password.",
          });
        }
      })
      .catch((err) => {
        //invalid username
        res.status(401).json({
          error: "Invalid username or password.",
        });
      });
  } catch (error) {
    res.status(500).json({ error: error });
  }

  try {
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post("/register", (req, res) => {
  const { username, password, email, firstName, lastName } = req.body;

  console.log(req.body);

  try {
    Users.create({
      username,
      password: bcrypt.hashSync(password, 12),
      email,
      firstName,
      lastName,
    })
      .then((user) => {
        let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "24h",
        });

        res.status(201).json({
          message: "User successfully created.",
          token,
          user,
        });
      })
      .catch((err) => {
        if (typeof err === UniqueConstraintError) {
          res.status(401).json({
            message: "That email or username already exists.",
          });
        }

        res.status(401).json({ message: "Something went wrong." });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

module.exports = router;
