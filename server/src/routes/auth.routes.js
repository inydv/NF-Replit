const AuthController = require("../controllers/auth.controller");
const { signupValidation } = require("../validations/auth.validation");
const { isAuthenticatedUser, validate } = require("../middlewares");

const express = require("express");
const authRouter = express.Router();

authRouter
  .post("/signup", validate(signupValidation), AuthController.signup)
  .post("/login", isAuthenticatedUser, AuthController.login)
  .get("/verify/:token", AuthController.verifyAccount)
  .get("/logout", isAuthenticatedUser, AuthController.logout)
  .get("/me", isAuthenticatedUser, AuthController.me);

module.exports = authRouter;
