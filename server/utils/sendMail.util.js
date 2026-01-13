const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

module.exports = async ({ email, subject, template, data }) => {
  try {
    // Create Transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Template Path
    const templatePath = path.resolve(
      process.cwd(),
      `../templates/${template}.ejs`
    );

    // Render Template
    const HTML = await ejs.renderFile(templatePath, data);

    // Send Email
    return transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USERNAME,
      to: email,
      subject: subject,
      html: HTML,
    });
  } catch (error) {
    throw new Error("Failed to send email.");
  }
};
