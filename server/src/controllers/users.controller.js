const { catchAsyncError, errorHandler } = require("../helpers");
const prisma = require("../configs/database.config");
const generateSecureTokenPipe = require("../pipes/generateSecureToken.pipe");
const { sendMail } = require("../utils");

class UsersController {
  addManagedUser = catchAsyncError(async (req, res, next) => {
    let { email, accessPages } = req.body;
    email = email.toLowerCase();

    if (email === req.user.email)
      return next(new errorHandler("You can't invite yourself", 400));

    const user = await prisma.users.findUnique({ where: { email } });

    if (req.user.createdById && req.user.createdById === user.id)
      return next(new errorHandler("You can't invite owner", 400));

    if (user) {
      if (user.createdById)
        return next(
          new errorHandler("User already invited by another organisation", 400)
        );

      const token = generateSecureTokenPipe();
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 24 hours

      await prisma.tokens.create({
        data: {
          type: "MODERATOR_INVITATION",
          token,
          accessPages,
          userId: user.id,
          createdById: req.user.createdById || req.user.id,
          expiresAt,
        },
      });

      await sendMail({
        email: email,
        subject: "Invitation to access organisation",
        template: "invitationHasAccount",
        data: {
          inviterName: req.user.name,
          acceptInviteLink: `${process.env.BACKEND_URL}/api/v1/user/accept/invitation/${token}`,
        },
      });

      res.status(200).json({
        SUCCESS: true,
        MESSAGE: "Invitation sent",
      });
    } else {
      await sendMail({
        email: email,
        subject: "Invitation to access organisation",
        template: "invitationNoAccount",
        data: {
          loginLink: `${process.env.FRONTEND_URL}sign-up`,
          inviterEmail: req.user.email,
          inviterName: req.user.name,
        },
      });

      res.status(200).json({
        SUCCESS: true,
        MESSAGE:
          "Account creation invitation sent. Once the user creates an account, Send invitation again.",
      });
    }
  });

  listManagedUsers = catchAsyncError(async (req, res, next) => {
    const moderators = await prisma.users.findMany({
      where: {
        createdById: req.user.createdById || req.user.id,
        NOT: {
          id: req.user.id, // Exclude the current user
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        accessPages: true,
      },
    });

    res.status(200).json({
      SUCCESS: true,
      MESSAGE: "List moderator successfully",
      DATA: moderators,
    });
  });

  listRecruiters = catchAsyncError(async (req, res, next) => {
    const { search } = req.query;

    const users = await prisma.users.findMany({
      where: {
        OR: search
          ? [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ]
          : undefined,
      },
      select: {
        email: true,
        name: true,
      },
    });

    res.status(200).json({
      SUCCESS: true,
      MESSAGE: "List recruiters successfully",
      DATA: users,
    });
  });

  deleteManagedUsers = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const moderator = await prisma.users.findUnique({
      where: { id, createdById: req.user.createdById || req.user.id },
    });
    if (!moderator) return next(new errorHandler("Moderator not found", 404));

    await prisma.users.update({
      where: { id: req.user.id },
      data: {
        moderators: {
          set: req.user.moderators.filter((id) => id !== id), // Remove the moderatorId
        },
      },
    });

    await prisma.users.update({
      where: { id },
      data: { createdById: null, accessPages: ["COMPANIES", "JOBS", "USERS"] },
    });

    res
      .status(200)
      .json({ SUCCESS: true, MESSAGE: "Moderator inactive successfully" });
  });

  updateProfile = catchAsyncError(async (req, res, next) => {
    const {
      name,
      title,
      phone,
      image,
      location,
      links,
      about,
      experience,
      education,
      certification,
      skills,
    } = req.body;

    await prisma.users.update({
      where: { id: req.user.id },
      data: {
        name,
        title,
        phone,
        image,
        location,
        links,
        about,
        experience,
        education,
        certification,
        skills,
      },
    });

    res
      .status(200)
      .json({ SUCCESS: true, MESSAGE: "User profile updated successfully" });
  });

  updateRoles = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { accessPages } = req.body;

    await prisma.users.update({
      where: { id },
      data: {
        accessPages,
      },
    });

    res
      .status(200)
      .json({ SUCCESS: true, MESSAGE: "User Roles updated successfully" });
  });

  acceptInvitation = catchAsyncError(async (req, res, next) => {
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

    const userModerators = await prisma.users.findUnique({
      where: { id: user.userId },
      select: { moderators: true },
    });

    if (userModerators && userModerators.moderators.length > 0) {
      await prisma.users.update({
        where: { id: user.createdById },
        data: {
          moderators: {
            push: userModerators.moderators, // Push all previous moderators at once
          },
        },
      });
    }

    await prisma.users.update({
      where: { id: user.userId },
      data: {
        createdById: user.createdById,
        role: "RECRUITER",
        accessPages: user.accessPages,
        moderators: [],
      },
    });

    await prisma.users.update({
      where: { id: user.createdById },
      data: {
        moderators: {
          push: user.userId, // Append the new user's ID to the moderators array
        },
      },
    });

    await prisma.users.updateMany({
      where: {
        createdById: user.userId,
      },
      data: {
        createdById: user.createdById,
      },
    });

    await prisma.blogs.updateMany({
      where: {
        createdById: user.userId,
      },
      data: {
        createdById: user.createdById,
      },
    });

    await prisma.companies.updateMany({
      where: {
        createdById: user.userId,
      },
      data: {
        createdById: user.createdById,
      },
    });

    await prisma.jobs.updateMany({
      where: {
        createdById: user.userId,
      },
      data: {
        createdById: user.createdById,
      },
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

module.exports = new UsersController();
