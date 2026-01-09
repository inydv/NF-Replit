if (process.env.NODE_ENV === "DEVELOPMENT") return; // comment this line when testing in development

const cron = require("node-cron");
const day30Validation = require("../jobs/day30Validation.job");
const { validateCrawledJob, crawler } = require("../jobs/crawling.job");
const facebookAccessToken = require("../jobs/facebookAccessToken.job");
const facebookPost = require("../jobs/facebookPost.job");
const savedJobNotification = require("../jobs/savedJobNotifications.job");
const postedJobNotification = require("../jobs/postedJobNotification.job");
const {
  postCrawledJobToReddit,
  postFeaturedJobToReddit,
} = require("../jobs/redditPost.job");
const { externalCrawler } = require("../jobs/externalCrawler.job");
const cleanupTokensAndUsers = require("../jobs/cleanupTokensAndUsers.job");

console.log("CRON FILE LOADED.....");

// Every day at midnight (12:00 AM)
cron.schedule("0 0 * * *", () => {
  day30Validation();
  validateCrawledJob();
  crawler();
  externalCrawler();
  postFeaturedJobToReddit();
  postCrawledJobToReddit();
  cleanupTokensAndUsers();
});

// Every day at noon (12:00 PM)
cron.schedule("0 12 * * *", () => {
  facebookPost();
  postCrawledJobToReddit();
  crawler();
});

// Cron job to refresh the token every 60 days
cron.schedule("0 0 1 */2 *", () => {
  facebookAccessToken();
});

// Schedule for 11:00 AM
// cron.schedule("0 11 * * *", () => {
//   postCrawledJobToReddit();
// });

// Run savedJobNotification every 6 hours
cron.schedule("0 */6 * * *", () => {
  savedJobNotification();
  postedJobNotification();
});

// externalCrawler();  // uncomment this line when testing in development
