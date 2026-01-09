const authRouter = require("./auth.routes");
const blogRouter = require("./blogs.routes");
const companyRouter = require("./companies.routes");
const jobRouter = require("./jobs.routes");
const paymentRouter = require("./payment.routes");
const quickJobRouter = require("./quickJobs.routes");
const redditRouter = require("./reddit.routes");
const subscribedUserRouter = require("./subscribedUsers.routes");
const usersRouter = require("./users.routes");
const contactsRouter = require("./contacts.routes");
const imagesRouter = require("./image.routes");
const notificationsRouter = require("./notifications.routes");

module.exports = {
  authRouter,
  blogRouter,
  companyRouter,
  jobRouter,
  paymentRouter,
  quickJobRouter,
  redditRouter,
  subscribedUserRouter,
  usersRouter,
  contactsRouter,
  imagesRouter,
  notificationsRouter,
};
