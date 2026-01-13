const NotificationsController = require("../controllers/notifications.controller");

const express = require("express");
const { isAuthenticatedUser, validateUserAccess } = require("../middlewares");
const notificationsRouter = express.Router();

notificationsRouter
  .patch(
    "/all",
    isAuthenticatedUser,
    NotificationsController.updateAllNotificationsReadStatus
  )
  .get("/all", isAuthenticatedUser, NotificationsController.listAllNotification)
  .patch(
    "/:id",
    isAuthenticatedUser,
    validateUserAccess("Notification"),
    NotificationsController.updateNotificationReadStatus
  )
  .delete(
    "/:id",
    isAuthenticatedUser,
    validateUserAccess("Notification"),
    NotificationsController.deleteNotification
  );

module.exports = notificationsRouter;
