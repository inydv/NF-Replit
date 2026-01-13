require("dotenv").config({ path: `${process.cwd()}/.env` });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { catchAsyncError, errorHandler } = require("../helpers");
const prisma = require("../configs/database.config");
const { sendMail } = require("../utils");

const POST_JOB_FORM_EMAIL = `
Thank you for submitting your job listing to NursingFront.
Your post will be live on our platform within 24 hours, reaching thousands of qualified nurses.
If you have any questions or need assistance, please don’t hesitate to reach out—we’re here to help.
`;

async function handleModelTypeEmail({
  userEmail,
  jobId,
  name,
  slug,
  type,
  model,
  website,
}) {
  switch (model) {
    case "JOB":
      await sendMail({
        email: userEmail,
        subject: "New Job Link - Post Job Using the Link",
        template: "manageJob",
        data: {
          Link: `${process.env.FRONTEND_URL}/manage/job/${jobId}/${slug}`,
          LinkText: "Open Manage Job",
          Message: "You can mange your job posting with this a click.",
        },
      });
      break;

    case "QUICK_JOB":
      await sendMail({
        email: "fnduati@nursingfront.com",
        subject: "New Job Link - Post Job Using the Link",
        template: "manageJob",
        data: {
          Link: website,
          LinkText: "Job link sent from post job form",
          Message: `${name} with the email (${userEmail}) added a quick job. Post the job using the following link.`,
        },
      });

      await sendMail({
        email: userEmail,
        subject: "Confirmation Email - Your Job Link Has Been Received",
        template: "postJob",
        data: {
          Message: POST_JOB_FORM_EMAIL,
          urgentHiring: type === "URGENT" ? "Yes" : "No",
          featuredPlacement:
            type === "URGENT" || type === "FEATURED" ? "Yes" : "No",
        },
      });
      break;

    default:
      break;
  }
}

class PaymentController {
  createCheckoutSession = catchAsyncError(async (req, res, next) => {
    const { id, name, img, slug, email, type, model, website } = req.body;
    let price = 99.99;

    switch (type) {
      case "FEATURED":
        price = process.env.FEATURED_PRICE;
        break;
      case "URGENT":
        price = process.env.URGENT_PRICE;
        break;
      default:
        price = process.env.REGULAR_PRICE;
        break;
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: process.env.STRIPE_CURRENCY,
              product_data: {
                name: name,
                images: [img],
                description:
                  "Unlock Your Dream Career: Exciting Job Opportunities Await!",
              },
              unit_amount: price * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        metadata: {
          userEmail: String(email),
          jobId: String(id),
          name: String(name),
          slug: String(slug),
          type: String(type),
          model: String(model),
          website: String(website),
        },
        allow_promotion_codes: true,
        success_url: process.env.FRONTEND_URL,
        cancel_url: process.env.FRONTEND_URL,
      });

      return res.status(200).json({
        SUCCESS: true,
        DATA: {
          url: session.url,
        },
      });
    } catch (error) {
      return next(
        new errorHandler(error.message || error, error.statusCode || 500)
      );
    }
  });

  stripeWebhook = catchAsyncError(async (req, res, next) => {
    const signingSecret = process.env.STRIPE_SIGNING_SECRET;
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, signingSecret);
    } catch (error) {
      return next(
        new errorHandler(
          error.message || "Webhook signature verification failed.",
          error.statusCode || 500
        )
      );
    }

    const { metadata, id, payment_intent } = event.data.object;
    const { userEmail, jobId, name, slug, type, model, website } =
      metadata || payment_intent?.metadata;

    // Handle the event
    switch (event.type) {
      case "checkout.session.async_payment_succeeded":
      case "checkout.session.completed":
        try {
          if (!jobId)
            return next(new errorHandler("Missing jobId in metadata.", 400));

          const job = await prisma.jobs.findUnique({
            where: { id: jobId },
          });

          const quickJob = await prisma.quickJobs.findUnique({
            where: { id: jobId },
          });

          if (!job && !quickJob)
            return next(new errorHandler(`Job not found: ${jobId}`, 404));

          if (job)
            await prisma.jobs.update({
              where: { id: metadata?.jobId },
              data: {
                payment: { id: id || "", payment_intent: payment_intent || "" },
                active: true,
                isDrafted: false,
              },
            });

          await handleModelTypeEmail({
            userEmail,
            jobId,
            name,
            slug,
            type,
            model,
            website,
          });
        } catch (error) {
          return next(
            new errorHandler(
              error.message || "Webhook signature verification failed.",
              error.statusCode || 500
            )
          );
        }
        break;

      case "checkout.session.async_payment_failed":
      case "checkout.session.expired":
        try {
          if (!jobId)
            return next(new errorHandler("Missing jobId in metadata.", 400));

          await prisma.jobs.delete({
            where: { id: metadata?.jobId },
          });

          await prisma.quickJobs.delete({
            where: { id: metadata?.jobId },
          });
        } catch (error) {
          return next(
            new errorHandler(
              error.message ||
                "Error handling payment failure/expiration webhook.",
              error.statusCode || 500
            )
          );
        }
        break;

      default:
        // return next(
        //   new errorHandler(`Unhandled event type ${event.type}`, 500)
        // );
        break;
    }

    res.status(200).json({
      SUCCESS: true,
    });
  });
}

module.exports = new PaymentController();
