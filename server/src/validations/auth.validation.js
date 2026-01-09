const Joi = require("joi");

const signupValidation = Joi.object({
  name: Joi.string().min(3).max(150).optional(),
  role: Joi.string().valid("JOB_SEEKER", "RECRUITER").required(),
});

module.exports = { signupValidation };
