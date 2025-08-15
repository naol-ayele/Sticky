// src/controllers/noteController.js
const {
  Note,
  Tag,
  NoteTag,
  Attachment,
  User,
  Sequelize,
} = require("../db/models");
const { Op } = Sequelize;

// Create Note
exports.createNote = async (req, res) => {
  try {
    const { title, content, color, isPinned, isArchived, tags, reminderAt } =
      req.body;

    const note = await Note.create({
      title,
      content,
      color: color || "#FFFFFF",
      isPinned: isPinned || false,
      isArchived: isArchived || false,
      reminderAt: reminderAt || null,
      userId: req.user.id,
    });

    // Handle tags (array of tag names)
    if (tags && tags.length) {
      const tagRecords = await Promise.all(
        tags.map(async (t) => {
          const [tag] = await Tag.findOrCreate({
            where: { name: t, userId: req.user.id },
          });
          return tag;
        })
      );
      await note.addTags(tagRecords);
    }

    res.status(201).json({ note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all notes with filters
exports.getNotes = async (req, res) => {
  try {
    const { search, tag, color, pinned, archived, trashed } = req.query;

    const where = { userId: req.user.id };
    if (search)
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } },
      ];
    if (color) where.color = color;
    if (pinned) where.isPinned = pinned === "true";
    if (archived) where.isArchived = archived === "true";
    if (trashed) where.isTrashed = trashed === "true";

    const include = [];
    if (tag) {
      include.push({
        model: Tag,
        where: { name: tag },
        through: { attributes: [] },
      });
    } else {
      include.push({ model: Tag, through: { attributes: [] } });
    }

    const notes = await Note.findAll({
      where,
      include,
      order: [
        ["isPinned", "DESC"],
        ["updatedAt", "DESC"],
      ],
    });

    res.json({ notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single note
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{ model: Tag, through: { attributes: [] } }, Attachment],
    });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Note
exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!note) return res.status(404).json({ message: "Note not found" });

    const {
      title,
      content,
      color,
      isPinned,
      isArchived,
      isTrashed,
      tags,
      reminderAt,
    } = req.body;

    await note.update({
      title,
      content,
      color,
      isPinned,
      isArchived,
      isTrashed,
      reminderAt,
    });

    if (tags) {
      const tagRecords = await Promise.all(
        tags.map(async (t) => {
          const [tag] = await Tag.findOrCreate({
            where: { name: t, userId: req.user.id },
          });
          return tag;
        })
      );
      await note.setTags(tagRecords);
    }

    res.json({ message: "Note updated", note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Soft Delete (Trash)
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!note) return res.status(404).json({ message: "Note not found" });

    await note.update({ isTrashed: true });
    res.json({ message: "Note moved to trash" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Permanent Delete
exports.deleteNotePermanent = async (req, res) => {
  try {
    const note = await Note.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!note) return res.status(404).json({ message: "Note not found" });

    await note.destroy();
    res.json({ message: "Note permanently deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
