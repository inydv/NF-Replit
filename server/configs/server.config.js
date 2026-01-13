const cloudinary = require("cloudinary");
// const express = require("express");
const path = require("path")

const { sendMail } = require("../utils");

module.exports = (expressApp) => {
  process.on("uncaughtException", async (err) => {
    console.error(`❌ Uncaught Exception: ${err.name} - ${err.message}`);
    console.error("UNCAUGHT EXCEPTION!💥 SHUTTING down.....");

    await sendMail({
      email: "fnduati@nursingfront.com",
      subject: "UNCAUGHT EXCEPTION!💥 SERVER SHUTTING down.....",
      template: "error",
      data: {
        Message: `❌ Uncaught Exception: ${err.name} - ${err.message}`,
      },
    });

    process.exit(1);
  });

  // CLOUDINARY CONFIGS
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // USE BUILD INDEX.JS
  // expressApp.use(express.static(path.join(__dirname, "dist")));

  expressApp.use((req, res, next) => {
    // FOR NON-API ROUTES, SEND THE "index.html" FILE
    if (!req.originalUrl.startsWith('/api/v1')) 
      return res.sendFile('index.html', { root: path.join(__dirname, 'dist') });

    // FOR API ROUTES, CONTINUE TO THE NEXT MIDDLEWARE
    next();
  });

  const port = process.env.PORT || 5000;
  const server = expressApp.listen(port, "0.0.0.0", () => {
    console.log(`🚀 SERVER IS WORKING ON ${port}.....`);
  });

  process.on("unhandledRejection", async (err) => {
    console.error(`❌ Unhandled Rejection: ${err.name} - ${err.message}`);
    console.error("UNHANDLED REJECTION!💥 SHUTTING down.....");

    await sendMail({
      email: "fnduati@nursingfront.com",
      subject: "UNHANDLED REJECTION!💥 SERVER SHUTTING down.....",
      template: "error",
      data: {
        Message: `❌ Unhandled Rejection: ${err.name} - ${err.message}`,
      },
    });

    server.close(() => process.exit(1));
  });
};
