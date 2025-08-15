require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { sequelize } = require("./db/models");

// Import routes
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const tagRoutes = require("./routes/tagRoutes");
const attachmentRoutes = require("./routes/attachmentRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const searchRoutes = require("./routes/searchRoutes");
const syncRoutes = require("./routes/syncRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads")); // serve attachments

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/attachments", attachmentRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/sync", syncRoutes);

// Test route
app.get("/", (req, res) => res.send("Sticky Notes API is running"));

// Sync DB and start server
const PORT = process.env.APP_PORT || 3000;
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
