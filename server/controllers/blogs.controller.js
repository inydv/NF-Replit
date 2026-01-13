const { catchAsyncError, errorHandler } = require("../helpers");
const prisma = require("../configs/database.config");
const generateSlug = require("../pipes/generateSlug.pipe");

class BlogsController {
  CreateBlog = catchAsyncError(async (req, res, next) => {
    const { title, description, content, author, image } = req.body;
    const slug = generateSlug(`${title}-by-${author}`);

    await prisma.blogs.create({
      data: {
        title,
        description,
        content,
        author,
        slug,
        image,
        createdById: req.user.createdById || req.user.id,
      },
    });

    res
      .status(201)
      .json({ SUCCESS: true, MESSAGE: "Blog created successfully" });
  });

  GetBlog = catchAsyncError(async (req, res, next) => {
    const { slug } = req.params;

    const blog = await prisma.blogs.findUnique({ where: { slug } });
    if (!blog) return next(new errorHandler("Blog not found", 404));

    res
      .status(200)
      .json({ SUCCESS: true, MESSAGE: "Get blog successfully", DATA: blog });
  });

  ListBlog = catchAsyncError(async (req, res, next) => {
    const blogs = await prisma.blogs.findMany({
      orderBy: { createdAt: "desc" },
    });

    // TODO: CHANGE TO PRISMA ORDER_BY
    // const sortedBlogs = blogs.sort(
    //   (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    // );

    res.status(200).json({
      SUCCESS: true,
      MESSAGE: "List blog successfully",
      DATA: blogs,
    });
  });

  deleteBlog = catchAsyncError(async (req, res, next) => {
    const { slug } = req.params;

    await prisma.blogs.delete({ where: { slug } });

    res
      .status(200)
      .json({ SUCCESS: true, MESSAGE: "Blog deleted successfully" });
  });

  updateBlog = catchAsyncError(async (req, res, next) => {
    const { slug } = req.params;
    const { title, description, content, author, image } = req.body;
    const newSlug = generateSlug(`${title}-by-${author}`);

    await prisma.blogs.update({
      where: { slug },
      data: { title, description, content, author, slug: newSlug, image },
    });

    res
      .status(200)
      .json({ SUCCESS: true, MESSAGE: "Blog updated successfully" });
  });
}

module.exports = new BlogsController();
