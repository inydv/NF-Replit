const prisma = require("../configs/database.config");
const { errorHandler } = require("../helpers");

// Helper function to fetch notifications from the database
module.exports = async (userId, next) => {
  try {
    const unReadNotifications = await prisma.notifications.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    const readNotifications = await prisma.notifications.findMany({
      where: { userId, isRead: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    return { unReadNotifications, readNotifications };
  } catch (err) {
    next(new errorHandler("Database error", 500));
    return null;
  }
};
