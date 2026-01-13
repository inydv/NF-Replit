const Joi = require("joi");

const paymentValidationSchema = Joi.object({
  id: Joi.string().uuid().required(),
  name: Joi.string().min(3).max(500).required(),
  img: Joi.string().uri().required(),
  slug: Joi.string().required(),
  email: Joi.string().email().required(),
  type: Joi.string().valid("REGULAR", "FEATURED", "URGENT").required(),
  model: Joi.string().valid("JOB", "QUICK_JOB").required(),
  website: Joi.string().uri().required(),
});

module.exports = { paymentValidationSchema };
