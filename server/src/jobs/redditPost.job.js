const snoowrap = require("snoowrap");
const { createCanvas } = require("canvas");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const prisma = require("../configs/database.config");
const { sendMail } = require("../utils");

// Validate required environment variables
const requiredEnvVars = [
  "REDDIT_USER_AGENT",
  "REDDIT_CLIENT_ID",
  "REDDIT_CLIENT_SECRET",
  "REDDIT_REFRESH_TOKEN",
  "SUBREDDIT_NAME",
];
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

// Initialize Reddit client
const redditClient = new snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT,
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  refreshToken: process.env.REDDIT_REFRESH_TOKEN,
});

// Helper function to send error emails
async function handleError(email, subject, message, error) {
  console.error(`${subject}: ${error.message}`);
  await sendMail({
    email,
    subject,
    template: "error",
    data: { Message: `${message}: ${error.message}` },
  });
}

// Upload image to Cloudinary
async function uploadImageToCloudinary(imagePath) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "nursing_jobs",
    });
    return result.secure_url;
  } catch (err) {
    await handleError(
      "fnduati@nursingfront.com",
      "Cron Job Error",
      "Reddit Image Upload Error",
      err
    );
    throw err;
  }
}

// Generate an image with job details
async function generateImage({ companyname, jobTitle }) {
  const message = `
  ${companyname} is hiring a ${jobTitle}
  Don’t miss this opportunity. Apply now!!
  `;

  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  // Set background and text styles
  context.fillStyle = "#d9d5f6";
  context.fillRect(0, 0, width, height);
  context.font = "bold 30px Arial";
  context.fillStyle = "#000000";
  context.textAlign = "center";
  context.textBaseline = "middle";

  // Draw text
  const lines = message.trim().split("\n");
  const lineHeight = 40;
  const totalTextHeight = lines.length * lineHeight;
  let yPosition = (height - totalTextHeight) / 2;
  lines.forEach((line) => {
    context.fillText(line.trim(), width / 2, yPosition);
    yPosition += lineHeight;
  });

  // Save image
  const imagePath = "./nursing_job_opportunity_reddit.png";
  const buffer = canvas.toBuffer("image/png");
  try {
    fs.writeFileSync(imagePath, buffer);
    return imagePath;
  } catch (err) {
    await handleError(
      "fnduati@nursingfront.com",
      "Cron Job Error",
      "Reddit Image Generation Error",
      err
    );
    throw err;
  }
}

// Fetch the most recent job
async function fetchMostRecentJob(table) {
  try {
    return await prisma[table].findFirst({
      where: { isPostedOnReddit: false, active: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    await handleError(
      "fnduati@nursingfront.com",
      "Cron Job Error",
      "Reddit Database Query Error",
      err
    );
    throw err;
  }
}

// Mark a job as posted
async function markJobAsPosted(jobId) {
  try {
    await prisma.jobs.update({
      where: { id: jobId },
      data: { isPostedOnReddit: true },
    });
  } catch (err) {
    await handleError(
      "fnduati@nursingfront.com",
      "Cron Job Error",
      "Reddit Job Status Update Error",
      err
    );
    throw err;
  }
}

// Post a job to Reddit
async function postJobToReddit(job, isCrawled = false) {
  const message = `
  **🏥 Company:** ${job.companyName}  
  **💼 Title:** ${job.title}  
  **📍 Location:** ${job.location}  
  
  👉 [See details and apply](https://www.nursingfront.com/view-job-details/${job.slug})  
  `;

  try {
    if (!isCrawled) {
      const imagePath = await generateImage({
        companyname: job.companyName,
        jobTitle: job.title,
      });
      const imageURL = await uploadImageToCloudinary(imagePath);

      await redditClient.getSubreddit(process.env.SUBREDDIT_NAME).submitLink({
        title: `${job.companyName} is hiring a ${job.title}!`,
        text: message.trim(),
        url: imageURL,
        resubmit: true,
        nsfw: false,
      });

      // Clean up temporary image file
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("Temporary image file deleted.");
      }
    } else {
      await redditClient
        .getSubreddit(process.env.SUBREDDIT_NAME)
        .submitSelfpost({
          title: `${job.companyName} is hiring a ${job.title}!`,
          text: message.trim(),
        });
    }

    await markJobAsPosted(job.id);
  } catch (err) {
    await handleError(
      "fnduati@nursingfront.com",
      "Cron Job Error",
      "Reddit Job Posting Error",
      err
    );
    throw err;
  }
}

// Exported functions
exports.postFeaturedJobToReddit = async () => {
  try {
    const job = await fetchMostRecentJob("jobs");
    if (!job) {
      console.error("No jobs found to post to Reddit.");
      return;
    }
    await postJobToReddit(job);
  } catch (err) {
    console.error("Error posting featured job to Reddit:", err.message);
  }
};

exports.postCrawledJobToReddit = async () => {
  try {
    const job = await fetchMostRecentJob("crawledJobs");
    if (!job) {
      console.error("No crawled jobs found to post to Reddit.");
      return;
    }
    await postJobToReddit(job, true);
  } catch (err) {
    console.error("Error posting crawled job to Reddit:", err.message);
  }
};
