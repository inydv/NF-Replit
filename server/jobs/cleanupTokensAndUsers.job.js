const prisma = require("../configs/database.config");
const { sendMail } = require("../utils");

const ADMIN_EMAIL = "fnduati@nursingfront.com";

module.exports = async function cleanupTokensAndUsers() {
  try {
    // Delete expired tokens
    const now = new Date();
    const deletedTokens = await prisma.tokens.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });

    // Find users who are not verified and have no valid (non-expired) tokens
    const unverifiedUsers = await prisma.users.findMany({
      where: {
        verified: false,
        tokens: {
          none: {
            expiresAt: {
              gt: now,
            },
          },
        },
      },
      select: { id: true, email: true },
    });

    const userIdsToDelete = unverifiedUsers.map((u) => u.id);
    if (userIdsToDelete.length > 0) {
      await prisma.users.deleteMany({
        where: { id: { in: userIdsToDelete } },
      });
    }

    if (deletedTokens.count > 0 || userIdsToDelete.length > 0) {
      console.log(
        `Deleted ${deletedTokens.count} expired tokens and ${userIdsToDelete.length} unverified users.`
      );
    }
  } catch (err) {
    console.error("Error cleaning up tokens and users:", err);
    await sendMail({
      email: ADMIN_EMAIL,
      subject: "Cron Job Error - Cleanup Tokens and Users",
      template: "error",
      data: {
        Message: `Cleanup Tokens and Users Error: ${err.message}`,
      },
    });
  }
}; 