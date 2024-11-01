const express = require("express");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();
const port = parseInt(process.env.PORT) || process.argv[3] || 5000;

// Facebook API configuration
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
const PAGE_ID = process.env.PAGE_ID;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/facebook-reviews", async (req, res) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v21.0/${PAGE_ID}/ratings`,
      {
        params: {
          access_token: FACEBOOK_ACCESS_TOKEN,
          fields: "reviewer{name,picture},rating,review_text,created_time",
          limit: 10, // Adjust as needed
        },
      }
    );

    console.log("Facebook reviews:", response.data.data);

    // Transform Facebook data to match your existing review format
    const formattedReviews = response.data.data.map((review) => ({
      quote: review.review_text || `Rated ${review.rating} out of 5 stars`,
      name: review.reviewer.name,
      profileImage:
        review.reviewer.picture?.data?.url || "/img/default-profile.png", // Add a default profile image
      date: new Date(review.created_time).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      rating: review.rating,
    }));

    res.json(formattedReviews);
  } catch (error) {
    console.error(
      "Error fetching Facebook reviews:",
      error.response?.data || error
    );
    // Fall back to mock data if Facebook API fails
    const mockData = require("./public/data/mockReviews.json");
    res.json(mockData);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
