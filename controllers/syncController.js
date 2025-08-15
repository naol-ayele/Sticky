// src/controllers/syncController.js
const { Note, Tag, NoteTag, Attachment, Sequelize } = require("../db/models");
const { Op } = Sequelize;

/**
 * Sync notes from client
 * Client sends an array of notes with:
 * - id (optional, null if new)
 * - title, content, color, isPinned, isArchived, isTrashed, reminderAt
 * - tags: array of tag names
 * - updatedAt (client timestamp)
 */
exports.syncNotes = async (req, res) => {
  try {
    const clientNotes = req.body.notes;
    const userId = req.user.id;
    const syncedNotes = [];

    for (let cNote of clientNotes) {
      let note;

      if (cNote.id) {
        // Existing note: update if client is newer
        note = await Note.findOne({ where: { id: cNote.id, userId } });
        if (note && new Date(cNote.updatedAt) > note.updatedAt) {
          await note.update({
            title: cNote.title,
            content: cNote.content,
            color: cNote.color,
            isPinned: cNote.isPinned,
            isArchived: cNote.isArchived,
            isTrashed: cNote.isTrashed,
            reminderAt: cNote.reminderAt,
          });
        }
      }

      if (!note) {
        // New note
        note = await Note.create({
          title: cNote.title,
          content: cNote.content,
          color: cNote.color || "#FFFFFF",
          isPinned: cNote.isPinned || false,
          isArchived: cNote.isArchived || false,
          isTrashed: cNote.isTrashed || false,
          reminderAt: cNote.reminderAt || null,
          userId,
        });
      }

      // Handle tags
      if (cNote.tags && cNote.tags.length) {
        const tagRecords = await Promise.all(
          cNote.tags.map(async (t) => {
            const [tag] = await Tag.findOrCreate({
              where: { name: t, userId },
            });
            return tag;
          })
        );
        await note.setTags(tagRecords);
      }

      syncedNotes.push(note);
    }

    // Return all user's notes after sync
    const allNotes = await Note.findAll({
      where: { userId },
      include: [{ model: Tag, through: { attributes: [] } }, Attachment],
      order: [
        ["isPinned", "DESC"],
        ["updatedAt", "DESC"],
      ],
    });

    res.json({ notes: allNotes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sync failed" });
  }
};
