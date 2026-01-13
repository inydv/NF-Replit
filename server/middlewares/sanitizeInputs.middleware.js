const { catchAsyncError } = require("../helpers");
const xss = require("xss");

module.exports = catchAsyncError(async (req, res, next) => {
  // Only sanitize string properties
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === "string") {
        obj[key] = xss(obj[key]);
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitize(obj[key]); // recursive
      }
    }
  };

  sanitize(req.body);
  sanitize(req.params);
  sanitize(req.query); // Note: only reads, doesn't reassign

  next();
});
