const prisma = require("../configs/database.config");
const { googleIndexing, sendMail } = require("../utils");

module.exports = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Fetch jobs older than 30 days
    const oldJobs = await prisma.jobs.findMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    if (oldJobs.length > 0) {
      // Perform Google Indexing for each job concurrently
      await Promise.all(
        oldJobs.map((job) => googleIndexing(job.id, "URL_DELETED"))
      );

      // Mark jobs as inactive
      await prisma.jobs.updateMany({
        where: {
          createdAt: {
            lt: thirtyDaysAgo,
          },
        },
        data: {
          active: false,
        },
      });

      console.log("MARKED JOBS OLDER THAN 30 DAYS AS INACTIVE");
    } else {
      console.log("No jobs older than 30 days found.");
    }
  } catch (err) {
    await sendMail({
      email: "fnduati@nursingfront.com",
      subject: "Cron Job Error",
      template: "error",
      data: {
        Message: `30 Days Job Validation Error: ${err.message}`,
      },
    });
  }
};
