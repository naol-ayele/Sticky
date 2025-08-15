const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  deleteNotePermanent,
} = require("../controllers/noteController");

// All routes require authentication
router.use(authMiddleware);

router.post("/", createNote);
router.get("/", getNotes);
router.get("/:id", getNoteById);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote); // soft delete
router.delete("/:id/permanent", deleteNotePermanent);

module.exports = router;
