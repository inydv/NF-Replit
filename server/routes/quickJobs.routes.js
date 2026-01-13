const QuickJobsController = require("../controllers/quickJobs.controller");
const { validate } = require("../middlewares");
const {
  quickJobValidationSchema,
} = require("../validations/quickJobs.validation");

const express = require("express");
const quickJobsRouter = express.Router();

quickJobsRouter.post(
  "/",
  validate(quickJobValidationSchema),
  QuickJobsController.createQuickJob
);

module.exports = quickJobsRouter;
