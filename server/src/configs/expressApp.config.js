const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const cors = require("cors");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const pgSession = require("connect-pg-simple")(session);
const { Pool } = require("pg");
const crypto = require("crypto");

const { errors, sanitizeInputs } = require("../middlewares");
const { errorHandler } = require("../helpers");
const {
  authRouter,
  blogRouter,
  companyRouter,
  jobRouter,
  paymentRouter,
  quickJobRouter,
  redditRouter,
  subscribedUserRouter,
  usersRouter,
  contactsRouter,
  notificationsRouter,
} = require("../routes");
const {
  AUTH,
  BLOGS,
  COMPANIES,
  JOBS,
  PAYMENT,
  QUICK_JOBS,
  REDDIT,
  SUBSCRIBED_USERS,
  USERS,
  CONTACTS,
  NOTIFICATIONS,
} = require("../constants/routes.constant.json");

const expressApp = express();

// Middleware configurations
// expressApp.set("trust proxy", true);
expressApp.use((req, res, next) => {
  if (req.originalUrl === "/api/v1/payment/stripe/webhook") {
    next();
  } else {
    express.json({ limit: "500kb" })(req, res, next);
  }
});
expressApp.use(express.urlencoded({ limit: "500kb", extended: true }));
expressApp.use(hpp());
expressApp.use(sanitizeInputs);

// Helmet configuration with CSP
expressApp.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString("base64");
  next();
});
expressApp.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
      },
    },
  })
);

// CORS configuration
expressApp.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "https://www.nursingfront.com",
        process.env.FRONTEND_URL,
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
    allowedHeaders: [
      "Access-Control-Allow-Origin",
      "Content-Type",
      "Authorization",
    ],
  })
);

// Rate limiting
const limit = rateLimit({
  windowMS: process.env.RATE_LIMIT_WINDOW_MS || 1 * 60 * 1000, // Default: 1 minute
  max: process.env.RATE_LIMIT_MAX || 50, // Default: 5 requests
});

// Session configuration
const pgPool = new Pool({ connectionString: process.env.DATABASE_URL });
expressApp.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRODUCTION",
    },
    store: new pgSession({
      pool: pgPool,
      tableName: "Sessions",
    }),
  })
);

// View engine
expressApp.set("view engine", "ejs");

// Routes
expressApp.use(AUTH, limit, authRouter);
expressApp.use(COMPANIES, companyRouter);
expressApp.use(JOBS, jobRouter);
expressApp.use(SUBSCRIBED_USERS, subscribedUserRouter);
expressApp.use(BLOGS, blogRouter);
expressApp.use(PAYMENT, paymentRouter);
expressApp.use(REDDIT, redditRouter);
expressApp.use(QUICK_JOBS, quickJobRouter);
expressApp.use(USERS, usersRouter);
expressApp.use(CONTACTS, contactsRouter);
expressApp.use(NOTIFICATIONS, notificationsRouter);

// 404 handler
expressApp.use((req, res, next) => {
  next(new errorHandler("LOOK LIKE YOU ARE LOST!!!", 404));
});

// Error handling middleware
expressApp.use(errors);

module.exports = expressApp;
