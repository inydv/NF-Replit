const axios = require("axios");
const prisma = require("../configs/database.config");
const jobUnavailableKeywords = require("../constants/jobUnavailableKeywords.json");
const { sendMail } = require("../utils");

const ADMIN_EMAIL = "fnduati@nursingfront.com";

const isJobUnavailable = (pageContent) => {
  return jobUnavailableKeywords.some((keyword) =>
    pageContent.includes(keyword)
  );
};

const deleteJobs = async (jobIds) => {
  try {
    await prisma.jobs.update({
      where: {
        id: { in: jobIds },
      },
      data: {
        active: false,
      },
    });
    console.log(`Deleted jobs with IDs: ${jobIds.join(", ")}`);
  } catch (error) {
    await sendMail({
      email: ADMIN_EMAIL,
      subject: "Cron Job Error",
      template: "error",
      data: {
        Message: `Deleting Job Error: ${err.message}`,
      },
    });
  }
};

module.exports = async () => {
  try {
    const jobs = await prisma.jobs.findMany({
      select: {
        id: true,
        website: true,
      },
    });

    const jobsToDelete = [];

    for (const job of jobs) {
      try {
        const response = await axios.get(job.website);
        const pageContent = response.data;

        if (response.status !== 200 || isJobUnavailable(pageContent)) {
          jobsToDelete.push(job.id);
        }
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 404 || error.response.status === 410)
        ) {
          jobsToDelete.push(job.id);
        } else {
          console.error(`Error checking job ID ${job.id}:`, error.message);
        }
      }
    }

    if (jobsToDelete.length > 0) {
      await deleteJobs(jobsToDelete);
    }
  } catch (err) {
    await sendMail({
      email: ADMIN_EMAIL,
      subject: "Cron Job Error",
      template: "error",
      data: {
        Message: `Job Link Validation Error: ${err.message}`,
      },
    });
  }
};
