const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { syncNotes } = require("../controllers/syncController");

router.use(authMiddleware);

router.post("/notes", syncNotes);

module.exports = router;
