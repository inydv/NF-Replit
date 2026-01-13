const Joi = require("joi");

const quickJobValidationSchema = Joi.object({
  name: Joi.string().min(3).max(150).required(),
  email: Joi.string().email().required(),
  website: Joi.string().uri().required(),
  isFeatured: Joi.boolean().required(),
  isUrgent: Joi.boolean().required(),
});

module.exports = { quickJobValidationSchema };
