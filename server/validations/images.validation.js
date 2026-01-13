const Joi = require("joi");

const imagesValidationSchema = Joi.object({
  images: Joi.array().items(Joi.string()).required(),
});

module.exports = {
  imagesValidationSchema,
};
