const express = require("express");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/facebook-reviews", async (req, res) => {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;

  if (!accessToken || !pageId) {
    return res.status(500).json({ error: "Missing Facebook credentials" });
  }

  try {
    const response = await axios.get(
      `https://graph.facebook.com/v17.0/${pageId}/ratings`,
      {
        params: {
          access_token: accessToken,
          fields: "reviewer{name,picture},created_time,rating,review_text",
          limit: 10, // Adjust as needed
        },
        timeout: 5000, // 5 seconds timeout
      }
    );

    if (!response.data || !response.data.data) {
      throw new Error("Invalid response from Facebook API");
    }

    const reviews = response.data.data.map((review) => ({
      reviewer: review.reviewer ? review.reviewer.name : "Anonymous",
      profilePic:
        review.reviewer && review.reviewer.picture
          ? review.reviewer.picture.data.url
          : null,
      date: new Date(review.created_time).toLocaleDateString(),
      rating: review.rating,
      text: review.review_text || "No review text provided.",
    }));

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching Facebook reviews:", error);
    if (error.response) {
      res
        .status(error.response.status)
        .json({ error: error.response.data.error.message });
    } else if (error.request) {
      res.status(500).json({ error: "No response received from Facebook API" });
    } else {
      res.status(500).json({ error: "Error setting up the request" });
    }
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
