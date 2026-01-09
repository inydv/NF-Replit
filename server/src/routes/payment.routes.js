const PaymentController = require("../controllers/payment.controller");
const {
  paymentValidationSchema,
} = require("../validations/payment.validation");
const { validate } = require("../middlewares");

const express = require("express");
const paymentRouter = express.Router();

paymentRouter
  .post(
    "/stripe/create-checkout-session",
    validate(paymentValidationSchema),
    PaymentController.createCheckoutSession
  )
  .post(
    "/stripe/webhook",
    express.raw({ type: "application/json" }),
    PaymentController.stripeWebhook
  );

module.exports = paymentRouter;
