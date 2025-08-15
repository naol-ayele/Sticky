const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  setReminder,
  removeReminder,
  getReminders,
} = require("../controllers/reminderController");

router.use(authMiddleware);

router.post("/:id", setReminder);
router.delete("/:id", removeReminder);
router.get("/", getReminders);

module.exports = router;
