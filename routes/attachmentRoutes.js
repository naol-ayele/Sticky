const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  uploadMiddleware,
  uploadAttachments,
  deleteAttachment,
} = require("../controllers/attachmentController");

router.use(authMiddleware);

router.post("/:id", uploadMiddleware, uploadAttachments);
router.delete("/:fileId", deleteAttachment);

module.exports = router;
