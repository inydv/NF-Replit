const ContactsController = require("../controllers/contacts.controller");
const { validate } = require("../middlewares");
const {
  contactValidationSchema,
} = require("../validations/contacts.validation");

const express = require("express");
const contactsRouter = express.Router();

contactsRouter.post(
  "/",
  validate(contactValidationSchema),
  ContactsController.createContacts
);

module.exports = contactsRouter;
