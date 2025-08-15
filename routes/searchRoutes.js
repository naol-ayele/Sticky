const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { searchNotes } = require("../controllers/searchController");

router.use(authMiddleware);

router.get("/notes", searchNotes);

module.exports = router;
