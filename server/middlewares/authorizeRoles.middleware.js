const { errorHandler } = require("../helpers");

module.exports = (roles) => {
  return (req, res, next) => {
    const message =
      roles?.length > 1
        ? `Please log in as a ${roles[1].toLowerCase().replace("_", " ")} to continue`
        : "Invalid Role.....";

    if (!roles.includes(req.user.role))
      return next(new errorHandler(message, 400));

    next();
  };
};
