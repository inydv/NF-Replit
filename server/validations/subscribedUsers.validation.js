const Joi = require("joi");

const subscribedUserValidationSchema = Joi.object({
  email: Joi.string().email().required(),
});

const subscribedUserToConvertKitValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(3).max(150).required(),
  message: Joi.string().required(),
});

module.exports = {
  subscribedUserValidationSchema,
  subscribedUserToConvertKitValidationSchema,
};
