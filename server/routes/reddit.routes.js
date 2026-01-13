const express = require("express");
const axios = require("axios");

const redditRouter = express.Router();

redditRouter.get("/login", (req, res) => {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const redirectUri = "http://localhost:5000/api/v1/reddit/callback"; // "http://localhost:8000/callback"
  const state = "RANDOM_text"; // You can generate a random string here to prevent CSRF
  const scope = "read submit"; // Permissions you want (read, submit)

  const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${clientId}&response_type=code&state=${state}&redirect_uri=${redirectUri}&scope=${scope}&duration=permanent`;
  res.redirect(authUrl);
});

redditRouter.get("/callback", async (req, res) => {
  const { code, state } = req.query;
  if (!code || !state) {
    return res.status(400).send("Invalid response from Reddit.");
  }

  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const redirectUri = "http://localhost:5000/api/v1/reddit/callback"; // "http://localhost:8000/callback"

  try {
    // Exchange authorization code for access and refresh tokens
    const tokenResponse = await axios.post(
      "https://www.reddit.com/api/v1/access_token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
      }),
      {
        auth: {
          username: clientId,
          password: clientSecret,
        },
        headers: {
          "User-Agent": process.env.REDDIT_USER_AGENT,
        },
      }
    );

    // Step 3: Store the refresh token securely
    const { refresh_token } = tokenResponse.data;

    // Optionally store the refresh token in a database or a secure place
    // For this example, we'll simply send it to the user for them to copy
    res.send(`Refresh Token: ${refresh_token}`);
  } catch (error) {
    console.error("Error exchanging code:", error.message);
    res.status(500).send("Error exchanging code for tokens.");
  }
});

module.exports = redditRouter;
