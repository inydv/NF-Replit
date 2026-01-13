const prisma = require("../configs/database.config");
const createNotification = require("../pipes/createNotification.pipe");
const { addDays } = require("date-fns");

module.exports = async () => {
  try {
    const JOB_ACTIVE_DAYS = 30;
    const now = new Date();

    const jobs = await prisma.jobs.findMany();

    for (const job of jobs) {
      // Ensure job.createdAt is a Date object
      const createdAt = new Date(job.createdAt);
      const inactiveDate = addDays(createdAt, JOB_ACTIVE_DAYS);

      // Notify for each day: 5,4,3,2,1 days before inactive, and on inactive day
      for (let daysLeft = 5; daysLeft >= 0; daysLeft--) {
        const notifyDay = addDays(now, daysLeft);

        // If inactiveDate matches notifyDay (ignoring time)
        if (
          inactiveDate.getFullYear() === notifyDay.getFullYear() &&
          inactiveDate.getMonth() === notifyDay.getMonth() &&
          inactiveDate.getDate() === notifyDay.getDate()
        ) {
          let message;
          // Only send 'is now inactive' notification once, only on the day job becomes inactive
          if (daysLeft === 0 && job.active === false) {
            message = `Your job "${job.title}" is now inactive.`;
            // Check if this notification already exists for this job and this exact message
            const existing = await prisma.notifications.findFirst({
              where: {
                userId: job.createdById,
                type: "POSTED_JOB_INACTIVE",
                message: message,
              },
            });
            if (!existing) {
              await createNotification(
                job.createdById,
                "POSTED_JOB_INACTIVE",
                message
              );
            }
            // After sending the inactive notification, do not send further notifications for this job
            break;
          } else if (daysLeft > 0 && job.active === true) {
            message = `Your job "${job.title}" will become inactive in ${daysLeft} day${daysLeft > 1 ? "s" : ""}.`;
            const existing = await prisma.notifications.findFirst({
              where: {
                userId: job.createdById,
                type: "POSTED_JOB_INACTIVE",
                message: message,
              },
            });
            if (!existing) {
              await createNotification(
                job.createdById,
                "POSTED_JOB_INACTIVE",
                message
              );
            }
          } else {
            continue;
          }
        }
      }
    }
    console.log("Notifications for inactive posted jobs created successfully.");
  } catch (err) {
    console.error("Error processing posted job notifications:", err.message);
  }
};
