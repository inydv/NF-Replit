const { auth } = require("google-auth-library");
const axios = require("axios");

// OAuth2 authentication setup
async function getAccessToken() {
  const client = await auth.getClient({
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });
  const token = await client.getAccessToken();
  return token.token;
}

// Function to notify Google about URL updates or deletions
module.exports = async (jobId, actionType) => {
  try {
    // Get access token for authentication
    const accessToken = await getAccessToken();

    // Make POST request to Google Indexing API
    const response = await axios.post(
      "https://indexing.googleapis.com/v3/urlNotifications:publish",
      {
        url: `https://www.nursingfront.com/?jobId=${jobId}`, // The URL of your job posting
        type: actionType, // Use 'URL_UPDATED' or 'URL_DELETED'
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Google Indexing API Response:", response.data);
  } catch (error) {
    console.error(
      "Error notifying Google Indexing API:",
      error.response ? error.response.data : error.message
    );
  }
};
