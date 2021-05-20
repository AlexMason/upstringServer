const router = require("express").Router();
const { Ratings } = require("../models");
const { validateJWT } = require("../middleware");

router.post("/comment/:id", validateJWT, async (req, res) => {
  const { positive } = req.body;

  try {
    let curRating = await Ratings.findOne({
      where: {
        commentId: req.params.id,
        userId: req.user.id,
      },
    });

    if (curRating) {
      //update or delete
      if (curRating.positive === positive) {
        curRating.destroy();
      } else {
        curRating.positive = positive;
        curRating.save();
      }
    } else {
      //new
      Ratings.create({
        positive,
        commentId: req.params.id,
        userId: req.user.id,
      });
    }
    res.status(200).json({ message: "rating updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "You shouldn't ever get this." });
  }
});

router.post("/topic/:id", validateJWT, async (req, res) => {
  const { positive } = req.body;

  try {
    let curRating = await Ratings.findOne({
      where: {
        topicId: req.params.id,
        userId: req.user.id,
      },
    });

    if (curRating) {
      //update
      if (curRating.positive === positive) {
        curRating.destroy();
      } else {
        curRating.positive = positive;
        curRating.save();
      }
    } else {
      //new
      Ratings.create({
        positive,
        topicId: req.params.id,
        userId: req.user.id,
      });
    }

    res.status(200).json({ message: "rating updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "You shouldn't ever get this." });
  }
});

module.exports = router;
