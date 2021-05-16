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
router.put("/:id", (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ err });
  }
});

/**
 * Delete a comment.
 */
router.delete("/:id", (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ err });
  }
});

module.exports = router;
