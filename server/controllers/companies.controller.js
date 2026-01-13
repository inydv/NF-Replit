const { catchAsyncError, errorHandler } = require("../helpers");
const prisma = require("../configs/database.config");
const generateSlug = require("../pipes/generateSlug.pipe");

class UsersController {
  createCompany = catchAsyncError(async (req, res, next) => {
    const {
      name,
      location,
      website,
      image,
      personalHealth,
      teamValues,
      careerGrowth,
    } = req.body;
    const slug = generateSlug(`${name}-in-${location}`);

    await prisma.companies.create({
      data: {
        name,
        location,
        website,
        image,
        personalHealth,
        teamValues,
        careerGrowth,
        slug,
        createdById: req.user.createdById || req.user.id,
      },
    });

    res.status(201).json({
      SUCCESS: true,
      MESSAGE: "Company created successfully",
    });
  });

  updateCompany = catchAsyncError(async (req, res, next) => {
    const { slug } = req.params;
    const {
      name,
      location,
      website,
      image,
      personalHealth,
      teamValues,
      careerGrowth,
    } = req.body;
    const newSlug = generateSlug(`${name}-in-${location}`);

    await prisma.companies.update({
      where: { slug },
      data: {
        name,
        location,
        website,
        image,
        personalHealth,
        teamValues,
        careerGrowth,
        slug: newSlug,
      },
    });

    res.status(201).json({
      SUCCESS: true,
      MESSAGE: "Company updated successfully",
    });
  });

  deleteBlog = catchAsyncError(async (req, res, next) => {
    const { slug } = req.params;

    await prisma.companies.update({ where: { slug }, data: { active: false } });

    res
      .status(200)
      .json({ SUCCESS: true, MESSAGE: "Company inactive successfully" });
  });

  getCompany = catchAsyncError(async (req, res, next) => {
    const { slug } = req.params;

    const company = await prisma.companies.findUnique({
      where: { slug },
      include: {
        jobs: true
      }
    });
    if (!company) return next(new errorHandler("Company not found", 404));

    res.status(200).json({
      SUCCESS: true,
      MESSAGE: "Get company successfully",
      DATA: company,
    });
  });

  listCompany = catchAsyncError(async (req, res, next) => {
    const companies = await prisma.companies.findMany();

    res.status(200).json({
      SUCCESS: true,
      MESSAGE: "List companies successfully",
      DATA: companies,
    });
  });

  listCompanyUsingUser = catchAsyncError(async (req, res, next) => {
    const companies = await prisma.companies.findMany({
      where: { createdById: req.user.createdById || req.user.id },
    });

    res.status(200).json({
      SUCCESS: true,
      MESSAGE: "List companies successfully",
      DATA: companies,
    });
  });

  updateCompanyProfile = catchAsyncError(async (req, res, next) => {
    const { slug } = req.params;
    const {
      description,
      establishedAt,
      teamsize,
      headquarter,
      industry,
      mission,
      values,
      galleries,
      testimonials,
    } = req.body;

    await prisma.companies.update({
      where: { slug },
      data: {
        description,
        establishedAt,
        teamsize,
        headquarter,
        industry,
        mission,
        values,
        galleries,
        testimonials,
      },
    });

    res.status(201).json({
      SUCCESS: true,
      MESSAGE: "Company profile updated successfully",
    });
  });
}

module.exports = new UsersController();
