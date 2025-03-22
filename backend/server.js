const express = require("express");
const axios = require("axios");
const cors = require("cors");
const curatedRefs = require("./curatedRefs.json");
const { cleanWikiDescription } = require("./utils");

const app = express();
const PORT = 3000;

app.use(cors());

app.get("/reference", async (req, res) => {
  // Log the incoming request
  console.log("[Request] /reference called with query:", req.query);

  // Extract and log the search term
  const searchTerm = req.query.term?.toLowerCase();
  console.log("[Info] Search term (toLowerCase):", searchTerm);

  // Step 1: Check curated references
  if (curatedRefs[searchTerm]) {
    console.log(`[Curated] Found an entry for "${searchTerm}". Sending curated response...`);
    return res.json({
      ...curatedRefs[searchTerm],
      source: "curated"
    });
  }

  // Step 2: Fallback to Wikipedia API
  console.log(`[Wikipedia] No curated entry for "${searchTerm}". Attempting Wikipedia lookup...`);
  try {
    const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`);

    // Log success
    console.log(`[Wikipedia] Successfully retrieved data for "${searchTerm}". Sending response...`);

    return res.json({
      title: response.data.title,
      description: cleanWikiDescription(response.data.extract),
      image: response.data.thumbnail?.source || null,
      link: response.data.content_urls?.desktop?.page || null,
      source: "wikipedia"
    });
  } catch (err) {
    // Log error
    console.error(`[Wikipedia] Lookup failed for "${searchTerm}". Error:`, err.message);

    return res.status(404).json({ error: "Reference not found" });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}\n`);
});