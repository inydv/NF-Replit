const { catchAsyncError } = require("../helpers");
const prisma = require("../configs/database.config");
const getNotificationsForUser = require("../pipes/getNotificationsForUser.pipe");

class NotificationsController {
  updateAllNotificationsReadStatus = catchAsyncError(async (req, res, next) => {
    await prisma.notifications.updateMany({
      where: { userId: req.user.id },
      data: { isRead: true },
    });

    const { unReadNotifications, readNotifications } =
      await getNotificationsForUser(req.user.id, next);

    res.status(201).json({
      SUCCESS: true,
      MESSAGE: "Notifications updated successfully",
      DATA: { unReadNotifications, readNotifications },
    });
  });

  updateNotificationReadStatus = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    await prisma.notifications.update({
      where: { id },
      data: { isRead: true },
    });

    const { unReadNotifications, readNotifications } =
      await getNotificationsForUser(req.user.id, next);

    res.status(201).json({
      SUCCESS: true,
      MESSAGE: "Notification updated successfully",
      DATA: { unReadNotifications, readNotifications },
    });
  });

  deleteNotification = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    await prisma.notifications.delete({
      where: { id, isRead: true },
    });

    const readNotifications = await prisma.notifications.findMany({
      where: { userId: req.user.id, isRead: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    res.status(201).json({
      SUCCESS: true,
      MESSAGE: "Notification deleted successfully",
      DATA: readNotifications,
    });
  });

  listAllNotification = catchAsyncError(async (req, res, next) => {
    const { status } = req.query;

    const notifications = await prisma.notifications.findMany({
      where: { userId: req.user.id, isRead: !status },
      orderBy: { createdAt: "desc" },
    });

    res.status(201).json({
      SUCCESS: true,
      MESSAGE: "List notifications successfully",
      DATA: notifications,
    });
  });
}

module.exports = new NotificationsController();
