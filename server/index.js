const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "CBC Conversations API is running" });
});

// GET all topics
app.get("/api/topics", (req, res) => {
  res.json({
    en: ["CBC Gem", "CBC News", "CBC Radio", "CBC Sports", "General"],
    fr: ["CBC Gem", "CBC Nouvelles", "CBC Radio", "CBC Sports", "Général"],
  });
});

// GET stats
app.get("/api/stats", (req, res) => {
  res.json({
    platform: "CBC Conversations Community",
    version: "1.0.0",
    languages: ["en", "fr"],
    features: ["real-time posts", "replies", "voting", "bilingual support"],
  });
});

// POST validate a post before saving
app.post("/api/validate-post", (req, res) => {
  const { text, author } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ valid: false, error: "Post text cannot be empty" });
  }

  if (text.trim().length > 500) {
    return res.status(400).json({ valid: false, error: "Post text cannot exceed 500 characters" });
  }

  if (author && author.trim().length > 50) {
    return res.status(400).json({ valid: false, error: "Author name cannot exceed 50 characters" });
  }

  res.json({ valid: true, message: "Post is valid" });
});

app.listen(PORT, () => {
  console.log(`CBC Conversations API running on port ${PORT}`);
});