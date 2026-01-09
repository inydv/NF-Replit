const axios = require("axios");
const papaparse = require("papaparse");
const generateSlug = require("../pipes/generateSlug.pipe");
const prisma = require("../configs/database.config");
const { sendMail } = require("../utils");

// Constants for configuration
const ADMIN_EMAIL = "fnduati@nursingfront.com";
const SCRAPE_JOBS_URL = process.env.JOB_CRAWLER_URL;
const JOB_EXPIRY_DAYS = 7;

exports.validateCrawledJob = async () => {
  try {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() - JOB_EXPIRY_DAYS);

    const deletedJobs = await prisma.crawledJobs.updateMany({
      where: {
        createdAt: {
          lt: expiryDate,
        },
      },
      data: {
        active: false,
      },
    });

    console.log(
      `Update ${deletedJobs.count} crawled jobs older than ${JOB_EXPIRY_DAYS} days.`
    );
  } catch (err) {
    console.error("Error validating crawled jobs:", err);
    await sendMail({
      email: ADMIN_EMAIL,
      subject: "Cron Job Error - Validate Crawled Jobs",
      template: "error",
      data: {
        Message: `Validate Crawled Job Error: ${err.message}`,
      },
    });
  }
};

exports.crawler = async () => {
  try {
    const response = await axios.get(`${SCRAPE_JOBS_URL}/scrape-jobs`);

    const parsedData = papaparse.parse(response.data, {
      header: true,
      skipEmptyLines: true,
    });

    const jobs = parsedData.data;

    if (!Array.isArray(jobs)) {
      console.error("Parsed data is not an array:", jobs);
      return;
    }

    const validJobs = jobs.filter(
      (job) =>
        job.title &&
        job.company &&
        job.min_amount &&
        job.max_amount &&
        job.company_logo
    );

    const insertPromises = validJobs.map(async (job, index) => {
      const slug = generateSlug(`${job.title}-in-${job.company}`);

      try {
        const replacedJobType = job.job_type
          ?.replace("fulltime", "FULL_TIME")
          ?.replace("parttime", "PART_TIME");

        const employementType =
          replacedJobType?.split(",").length > 0
            ? replacedJobType.split(",")[0]?.trim()
            : replacedJobType;

        console.log({ isRemote: job.is_remote });

        await prisma.crawledJobs.create({
          data: {
            companyName: job.company,
            companyImage: job.company_logo,
            companyLocation: job.company_location || job.location,
            title: job.title,
            overview: job.description,
            employementType,
            salaryType: job.interval === "hourly" ? "HOURLY" : "SALARY",
            minSalary: +job.min_amount || 0.0,
            maxSalary: +job.max_amount || 0.0,
            jobType: job.is_remote === "False" ? "ONSITE" : "REMOTE",
            location: job.location || job.company_location,
            website: job.job_url_direct || job.job_url,
            provider: job.site,
            slug: slug,
          },
        });

        console.log(`Job Posted: ${index + 1}`);
      } catch (err) {
        console.error(`Error posting job at index ${index + 1}:`, err.message);
      }
    });

    await Promise.all(insertPromises);
    console.log("All jobs processed successfully.");
  } catch (err) {
    console.error("Error in crawler:", err);
    await sendMail({
      email: ADMIN_EMAIL,
      subject: "Cron Job Error - Crawler",
      template: "error",
      data: {
        Message: `Crawler - Job Posting Error: ${err.message}`,
      },
    });
  }
};
