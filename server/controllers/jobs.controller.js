const { catchAsyncError, errorHandler } = require("../helpers");
const prisma = require("../configs/database.config");
const generateSlug = require("../pipes/generateSlug.pipe");
const { getFilteredJobs } = require("../services/jobFilter.service");

class JobsController {
  createJob = catchAsyncError(async (req, res, next) => {
    const {
      title,
      overview,
      location,
      minSalary,
      maxSalary,
      salaryType,
      website,
      schedule,
      employementType,
      jobType,
      shift,
      payment,
      companyName,
      companyLocation,
      companyImage,
      email,
      experience,
      isUrgent,
      isFeatured,
      companyId,
    } = req.body;
    const slug = generateSlug(`${title}-in-${companyName}-at-${location}`);

    const job = await prisma.jobs.create({
      data: {
        title,
        overview,
        location,
        minSalary,
        maxSalary,
        salaryType,
        website,
        schedule,
        employementType,
        jobType,
        shift,
        payment,
        companyName,
        companyLocation,
        companyImage,
        email: email.toLowerCase(),
        experience,
        isUrgent,
        isFeatured,
        slug,
        createdById: req.user.createdById || req.user.id,
        companyId,
      },
    });

    res
      .status(201)
      .json({ SUCCESS: true, MESSAGE: "Job created successfully", DATA: job });
  });

  updateJob = catchAsyncError(async (req, res, next) => {
    const { slug } = req.params;
    const {
      title,
      overview,
      location,
      minSalary,
      maxSalary,
      salaryType,
      website,
      schedule,
      employementType,
      jobType,
      shift,
      payment,
      companyName,
      companyLocation,
      companyImage,
      email,
      experience,
      isUrgent,
      isFeatured,
      companyId,
    } = req.body;
    const newSlug = generateSlug(`${title}-in-${companyName}-at-${location}`);

    await prisma.jobs.update({
      where: { slug },
      data: {
        title,
        overview,
        location,
        minSalary,
        maxSalary,
        salaryType,
        website,
        schedule,
        employementType,
        jobType,
        shift,
        payment,
        companyName,
        companyLocation,
        companyImage,
        email: email.toLowerCase(),
        overview,
        experience,
        isUrgent,
        isFeatured,
        slug: newSlug,
        companyId,
      },
    });

    res
      .status(200)
      .json({ SUCCESS: true, MESSAGE: "Job updated successfully" });
  });

  deleteJob = catchAsyncError(async (req, res, next) => {
    const { slug } = req.params;

    await prisma.jobs.delete({ where: { slug } });

    const jobs = await prisma.jobs.findMany({
      where: { createdById: req.user.createdById || req.user.id },
    });

    res.status(200).json({
      SUCCESS: true,
      message: "Job inactive successfully",
      DATA: jobs,
    });
  });

  getJob = catchAsyncError(async (req, res, next) => {
    const { slug } = req.params;

    // Check if the job exists in the Jobs table
    const job = await prisma.jobs.findUnique({
      where: { slug },
    });

    // If not found in Jobs, check in CrawledJobs
    const crawledJob = job
      ? null
      : await prisma.crawledJobs.findUnique({
          where: { slug },
        });

    // If the job is not found in either table, return an error
    if (!job && !crawledJob) {
      return next(
        new errorHandler("Job not found in either Jobs or CrawledJobs", 404)
      );
    }

    // Check if the job is saved by the user
    const isSaved = await prisma.savedJobs.findFirst({
      where: {
        userId: req.user?.id,
        OR: [
          { jobSlug: job ? slug : undefined },
          { crawledSlug: crawledJob ? slug : undefined },
        ],
      },
    });

    res.status(200).json({
      SUCCESS: true,
      MESSAGE: "Get job successfully",
      DATA: { ...(job || crawledJob), saved: !!isSaved },
    });
  });

  listJobs = catchAsyncError(async (req, res, next) => {
    const { q, location, employementType, jobType, salary_gte, salary_lte } =
      req.query;

    const jobs = await getFilteredJobs({
      q,
      location,
      employementType,
      jobType,
      salary_gte,
      salary_lte,
      table: "JOBS",
    });

    const savedJobs = await prisma.savedJobs.findMany({
      where: { userId: req.user?.id },
      select: { jobSlug: true },
    });

    const savedJobSlugs = new Set(savedJobs.map((job) => job.jobSlug));

    const jobsWithSavedField = jobs.map((job) => ({
      ...job,
      saved: savedJobSlugs.has(job.slug),
    }));

    res.status(200).json({
      SUCCESS: true,
      MESSAGE: "List jobs successfully",
      DATA: jobsWithSavedField,
    });
  });

  listJobsUsingUsers = catchAsyncError(async (req, res, next) => {
    const jobs = await prisma.jobs.findMany({
      where: { createdById: req.user.createdById || req.user.id },
    });

    res
      .status(200)
      .json({ SUCCESS: true, MESSAGE: "List jobs successfully", DATA: jobs });
  });

  listSavedJobs = catchAsyncError(async (req, res, next) => {
    // First get all saved jobs for the user
    const savedJobs = await prisma.savedJobs.findMany({
      where: { userId: req.user.id },
    });

    // Separate the slugs for Jobs and CrawledJobs
    const jobSlugs = savedJobs
      .filter((job) => job.jobSlug)
      .map((job) => job.jobSlug);
    const crawledJobSlugs = savedJobs
      .filter((job) => job.crawledSlug)
      .map((job) => job.crawledSlug);

    // Fetch the actual jobs and crawled jobs
    const [jobs, crawledJobs] = await Promise.all([
      prisma.jobs.findMany({
        where: { slug: { in: jobSlugs } },
      }),
      prisma.crawledJobs.findMany({
        where: { slug: { in: crawledJobSlugs } },
      }),
    ]);

    // Combine and mark all jobs as saved
    const allJobs = [
      ...jobs.map((job) => ({ ...job, saved: true })),
      ...crawledJobs.map((job) => ({ ...job, saved: true })),
    ];

    res.status(200).json({
      SUCCESS: true,
      MESSAGE: "List saved jobs successfully",
      DATA: allJobs,
    });
  });

  listCrawledJobs = catchAsyncError(async (req, res, next) => {
    const { q, location, employementType, jobType, salary_gte, salary_lte } =
      req.query;

    const crawledJobs = await getFilteredJobs({
      q,
      location,
      employementType,
      jobType,
      salary_gte,
      salary_lte,
      table: "CRAWLED_JOBS",
    });

    const savedJobs = await prisma.savedJobs.findMany({
      where: { userId: req.user?.id },
      select: { crawledSlug: true },
    });

    const savedJobSlugs = new Set(savedJobs.map((job) => job.crawledSlug));

    const jobsWithSavedField = crawledJobs.map((job) => ({
      ...job,
      saved: savedJobSlugs.has(job.slug),
    }));

    res.status(200).json({
      SUCCESS: true,
      MESSAGE: "List crawled jobs successfully",
      DATA: jobsWithSavedField,
    });
  });

  addSavedJob = catchAsyncError(async (req, res, next) => {
    const { slug } = req.params;

    // Check if the slug exists in the Jobs table
    const job = await prisma.jobs.findUnique({
      where: { slug },
    });

    // If not found in Jobs, check in CrawledJobs
    const crawledJob = job
      ? null
      : await prisma.crawledJobs.findUnique({
          where: { slug },
        });

    // If the slug is not found in either table, return an error
    if (!job && !crawledJob) {
      return res.status(404).json({
        SUCCESS: false,
        MESSAGE: "Job not found in either Jobs or CrawledJobs",
      });
    }

    // Check if the job is already saved by the user
    const existingSavedJob = await prisma.savedJobs.findFirst({
      where: {
        userId: req.user.id,
        OR: [
          { jobSlug: job ? slug : undefined },
          { crawledSlug: crawledJob ? slug : undefined },
        ],
      },
    });

    if (existingSavedJob) {
      return res.status(400).json({
        SUCCESS: false,
        MESSAGE: "Job is already saved",
      });
    }

    // Create the saved job entry
    await prisma.savedJobs.create({
      data: {
        userId: req.user.id,
        jobSlug: job ? slug : null,
        crawledSlug: crawledJob ? slug : null,
      },
    });

    res.status(201).json({
      SUCCESS: true,
      MESSAGE: "Job saved successfully",
    });
  });

  deleteSavedJob = catchAsyncError(async (req, res, next) => {
    const { slug } = req.params;

    // Check if the slug exists in the Jobs table
    const job = await prisma.jobs.findUnique({
      where: { slug },
    });

    // If not found in Jobs, check in CrawledJobs
    const crawledJob = job
      ? null
      : await prisma.crawledJobs.findUnique({
          where: { slug },
        });

    // If the slug is not found in either table, return an error
    if (!job && !crawledJob) {
      return res.status(404).json({
        SUCCESS: false,
        MESSAGE: "Saved job not found in either Jobs or CrawledJobs",
      });
    }

    // Delete the saved job entry
    await prisma.savedJobs.deleteMany({
      where: {
        userId: req.user.id,
        OR: [
          { jobSlug: job ? slug : undefined },
          { crawledSlug: crawledJob ? slug : undefined },
        ],
      },
    });

    res
      .status(200)
      .json({ SUCCESS: true, MESSAGE: "Job unsaved successfully" });
  });

  updateJobStatus = catchAsyncError(async (req, res, next) => {
    const { slug } = req.params;

    await prisma.jobs.update({
      where: { slug },
      data: { active: true },
    });

    res
      .status(200)
      .json({ SUCCESS: true, MESSAGE: "Job activated successfully" });
  });

  deactivateJobStatus = catchAsyncError(async (req, res, next) => {
    const { slug } = req.params;

    await prisma.jobs.update({
      where: { slug },
      data: { active: false },
    });

    res
      .status(200)
      .json({ SUCCESS: true, MESSAGE: "Job deactivated successfully" });
  });

  deactivateJobStatus = catchAsyncError(async (req, res, next) => {
    const { slug } = req.params;

    await prisma.jobs.update({
      where: { slug },
      data: { active: false },
    });

    res
      .status(200)
      .json({ SUCCESS: true, MESSAGE: "Job deactivated successfully" });
  });

  deactivateJobStatus = catchAsyncError(async (req, res, next) => {
    const { slug } = req.params;

    await prisma.jobs.update({
      where: { slug },
      data: { active: false },
    });

    res
      .status(200)
      .json({ SUCCESS: true, MESSAGE: "Job deactivated successfully" });
  });
}

module.exports = new JobsController();
