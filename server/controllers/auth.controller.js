const { catchAsyncError, errorHandler } = require("../helpers");
const prisma = require("../configs/database.config");
const admin = require("../configs/firebaseAdmin.config");
const getNotificationsForUser = require("../pipes/getNotificationsForUser.pipe");
const { sendMail } = require("../utils");
const generateSecureTokenPipe = require("../pipes/generateSecureToken.pipe");
const getUserProfileCompletionPipe = require("../pipes/getUserProfileCompletion.pipe");

class AuthController {
  signup = catchAsyncError(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    const token = authHeader?.split("Bearer ")[1];
    if (!token) return next(new errorHandler("Invalid Token", 400));

    try {
      const decoded = await admin.auth().verifyIdToken(token);
      const { uid, email, firebase, name: decodedName } = decoded;
      const { sign_in_provider } = firebase;
      const { name: requestName, role } = req.body;

      // Common user lookup
      const existingUser = await prisma.users.findUnique({
        where: { email: email.toLowerCase() },
      });

      const secureToken = generateSecureTokenPipe();
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 24 hours

      if (sign_in_provider === "password") {
        const name = requestName;
        if (!name) return next(new errorHandler("Name is required", 400));

        if (existingUser)
          return next(new errorHandler("User already exists", 400));

        const user = await prisma.users.create({
          data: {
            uid,
            name,
            email: email.toLowerCase(),
            role,
            provider: sign_in_provider,
            accessPages: ["JOBS", "COMPANIES", "USERS"],
          },
        });

        await prisma.tokens.create({
          data: {
            type: "ACCOUNT_VERIFICATION",
            token: secureToken,
            userId: user.id,
            expiresAt,
          },
        });

        await sendMail({
          email: email,
          subject: "Account Verification",
          template: "verifyAccount",
          data: {
            verifyLink: `${process.env.BACKEND_URL}/api/v1/auth/verify/${secureToken}`,
          },
        });

        return res.status(201).json({
          SUCCESS: true,
          MESSAGE: "Email verification sent",
        });
      }

      let user = existingUser;

      if (!user) {
        user = await prisma.users.create({
          data: {
            uid,
            name: decodedName,
            email: email.toLowerCase(),
            role,
            provider: sign_in_provider,
            accessPages: ["JOBS", "COMPANIES", "USERS"],
          },
        });

        await prisma.users.update({
          where: {
            id: user.id,
          },
          data: {
            verified: true,
          },
        });
      }

      if (user) {
        req.session.user = user;

        const { isProfileComplete, isCreatedCompany } =
          getUserProfileCompletionPipe(user, next);

        req.session.user.isProfileComplete = isProfileComplete;
        req.session.user.isCreatedCompany = isCreatedCompany;

        // Fetch notifications for the logged-in user
        const { unReadNotifications, readNotifications } =
          await getNotificationsForUser(user.id, next);
        if (unReadNotifications)
          req.session.user.unReadNotifications = unReadNotifications;
        if (readNotifications)
          req.session.user.readNotifications = readNotifications;
      }

      return res.status(201).json({
        SUCCESS: true,
        MESSAGE: "Signup successfully",
        DATA: req.session.user,
      });
    } catch (err) {
      return next(new errorHandler("Invalid Token", 400));
    }
  });

  login = catchAsyncError(async (req, res, next) => {
    if (!req.user) return next(new errorHandler("Unauthorized", 401));
    if (!req.session.user) req.session.user = req.user;

    return res.status(200).json({
      SUCCESS: true,
      MESSAGE: "Log in successfully",
      DATA: req.user,
    });
  });

  logout = catchAsyncError(async (req, res, next) => {
    req.session.destroy((err) => {
      if (err) return next(new errorHandler("Logout failed", 500));
      res
        .status(200)
        .json({ SUCCESS: true, MESSAGE: "Logged out successfully" });
    });
  });

  me = catchAsyncError(async (req, res, next) => {
    res.status(200).json({
      SUCCESS: true,
      MESSAGE: "Get user successfully",
      DATA: req.user,
    });
  });

  verifyAccount = catchAsyncError(async (req, res, next) => {
    const { token } = req.params;

    const user = await prisma.tokens.findUnique({ where: { token } });

    if (!user) {
      res.render("verification.ejs", {
        h1: "Invalid Or Expired Token",
        type: "ERROR",
        loginLink: `${process.env.FRONTEND_URL}/sign-up`,
      });

      return;
    }

    await prisma.users.update({
      where: { id: user.userId },
      data: { verified: true },
    });

    await prisma.tokens.delete({
      where: { token },
    });

    res.render("verification.ejs", {
      h1: "Token Verified",
      type: "SUCCESS",
      loginLink: `${process.env.FRONTEND_URL}/sign-up`,
    });
  });
}

module.exports = new AuthController();
