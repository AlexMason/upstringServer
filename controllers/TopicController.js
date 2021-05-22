const router = require("express").Router();
const { validateJWT } = require("../middleware");
const {
  Topics,
  Users,
  Comments,
  Tags,
  Ratings,
  TopicTags,
} = require("../models");

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
        Ratings,
        Comments,
      ],
    });

    res.status(200).json(topics);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get("/test", async (req, res) => {
  let fakeTags = ["html", "css", "test"];

  findOrCreateTags(fakeTags);

  res.status(200).json({});
});

/**
 * Get an individual topic.
 */
router.get("/:id", async (req, res) => {
  try {
    const topic = await Topics.findByPk(req.params.id, {
      include: [
        { model: Users, attributes: { exclude: ["password"] } },
        { model: Comments, include: [Users, Ratings] },
        { model: Ratings },
        { model: Tags },
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
  const { title, body, status, selectedTags } = req.body;

  try {
    Topics.create({
      title,
      body,
      status,
      userId: req.user.id,
    }).then((topic) => {
      findOrCreateTags(selectedTags).then((tags) => {
        TopicTags.destroy({ where: { topicId: topic.id } });
        TopicTags.bulkCreate(
          tags.map((tag) => {
            return {
              tagId: tag[0].id,
              topicId: topic.id,
            };
          })
        );
      });

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
    const { title, body, status, selectedTags } = req.body;
    let topic = await Topics.findByPk(req.params.id, { includes: TopicTags });

    if (topic.userId !== req.user.id && req.user.role !== 2) {
      res.status(403).json({
        message: "You are not permitted do this action.",
      });
    }

    topic.title = title;
    topic.body = body;
    topic.status = status;

    findOrCreateTags(selectedTags).then((tags) => {
      TopicTags.destroy({ where: { topicId: req.params.id } });
      TopicTags.bulkCreate(
        tags.map((tag) => {
          return {
            tagId: tag[0].id,
            topicId: req.params.id,
          };
        })
      );
    });

    topic.save();

    res.status(200).json({ topic });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
});

/**
 * Delete a topic.
 */
router.delete("/:id", validateJWT, async (req, res) => {
  try {
    let topic = await Topics.findByPk(req.params.id);

    if (topic.userId !== req.user.id && req.user.role !== 2) {
      res.status(403).json({
        message: "You are not permitted do this action.",
      });
    }

    topic.destroy();

    res.status(200).json({ message: "Topic deleted" });
  } catch (err) {
    res.status(500).json({ err });
  }
});

/**
 * Lock a topic.
 */

router.post("/lock/:id", validateJWT, async (req, res) => {
  try {
    let topic = await Topics.findByPk(req.params.id);

    if (req.user.role < 1) {
      res.status(403).json({
        message: "You are not permitted do this action.",
      });
    }

    let { locked } = req.body;

    topic.status = locked ? "locked" : "public";

    topic.save();
  } catch (err) {}
});

module.exports = router;

findOrCreateTags = (queryTags) => {
  return Promise.all(
    queryTags.map(async (tag) => {
      return await Tags.findOrCreate({
        where: { name: tag },
        defaults: { name: tag },
      });
    })
  );
};
