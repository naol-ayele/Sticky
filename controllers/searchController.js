// src/controllers/searchController.js
const { Note, Tag, Sequelize } = require("../db/models");
const { Op } = Sequelize;

// Search notes by keyword or tag
exports.searchNotes = async (req, res) => {
  try {
    const { keyword, tag } = req.query;
    const where = { userId: req.user.id };

    if (keyword) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${keyword}%` } },
        { content: { [Op.iLike]: `%${keyword}%` } },
      ];
    }

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
      order: [["updatedAt", "DESC"]],
    });
    res.json({ notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
