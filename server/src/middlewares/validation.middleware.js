const { errorHandler, catchAsyncError } = require("../helpers");

const validate = (schema) =>
  catchAsyncError(async (req, res, next) => {
    if (!req.body)
      return next(new errorHandler("Request body can't be empty", 400));

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return next(
        new errorHandler(
          error.details.map((err) => err.message).join(", "),
          400
        )
      );
    }

    next();
  });

module.exports = { validate };
