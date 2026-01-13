// IMPORT REQUIRED LOCAL FILES
const errors = require("./errors.middleware");
const isAuthenticatedUser = require("./authentication.middleware");
const authorizeRole = require("./authorizeRoles.middleware");
const { validate } = require("./validation.middleware");
const sanitizeInputs = require("./sanitizeInputs.middleware");
const sessionUser = require("./sessionUser.middleware");
const validateUserAccess = require("./validateUserAccess.middleware");

// EXPORT
module.exports = {
  errors,
  isAuthenticatedUser,
  authorizeRole,
  sanitizeInputs,
  validate,
  sessionUser,
  validateUserAccess,
};
