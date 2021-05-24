const router = require("express").Router();
const { Comments } = require("../models");
const { validateJWT } = require("../middleware");

/**
 * Get an individual comment.
 */
router.get("/:id", (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ err });
  }
});

/**
 * Create a comment.
 */
router.post("/", validateJWT, (req, res) => {
  const { body, topicId } = req.body;

  console.log(req.body);
  try {
    Comments.create({ body, topicId, userId: req.user.id }).then((comment) => {
      res.status(201).json({
        message: "Comment created.",
        comment,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
});

/**
 * Update a comment.
 */
router.put("/:id", validateJWT, async (req, res) => {
  try {
    let comment = await Comments.findByPk(req.params.id);

    if (comment) {
      if (comment.userId !== req.user.id && req.user.role !== 2) {
        res.status(403).json({
          message: "You are not permitted do this action.",
        });
      }

      comment.body = req.body.body;

      comment.save();
    }

    res.status(200).json({ message: "Topic updated." });
  } catch (err) {
    res.status(500).json({ err });
  }
});

/**
 * Delete a comment.
 */
router.delete("/:id", validateJWT, async (req, res) => {
  try {
    let comment = await Comments.findByPk(req.params.id);

    if (comment) {
      if (comment.userId !== req.user.id && req.user.role !== 2) {
        res.status(403).json({
          message: "You are not permitted do this action.",
        });
      }

      comment.destroy();
    }

    res.status(200).json({ message: "Topic deleted." });
  } catch (err) {
    res.status(500).json({ err });
  }
});

module.exports = router;
