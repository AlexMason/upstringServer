const router = require("express").Router();
const { Op } = require("sequelize");
const { Tags } = require("../models");

router.get("/", async (req, res) => {
  let tags = await Tags.findAll();
  res.status(200).json({ tags });
});

router.post("/", async (req, res) => {
  try {
    let tag = await Tags.create({ name: req.body.name });

    res.status(200).json({ message: "Tag created.", tag });
  } catch (error) {
    res.status(500).json({ message: "Issue creating tag" });
  }
});

router.get("/:query", async (req, res) => {
  Tags.findAll({
    where: {
      name: {
        [Op.iLike]: `%${req.params.query}%`,
      },
    },
    limit: 10,
  }).then((results) => {
    res.status(200).json(results);
  });
});

module.exports = router;
