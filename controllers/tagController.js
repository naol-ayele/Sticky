// src/controllers/tagController.js
const { Tag, Note, NoteTag } = require("../db/models");

// Create a tag
exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Tag name is required" });

    const [tag, created] = await Tag.findOrCreate({
      where: { name, userId: req.user.id },
    });

    if (!created)
      return res.status(400).json({ message: "Tag already exists" });

    res.status(201).json({ tag });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all tags for the user
exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.findAll({ where: { userId: req.user.id } });
    res.json({ tags });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update tag
exports.updateTag = async (req, res) => {
  try {
    const tag = await Tag.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!tag) return res.status(404).json({ message: "Tag not found" });

    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Tag name is required" });

    await tag.update({ name });
    res.json({ message: "Tag updated", tag });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete tag
exports.deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!tag) return res.status(404).json({ message: "Tag not found" });

    // Optional: remove associations from NoteTag
    await NoteTag.destroy({ where: { tagId: tag.id } });
    await tag.destroy();

    res.json({ message: "Tag deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
