const router = require("express").Router();
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

module.exports = router;
