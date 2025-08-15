// src/controllers/attachmentController.js
const { Attachment, Note } = require("../db/models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Local storage setup (can replace with S3 or Cloudinary)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Middleware to use in routes
exports.uploadMiddleware = upload.array("attachments", 5); // max 5 files per request

// Upload attachments for a note
exports.uploadAttachments = async (req, res) => {
  try {
    const note = await Note.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!note) return res.status(404).json({ message: "Note not found" });

    const files = req.files;
    if (!files || !files.length)
      return res.status(400).json({ message: "No files uploaded" });

    const attachments = await Promise.all(
      files.map((file) =>
        Attachment.create({
          fileUrl: file.path,
          fileName: file.originalname,
          noteId: note.id,
        })
      )
    );

    res.status(201).json({ message: "Files uploaded", attachments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete an attachment
exports.deleteAttachment = async (req, res) => {
  try {
    const attachment = await Attachment.findOne({
      where: { id: req.params.fileId },
      include: { model: Note, where: { userId: req.user.id } },
    });
    if (!attachment)
      return res.status(404).json({ message: "Attachment not found" });

    // Delete file from local storage
    if (fs.existsSync(attachment.fileUrl)) fs.unlinkSync(attachment.fileUrl);

    await attachment.destroy();
    res.json({ message: "Attachment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
