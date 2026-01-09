const { catchAsyncError } = require("../helpers");
const prisma = require("../configs/database.config");

class QuickJobsController {
  createQuickJob = catchAsyncError(async (req, res, next) => {
    const { name, email, website, isFeatured, isUrgent } = req.body;

    const job = await prisma.quickJobs.create({
      data: { name, email: email.toLowerCase(), website, isFeatured, isUrgent },
    });

    res.status(201).json({
      SUCCESS: true,
      MESSAGE: "Quick job created successfully",
      DATA: job,
    });
  });
}

module.exports = new QuickJobsController();
