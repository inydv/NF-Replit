const imagesController = require("../controllers/images.controller");
const { validate, isAuthenticatedUser } = require("../middlewares");
const { imagesValidationSchema } = require("../validations/images.validation");

const express = require("express");
const imagesRouter = express.Router();

imagesRouter.delete(
  "/cloudinary",
  validate(imagesValidationSchema),
  isAuthenticatedUser,
  imagesController.deleteImageFromCloudinary
);

module.exports = imagesRouter;
