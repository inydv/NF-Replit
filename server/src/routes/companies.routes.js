const CompaniesController = require("../controllers/companies.controller");
const {
  companyProfileValidationSchema,
  companyValidationSchema,
} = require("../validations/companies.validation");
const {
  isAuthenticatedUser,
  authorizeRole,
  validate,
  validateUserAccess,
} = require("../middlewares");

const express = require("express");
const companiesRouter = express.Router();

companiesRouter
  .post(
    "/",
    validate(companyValidationSchema),
    isAuthenticatedUser,
    authorizeRole(["MASTER", "RECRUITER"]),
    CompaniesController.createCompany
  )
  .get("/", CompaniesController.listCompany)
  .get(
    "/using-user",
    isAuthenticatedUser,
    authorizeRole(["MASTER", "RECRUITER"]),
    CompaniesController.listCompanyUsingUser
  )
  .get("/:slug", CompaniesController.getCompany)
  .put(
    "/profile/:slug",
    validate(companyProfileValidationSchema),
    isAuthenticatedUser,
    authorizeRole(["MASTER", "RECRUITER"]),
    validateUserAccess("Company"),
    CompaniesController.updateCompanyProfile
  )
  .put(
    "/:slug",
    validate(companyValidationSchema),
    isAuthenticatedUser,
    authorizeRole(["MASTER", "RECRUITER"]),
    validateUserAccess("Company"),
    CompaniesController.updateCompany
  )
  .delete(
    "/:slug",
    isAuthenticatedUser,
    authorizeRole(["MASTER", "RECRUITER"]),
    validateUserAccess("Company"),
    CompaniesController.deleteBlog
  );

module.exports = companiesRouter;
