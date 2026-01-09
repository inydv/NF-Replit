const Joi = require("joi");

const blogValidationSchema = Joi.object({
  title: Joi.string().min(3).max(500).required(),
  author: Joi.string().min(3).max(150).required(),
  description: Joi.string().min(10).max(1000).required(),
  content: Joi.string().required(),
  author: Joi.string().min(3).max(150).required(),
  image: Joi.object({
    public_id: Joi.string().min(3).max(200).required(),
    url: Joi.string().uri().required(),
  }).required(),
});

module.exports = { blogValidationSchema };
