const SubscribedUsersController = require("../controllers/subscribedUsers.controller");
const { validate } = require("../middlewares");
const {
  subscribedUserToConvertKitValidationSchema,
  subscribedUserValidationSchema,
} = require("../validations/subscribedUsers.validation");

const express = require("express");
const subscribedUsersRouter = express.Router();

subscribedUsersRouter
  .post(
    "/",
    validate(subscribedUserValidationSchema),
    SubscribedUsersController.createSubscribedUsers
  )
  .post(
    "/convert-kit",
    validate(subscribedUserToConvertKitValidationSchema),
    SubscribedUsersController.createSubscribedUsersToConvertKit
  );

module.exports = subscribedUsersRouter;
