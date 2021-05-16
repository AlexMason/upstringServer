const router = require("express").Router();
const { validateJWT } = require("../middleware");
const { Topics, Users, Comments, Tags } = require("../models");

/**
 * Get top 20 topics.
 */
router.get("/", async (req, res) => {
  try {
    const topics = await Topics.findAll({
      where: {
        status: "public",
      },
      limit: 20,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Users,
          attributes: { exclude: ["password"] },
        },
        Tags,
      ],
    });

    res.status(200).json(topics);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

/**
 * Get an individual topic.
 */
router.get("/:id", async (req, res) => {
  try {
    const topic = await Topics.findByPk(req.params.id, {
      include: [
        { model: Users, attributes: { exclude: ["password"] } },
        { model: Comments, include: [Users] },
      ],
    });

    res.status(200).json(topic);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

/**
 * Create a topic.
 */
router.post("/", validateJWT, (req, res) => {
  const { title, body, status } = req.body;
  try {
    Topics.create({
      title,
      body,
      status,
      userId: req.user.id,
    }).then((topic) => {
      res.status(201).json({
        message: "Topic created.",
        topic,
      });
    });
  } catch (err) {
    res.status(500).json({ err });
  }
});

/**
 * Update a topic.
 */
router.put("/:id", validateJWT, async (req, res) => {
  try {
    const { title, body, status } = req.body;
    let topic = await Topics.findByPk(req.params.id);

    topic.title = title;
    topic.body = body;
    topic.status = status;

    topic.save();

    res.status(200).json({ topic });
  } catch (err) {
    res.status(500).json({ err });
  }
});

/**
 * Delete a topic.
 */
router.delete("/:id", validateJWT, async (req, res) => {
  try {
    let topic = await Topics.findByPk(req.params.id);

    topic.destroy();

    res.status(200).json({ message: "Topic deleted" });
  } catch (err) {
    res.status(500).json({ err });
  }
});

module.exports = router;
