const { catchAsyncError } = require("../helpers");
const getUserFromDatabase = require("../pipes/getUserFromDatabase.pipe");
const getNotificationsForUser = require("../pipes/getNotificationsForUser.pipe");
const getUserProfileCompletionPipe = require("../pipes/getUserProfileCompletion.pipe");

module.exports = catchAsyncError(async (req, res, next) => {
  // Check if user is already in session
  if (req.session.user) {
    const user = await getUserFromDatabase(req.session.user.uid, next);
    if (user) {
      req.user = user;

      const { isProfileComplete, isCreatedCompany } =
        getUserProfileCompletionPipe(user, next);

      req.user.isProfileComplete = isProfileComplete;
      req.user.isCreatedCompany = isCreatedCompany;

      // Fetch notifications for the logged-in user
      const { unReadNotifications, readNotifications } =
        await getNotificationsForUser(user.id, next);
      if (unReadNotifications)
        req.user.unReadNotifications = unReadNotifications;
      if (readNotifications) req.user.readNotifications = readNotifications;
    }
  }

  next();
});
