const JobsController = require("../controllers/jobs.controller");
const { jobValidationSchema } = require("../validations/jobs.validation");
const {
  isAuthenticatedUser,
  authorizeRole,
  validate,
  sessionUser,
  validateUserAccess,
} = require("../middlewares");

const express = require("express");
const jobsRouter = express.Router();

jobsRouter
  .post(
    "/",
    validate(jobValidationSchema),
    isAuthenticatedUser,
    authorizeRole(["MASTER", "RECRUITER"]),
    JobsController.createJob
  )
  .post("/save-job/:slug", isAuthenticatedUser, JobsController.addSavedJob)
  .get("/", sessionUser, JobsController.listJobs)
  .get(
    "/using-user",
    isAuthenticatedUser,
    authorizeRole(["MASTER", "RECRUITER"]),
    JobsController.listJobsUsingUsers
  )
  .get("/saved-jobs", isAuthenticatedUser, JobsController.listSavedJobs)
  .get("/crawled", sessionUser, JobsController.listCrawledJobs)
  .get("/:slug", sessionUser, JobsController.getJob)
  .put(
    "/:slug",
    validate(jobValidationSchema),
    isAuthenticatedUser,
    authorizeRole(["MASTER", "RECRUITER"]),
    validateUserAccess("Job"),
    JobsController.updateJob
  )
  .patch(
    "/deactivate/:slug",
    isAuthenticatedUser,
    authorizeRole(["MASTER", "RECRUITER"]),
    validateUserAccess("Job"),
    JobsController.deactivateJobStatus
  )
  .patch(
    "/:slug",
    isAuthenticatedUser,
    authorizeRole(["MASTER", "RECRUITER"]),
    validateUserAccess("Job"),
    JobsController.updateJobStatus
  )
  .delete("/save-job/:slug", isAuthenticatedUser, JobsController.deleteSavedJob)
  .delete(
    "/:slug",
    isAuthenticatedUser,
    authorizeRole(["MASTER", "RECRUITER"]),
    validateUserAccess("Job"),
    JobsController.deleteJob
  );

module.exports = jobsRouter;
