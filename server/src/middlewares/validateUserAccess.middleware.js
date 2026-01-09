const { errorHandler, catchAsyncError } = require("../helpers");
const prisma = require("../configs/database.config");

const TABLE_MAP = {
  Company: prisma.companies,
  Job: prisma.jobs,
  Blog: prisma.blogs,
  Notification: prisma.notifications,
  User: prisma.users,
};

module.exports = (table) => {
  return catchAsyncError(async (req, res, next) => {
    const model = TABLE_MAP[table];
    if (!model) return next(new errorHandler(`Invalid table: ${table}`, 400));

    const { slug, id } = req.params;
    const userId = req.user.createdById || req.user.id;
    const accessPages = req.user.accessPages;

    if (accessPages?.length > 0) {
      switch (table) {
        case "Company":
          if (!accessPages.includes("COMPANIES"))
            return next(new errorHandler(`Access ${table} Invalid`, 404));
          break;

        case "Job":
          if (!accessPages.includes("JOBS"))
            return next(new errorHandler(`Access ${table} Invalid`, 404));
          break;

        case "User":
          if (!accessPages.includes("USERS"))
            return next(new errorHandler(`Access ${table} Invalid`, 404));
          break;

        // case "Blog":
        //   if (!accessPages.includes("BLOGS"))
        //     return next(new errorHandler(`Access ${table} Invalid`, 404));
        //   break;

        default:
          break;
      }
    }

    let response;

    if (table === "Notification") {
      response = await model.findUnique({
        where: {
          id,
          userId,
        },
      });
    }
    if (table === "User") {
      response = await model.findUnique({
        where: {
          id,
          createdById: userId,
        },
      });
    } else {
      response = await model.findUnique({
        where: {
          slug,
          createdById: userId,
        },
      });
    }

    if (!response)
      return next(new errorHandler(`Access ${table} Invalid`, 404));

    next();
  });
};
