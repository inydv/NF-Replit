const axios = require("axios");
const { createCanvas } = require("canvas");
const fs = require("fs");
const formData = require("form-data");
const prisma = require("../configs/database.config");
const { sendMail } = require("../utils");

// Constants
const IMAGE_WIDTH = 1200;
const IMAGE_HEIGHT = 630; // Optimal Facebook image size
const BACKGROUND_COLOR = "#d9d5f6";
const TEXT_COLOR = "#000000";
const FONT_STYLE = "bold 30px Arial";
const LINE_HEIGHT = 40;
const TEMP_IMAGE_PATH = "./nursing_job_opportunity.png";

// Utility function to send error emails
async function handleError(email, subject, message) {
  await sendMail({
    email,
    subject,
    template: "error",
    data: { Message: message },
  });
}

// Function to generate an image with job details
async function generateImage({ companyname, jobTitle }) {
  const message = `
  ${companyname} is hiring a ${jobTitle}
  Don’t miss this opportunity. Apply now!!
  `;

  const canvas = createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
  const context = canvas.getContext("2d");

  // Set background color
  context.fillStyle = BACKGROUND_COLOR;
  context.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

  // Set text styles
  context.font = FONT_STYLE;
  context.fillStyle = TEXT_COLOR;
  context.textAlign = "center";
  context.textBaseline = "middle";

  // Split message into lines and calculate positioning
  const lines = message.trim().split("\n");
  const totalTextHeight = lines.length * LINE_HEIGHT;
  let yPosition = (IMAGE_HEIGHT - totalTextHeight) / 2;

  // Draw each line centered horizontally and vertically
  lines.forEach((line) => {
    context.fillText(line.trim(), IMAGE_WIDTH / 2, yPosition);
    yPosition += LINE_HEIGHT;
  });

  // Save the image
  const buffer = canvas.toBuffer("image/png");

  try {
    fs.writeFileSync(TEMP_IMAGE_PATH, buffer);
    return TEMP_IMAGE_PATH;
  } catch (error) {
    await handleError(
      "fnduati@nursingfront.com",
      "Cron Job Error",
      `Facebook Image Generation Error: ${error.message}`
    );
    return null;
  }
}

// Function to post a message to Facebook
async function postToFacebook() {
  const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_BUSINESS_PAGE_ID;

  try {
    // Fetch the most recent job that meets the criteria
    const mostRecentJob = await prisma.jobs.findFirst({
      where: {
        active: true,
        isDrafted: false,
        isPostedOnFacebook: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!mostRecentJob) {
      console.log("No eligible job found to post.");
      return;
    }

    // Generate the image
    const imagePath = await generateImage({
      companyname: mostRecentJob.company_name,
      jobTitle: mostRecentJob.job_title,
    });

    if (!imagePath) {
      console.error("Image generation failed.");
      return;
    }

    const message = `✨New Job Opportunity Alert!✨\n\n Apply Now 👉 https://www.nursingfront.com/?jobId=${mostRecentJob.id} 🚀\n\n #NursingJobs #HealthcareCareers #NursingFront`;
    const url = `https://graph.facebook.com/${pageId}/photos?access_token=${pageAccessToken}`;

    // Create a FormData instance
    const form = new formData();
    form.append("message", message);
    form.append("source", fs.createReadStream(imagePath));

    const response = await axios.post(url, form, {
      headers: { ...form.getHeaders() },
    });

    if (response.status === 200) {
      console.log("Post was successful!");
      // Update the job as posted
      await prisma.jobs.update({
        where: { id: mostRecentJob.id },
        data: { isPostedOnFacebook: true },
      });
    } else {
      console.error("Failed to post:", response.data);
    }
  } catch (error) {
    await handleError(
      "fnduati@nursingfront.com",
      "Cron Job Error",
      `Facebook Job Posting Error: ${error.response?.data || error.message}`
    );
  } finally {
    // Clean up the temporary image file
    if (fs.existsSync(TEMP_IMAGE_PATH)) {
      fs.unlinkSync(TEMP_IMAGE_PATH);
    }
  }
}

module.exports = postToFacebook;
