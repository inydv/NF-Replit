const prisma = require("../configs/database.config");

// Helper function to fetch user from the database
module.exports = async (uid, next) => {
  try {
    const user = await prisma.users.findUnique({ where: { uid } });
    if (!user) {
      next(new errorHandler("User not found", 404));
      return null;
    }
    return user;
  } catch (err) {
    next(new errorHandler("Database error", 500));
    return null;
  }
};
