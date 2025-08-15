const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createTag,
  getTags,
  updateTag,
  deleteTag,
} = require("../controllers/tagController");

router.use(authMiddleware);

router.post("/", createTag);
router.get("/", getTags);
router.put("/:id", updateTag);
router.delete("/:id", deleteTag);

module.exports = router;
