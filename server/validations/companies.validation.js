const Joi = require("joi");

const companyValidationSchema = Joi.object({
  name: Joi.string().min(3).max(300).required(),
  location: Joi.string().min(3).max(150).required(),
  website: Joi.string().uri().required(),
  image: Joi.object({
    public_id: Joi.string().min(3).max(200).required(),
    url: Joi.string().uri().required(),
  }).required(),
  personalHealth: Joi.array().items(Joi.string()),
  teamValues: Joi.array().items(Joi.string()),
  careerGrowth: Joi.array().items(Joi.string()),
});

const companyProfileValidationSchema = Joi.object({
  description: Joi.string().min(3).max(300).optional(),
  establishedAt: Joi.string().min(3).max(50).optional(),
  teamsize: Joi.string().min(1).max(50).optional(),
  headquarter: Joi.string().min(3).max(150).optional(),
  industry: Joi.string().min(3).max(150).optional(),
  mission: Joi.object({
    image: Joi.object({
      public_id: Joi.string().min(3).max(200).required(),
      url: Joi.string().uri().required(),
    }).optional(),
    quote: Joi.string().min(3).max(500).empty().allow("").optional(),
    specialties: Joi.array().items(Joi.string()).optional(),
  }).optional(),
  values: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().min(3).max(500).empty().allow("").optional(),
        image: Joi.object({
          public_id: Joi.string().min(3).max(200).required(),
          url: Joi.string().uri().required(),
        }).optional(),
        icon: Joi.string()
          .valid("Lightbulb", "Users", "Award", "Heart", "Target")
          .required(),
        description: Joi.string().min(3).max(2500).empty().allow("").optional(),
      })
    )
    .optional(),
  galleries: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().min(3).max(500).empty().allow("").optional(),
        image: Joi.object({
          public_id: Joi.string().min(3).max(200).required(),
          url: Joi.string().uri().required(),
        }).optional(),
        description: Joi.string().min(3).max(2500).empty().allow("").optional(),
      })
    )
    .optional(),
  testimonials: Joi.array()
    .items(
      Joi.object({
        position: Joi.string().min(3).max(500).empty().allow("").optional(),
        image: Joi.object({
          public_id: Joi.string().min(3).max(200).required(),
          url: Joi.string().uri().required(),
        }).optional(),
        quote: Joi.string().min(3).max(1000).empty().allow("").optional(),
        author: Joi.string().min(3).max(500).empty().allow("").optional(),
      })
    )
    .optional(),
});

module.exports = { companyValidationSchema, companyProfileValidationSchema };
