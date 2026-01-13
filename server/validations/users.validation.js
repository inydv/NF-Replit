const Joi = require("joi");

const userProfileValidationSchema = Joi.object({
  name: Joi.string().min(3).max(150).optional().allow(null),
  title: Joi.string().min(3).max(200).optional().allow(null),
  phone: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .optional()
    .allow(null),
  image: Joi.object({
    public_id: Joi.string().min(3).max(200).required(),
    url: Joi.string().uri().required(),
  })
    .optional()
    .allow(null),
  location: Joi.string().min(3).max(200).optional().allow(null),
  links: Joi.object({
    linkedIn: Joi.string().uri().optional(),
  })
    .optional()
    .allow(null),
  about: Joi.string().min(3).max(1000).optional().allow(null),
  experience: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().min(3).max(200).required(),
        hospital: Joi.string().min(3).max(500).required(),
        location: Joi.string().min(3).max(200).required(),
        // startDate: Joi.date().required(),
        // endDate: Joi.date().greater(Joi.ref("startDate")).optional(),
        startDate: Joi.string().required(),
        endDate: Joi.string().optional(),
        description: Joi.string().max(1000).optional(),
      })
    )
    .optional(),
  education: Joi.array()
    .items(
      Joi.object({
        degree: Joi.string().min(3).max(500).required(),
        institution: Joi.string().min(3).max(200).required(),
        // graduationYear: Joi.date().required(),
        graduationYear: Joi.string().required(),
      })
    )
    .optional(),
  certification: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().min(3).max(500).required(),
        issuingOrganization: Joi.string().min(3).max(500).required(),
        // issueDate: Joi.date().required(),
        // expirationDate: Joi.date().greater(Joi.ref("issueDate")).optional(),
        issueDate: Joi.string().required(),
        expirationDate: Joi.string().optional(),
      })
    )
    .optional(),
  skills: Joi.array().items(Joi.string().min(1).max(150)).optional(),
});

const managedUserValidation = Joi.object({
  email: Joi.string().email().required(),
  accessPages: Joi.array()
    .items(Joi.string().valid("JOBS", "COMPANIES", "USERS", "BLOGS"))
    .required(),
});

const UserRolesValidation = Joi.object({
  accessPages: Joi.array()
    .items(Joi.string().valid("JOBS", "COMPANIES", "USERS", "BLOGS"))
    .required(),
});

module.exports = {
  userProfileValidationSchema,
  managedUserValidation,
  UserRolesValidation,
};
