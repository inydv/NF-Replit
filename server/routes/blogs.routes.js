const BlogsController = require("../controllers/blogs.controller");
const { blogValidationSchema } = require("../validations/blogs.validation");
const {
  isAuthenticatedUser,
  validate,
  validateUserAccess,
} = require("../middlewares");

const express = require("express");
const blogsRouter = express.Router();

blogsRouter
  .post(
    "/",
    validate(blogValidationSchema),
    isAuthenticatedUser,
    BlogsController.CreateBlog
  )
  .get("/", BlogsController.ListBlog)
  .get("/:slug", BlogsController.GetBlog)
  .put(
    "/:slug",
    validate(blogValidationSchema),
    isAuthenticatedUser,
    validateUserAccess("Blog"),
    BlogsController.updateBlog
  )
  .delete(
    "/:slug",
    isAuthenticatedUser,
    validateUserAccess("Blog"),
    BlogsController.deleteBlog
  );

module.exports = blogsRouter;
