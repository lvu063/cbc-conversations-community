const request = require("supertest");
const express = require("express");
const cors = require("cors");

// Recreate app without starting the server
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "CBC Conversations API is running" });
});

app.get("/api/topics", (req, res) => {
  res.json({
    en: ["CBC Gem", "CBC News", "CBC Radio", "CBC Sports", "General"],
    fr: ["CBC Gem", "CBC Nouvelles", "CBC Radio", "CBC Sports", "Général"],
  });
});

app.get("/api/stats", (req, res) => {
  res.json({
    platform: "CBC Conversations Community",
    version: "1.0.0",
    languages: ["en", "fr"],
    features: ["real-time posts", "replies", "voting", "bilingual support"],
  });
});

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

// TESTS
describe("CBC Conversations API", () => {

  test("1. GET / returns API status", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("CBC Conversations API is running");
  });

  test("2. GET /api/topics returns bilingual topics", async () => {
    const res = await request(app).get("/api/topics");
    expect(res.statusCode).toBe(200);
    expect(res.body.en).toContain("CBC Gem");
    expect(res.body.fr).toContain("CBC Nouvelles");
  });

  test("3. GET /api/stats returns platform info", async () => {
    const res = await request(app).get("/api/stats");
    expect(res.statusCode).toBe(200);
    expect(res.body.platform).toBe("CBC Conversations Community");
    expect(res.body.languages).toContain("fr");
  });

  test("4. POST /api/validate-post rejects empty text", async () => {
    const res = await request(app)
      .post("/api/validate-post")
      .send({ text: "", author: "Angie" });
    expect(res.statusCode).toBe(400);
    expect(res.body.valid).toBe(false);
  });

  test("5. POST /api/validate-post accepts valid post", async () => {
    const res = await request(app)
      .post("/api/validate-post")
      .send({ text: "I love Kim's Convenience on CBC Gem!", author: "Angie" });
    expect(res.statusCode).toBe(200);
    expect(res.body.valid).toBe(true);
  });

});