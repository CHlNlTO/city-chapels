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
  // const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  // const pageId = process.env.FACEBOOK_PAGE_ID;

  // if (!accessToken || !pageId) {
  //   return res.status(500).json({ error: "Missing Facebook credentials" });
  // }

  // try {
  //   const response = await axios.get(
  //     `https://graph.facebook.com/v17.0/${pageId}/ratings`,
  //     {
  //       params: {
  //         access_token: accessToken,
  //         fields: "reviewer{name,picture},created_time,rating,review_text",
  //         limit: 10, // Adjust as needed
  //       },
  //       timeout: 5000, // 5 seconds timeout
  //     }
  //   );

  //   if (!response.data || !response.data.data) {
  //     throw new Error("Invalid response from Facebook API");
  //   }

  //   const reviews = response.data.data.map((review) => ({
  //     reviewer: review.reviewer ? review.reviewer.name : "Anonymous",
  //     profilePic:
  //       review.reviewer && review.reviewer.picture
  //         ? review.reviewer.picture.data.url
  //         : null,
  //     date: new Date(review.created_time).toLocaleDateString(),
  //     rating: review.rating,
  //     text: review.review_text || "No review text provided.",
  //   }));

  //   res.json(reviews);
  // } catch (error) {
  //   console.error("Error fetching Facebook reviews:", error);
  //   if (error.response) {
  //     // The request was made and the server responded with a status code
  //     // that falls out of the range of 2xx
  //     res
  //       .status(error.response.status)
  //       .json({ error: error.response.data.error.message });
  //   } else if (error.request) {
  //     // The request was made but no response was received
  //     res.status(500).json({ error: "No response received from Facebook API" });
  //   } else {
  //     // Something happened in setting up the request that triggered an Error
  //     res.status(500).json({ error: "Error setting up the request" });
  //   }
  // }

  try {
    // Read the mock data file
    const data = await fs.readFile(
      path.join(__dirname, "mockReviews.json"),
      "utf8"
    );
    const mockReviews = JSON.parse(data);

    // Process the mock data similar to how we'd process real API data
    const reviews = mockReviews.data.map((review) => ({
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
    console.error("Error reading mock reviews:", error);
    res.status(500).json({ error: "Error fetching reviews" });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
