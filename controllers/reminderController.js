// src/controllers/reminderController.js
const { Note } = require("../db/models");
const cron = require("node-cron");

// Set reminder for a note
exports.setReminder = async (req, res) => {
  try {
    const { reminderAt } = req.body;
    const note = await Note.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!note) return res.status(404).json({ message: "Note not found" });

    await note.update({ reminderAt });
    scheduleReminder(note); // schedule notification
    res.json({ message: "Reminder set", note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove reminder
exports.removeReminder = async (req, res) => {
  try {
    const note = await Note.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!note) return res.status(404).json({ message: "Note not found" });

    await note.update({ reminderAt: null });
    res.json({ message: "Reminder removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get upcoming reminders
exports.getReminders = async (req, res) => {
  try {
    const now = new Date();
    const reminders = await Note.findAll({
      where: {
        userId: req.user.id,
        reminderAt: { [Note.sequelize.Op.gt]: now },
        isTrashed: false,
      },
      order: [["reminderAt", "ASC"]],
    });

    res.json({ reminders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Simple scheduler example (can integrate push notifications)
const scheduleReminder = (note) => {
  if (!note.reminderAt) return;
  const date = new Date(note.reminderAt);
  const cronTime = `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${
    date.getMonth() + 1
  } *`;

  cron.schedule(cronTime, () => {
    console.log(`Reminder: Note "${note.title}" is due now!`);
    // Here you can integrate Firebase/Push notification for Flutter app
  });
};
