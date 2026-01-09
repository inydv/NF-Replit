const crypto = require("crypto");

module.exports = (length = 48) => {
  return crypto.randomBytes(length).toString("hex"); // 48 bytes = 96 hex chars
};
