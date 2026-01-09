const { errorHandler, catchAsyncError } = require("../helpers");
const admin = require("../configs/firebaseAdmin.config");
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

      return next();
    }
    return; // Error already handled in getUserFromDatabase
  }

  // Extract token from Authorization header
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return next(new errorHandler("Please log in…..", 400));

  try {
    // Verify token using Firebase Admin SDK
    const decoded = await admin.auth().verifyIdToken(token);

    const user = await getUserFromDatabase(decoded.uid, next);
    if (user) {
      if (!user.verified)
        return next(new errorHandler("Account Not Verified", 400));

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

      return next();
    }
    return; // Error already handled in getUserFromDatabase
  } catch (err) {
    return next(new errorHandler("Invalid or expired token", 400));
  }
});
