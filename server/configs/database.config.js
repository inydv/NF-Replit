const { PrismaClient } = require("@prisma/client");
module.exports = new PrismaClient({
  log: ["query", "info", "warn", "error"], // Enable detailed logging
});
