const prisma = require("../configs/database.config");
const createNotification = require("../pipes/createNotification.pipe");

module.exports = async () => {
  try {
    // Fetch all saved jobs
    const savedJobs = await prisma.savedJobs.findMany({
      include: {
        job: true, // Include related job details
        crawledJob: true, // Include related crawled job details
      },
    });

    // Iterate through saved jobs and check if they are inactive
    for (const savedJob of savedJobs) {
      const { userId, job, crawledJob } = savedJob;

      // Check if the job or crawled job is inactive
      if ((job && !job.active) || (crawledJob && !crawledJob.active)) {
        const message = `The job "${job?.title || crawledJob?.title}" you saved is now inactive.`;

        const existing = await prisma.notifications.findFirst({
          where: {
            userId: job.createdById,
            type: "SAVED_JOB_INACTIVE",
            message: {
              contains: job.title || crawledJob?.title,
            },
          },
        });

        if (!existing) {
          // Create a notification for the user
          await createNotification(userId, "SAVED_JOB_INACTIVE", message);
        }
      }
    }

    console.log("Notifications for inactive saved jobs created successfully.");
  } catch (err) {
    console.error("Error processing saved job notifications:", err.message);
  }
};
