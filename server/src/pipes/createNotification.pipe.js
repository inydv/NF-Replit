const prisma = require("../configs/database.config");

// Helper function to fetch notifications from the database
module.exports = async (userId, type, message) => {
  try {
    await prisma.notifications.create({
      data: { userId, message, type },
    });

    console.log("ukgjfh");

    return true;
  } catch (err) {
    console.log("Error creating notification:", err.message);
    return null;
  }
};
