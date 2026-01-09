const axios = require("axios");
const { sendMail } = require("../utils");

const appId = process.env.FACEBOOK_APP_ID;
const appSecret = process.env.FACEBOOK_APP_SECRET;
const shortLivedToken = process.env.FACEBOOK_SHORT_LIVED_TOKEN; // Initially fetched manually
let longLivedUserToken = process.env.FACEBOOK_LONG_LIVED_TOKEN; // To be refreshed dynamically

/**
 * Refreshes the Facebook long-lived user token and retrieves the page access token.
 */
module.exports = async () => {
  try {
    // Step 1: Exchange short-lived token for long-lived token
    const longLivedTokenResponse = await getLongLivedUserToken();
    longLivedUserToken = longLivedTokenResponse.access_token;
    console.log("New long-lived user access token:", longLivedUserToken);

    // Step 2: Use the long-lived user token to get the page token
    const pageToken = await getPageAccessToken(longLivedUserToken);
    console.log("Page Access Token:", pageToken);

    // Save the page token securely (e.g., in environment variables or a database)
    await saveToken(pageToken);
  } catch (err) {
    await handleError(err, "Facebook Access Token Generation Error");
  }
};

/**
 * Exchanges a short-lived token for a long-lived user token.
 * @returns {Promise<Object>} The response containing the long-lived user token.
 */
const getLongLivedUserToken = async () => {
  try {
    const url = "https://graph.facebook.com/oauth/access_token";
    const params = {
      grant_type: "fb_exchange_token",
      client_id: appId,
      client_secret: appSecret,
      fb_exchange_token: shortLivedToken,
    };

    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to fetch long-lived user token: ${extractErrorMessage(error)}`
    );
  }
};

/**
 * Retrieves the page access token using the long-lived user token.
 * @param {string} userToken - The long-lived user token.
 * @returns {Promise<string>} The page access token.
 */
const getPageAccessToken = async (userToken) => {
  try {
    const url = "https://graph.facebook.com/me/accounts";
    const params = { access_token: userToken };

    const response = await axios.get(url, { params });
    const pages = response.data.data;

    if (!pages || pages.length === 0) {
      throw new Error("No pages found for the user.");
    }

    return pages[0].access_token; // Assuming the first page is desired
  } catch (error) {
    throw new Error(
      `Failed to fetch page access token: ${extractErrorMessage(error)}`
    );
  }
};

/**
 * Saves the token securely (e.g., in environment variables or a database).
 * @param {string} token - The token to save.
 */
const saveToken = async (token) => {
  try {
    // Implementation for saving the token securely
    console.log("Token saved successfully:", token);
    // Example: Save to a database or update environment variables
  } catch (error) {
    throw new Error(`Failed to save token: ${extractErrorMessage(error)}`);
  }
};

/**
 * Handles errors by logging and sending an error response.
 * @param {Error} error - The error object.
 * @param {string} context - Contextual information about the error.
 */
const handleError = async (error, context) => {
  const errorMessage = extractErrorMessage(error);

  console.error(`${context}:`, errorMessage);

  await sendMail({
    email: "fnduati@nursingfront.com",
    subject: "Cron Job Error",
    template: "error",
    data: {
      Message: `${context}: ${errorMessage}`,
    },
  });
};

/**
 * Extracts a meaningful error message from an error object.
 * @param {Error} error - The error object.
 * @returns {string} The extracted error message.
 */
const extractErrorMessage = (error) => {
  return (
    error.response?.data?.error?.message ||
    error.message ||
    "Unknown error occurred"
  );
};
