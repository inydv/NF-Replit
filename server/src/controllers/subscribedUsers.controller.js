const { catchAsyncError, errorHandler } = require("../helpers");
const prisma = require("../configs/database.config");

class SubscribedUsersController {
  createSubscribedUsers = catchAsyncError(async (req, res, next) => {
    const { email } = req.body;

    await prisma.subscribedUsers.create({
      data: { email: email.toLowerCase() },
    });

    res.status(201).json({
      SUCCESS: true,
      MESSAGE: "User Subscribed successfully",
    });
  });

  createSubscribedUsersToConvertKit = catchAsyncError(
    async (req, res, next) => {
      const { name, email, message } = req.body;

      const body = {
        api_key: process.env.CONVERT_KIT_API_KEY,
        email: email,
        first_name: name,
        fields: {
          message: message,
        },
      };

      try {
        const URL = `https://api.convertkit.com/v3/forms/${process.env.CONVERT_KIT_FORM_ID}/subscribe`;
        const response = await fetch(URL, {
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json; charset=utf-8" },
          method: "POST",
        });

        if (response.status === 200) {
          res.status(200).json({
            SUCCESS: true,
            MESSAGE: "Subscribed successfully",
          });
        } else {
          res.status(500).json({
            SUCCESS: false,
            MESSAGE: "Something went Wrong",
          });
        }
      } catch (error) {
        res.status(500).json({
          SUCCESS: false,
          MESSAGE: "Something went Wrong",
        });
      }
    }
  );
}

module.exports = new SubscribedUsersController();
