const express = require("express");
const axios = require("axios");
const cors = require("cors");
const curatedRefs = require("./curatedRefs.json");
const { cleanWikiDescription } = require("./utils");

const app = express();
const PORT = 3000;

app.use(cors());

app.get("/reference", async (req, res) => {
  const searchTerm = req.query.term?.toLowerCase();

  // Step 1: Check curated references
  if (curatedRefs[searchTerm]) {
    return res.json({
      ...curatedRefs[searchTerm],
      source: "curated"
    });
  }

  // Step 2: Fallback to Wikipedia API
  try {
    const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`);
    return res.json({
      title: response.data.title,
      description: cleanWikiDescription(response.data.extract),
      image: response.data.thumbnail?.source || null,
      link: response.data.content_urls?.desktop?.page || null,
      source: "wikipedia"
    });
  } catch (err) {
    return res.status(404).json({ error: "Reference not found" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
