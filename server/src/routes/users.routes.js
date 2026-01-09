const UsersController = require("../controllers/users.controller");
const {
  isAuthenticatedUser,
  validate,
  authorizeRole,
  validateUserAccess,
} = require("../middlewares");
const {
  userProfileValidationSchema,
  managedUserValidation,
  UserRolesValidation,
} = require("../validations/users.validation");

const express = require("express");
const usersRouter = express.Router();

usersRouter
  .post(
    "/managed-user",
    validate(managedUserValidation),
    isAuthenticatedUser,
    authorizeRole(["MASTER", "RECRUITER"]),
    UsersController.addManagedUser
  )
  .get(
    "/managed-user",
    isAuthenticatedUser,
    authorizeRole(["MASTER", "RECRUITER"]),
    UsersController.listManagedUsers
  )
  .get("/list/recruiter", UsersController.listRecruiters)
  .get("/accept/invitation/:token", UsersController.acceptInvitation)
  .patch(
    "/profile",
    validate(userProfileValidationSchema),
    isAuthenticatedUser,
    UsersController.updateProfile
  )
  .patch(
    "/managed-user/:id",
    validate(UserRolesValidation),
    isAuthenticatedUser,
    authorizeRole(["MASTER", "RECRUITER"]),
    validateUserAccess("User"),
    UsersController.updateRoles
  )
  .delete(
    "/managed-user/:id",
    isAuthenticatedUser,
    authorizeRole(["MASTER", "RECRUITER"]),
    validateUserAccess("User"),
    UsersController.deleteManagedUsers
  );

module.exports = usersRouter;
