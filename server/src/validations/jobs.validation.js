const Joi = require("joi");

const jobValidationSchema = Joi.object({
  title: Joi.string().max(500).required(),
  overview: Joi.string().optional(),
  location: Joi.string().max(150).required(),
  minSalary: Joi.number().optional(),
  maxSalary: Joi.number().optional(),
  salaryType: Joi.string()
    .valid("HOURLY", "DAILY", "WEEKLY", "MONTHLY", "YEARLY", "SALARY")
    .optional(),
  website: Joi.string().uri().max(1000).optional(),
  schedule: Joi.string().max(50).optional(),
  employementType: Joi.string()
    .valid(
      "FULL_TIME",
      "PART_TIME",
      "INTERNSHIP",
      "CONTRACT",
      "FREELANCEING",
      "PER_DIEM"
    )
    .optional(),
  jobType: Joi.string()
    .valid("REMOTE", "ONSITE", "HYBRID", "TRAVEL")
    .optional(),
  shift: Joi.string()
    .valid(
      "DAY",
      "NIGHT",
      "MORNING",
      "EVENING",
      "WEEKEND",
      "AFTERNOON",
      "OVERNIGHT"
    )
    .optional(),
  companyName: Joi.string().max(300).required(),
  companyLocation: Joi.string().max(200).optional(),
  companyImage: Joi.object({
    public_id: Joi.string().min(3).max(200).required(),
    url: Joi.string().uri().required(),
  }).required(),
  email: Joi.string().email().max(100).required(),
  experience: Joi.string().max(150).optional(),
  isUrgent: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
  companyId: Joi.string().uuid().min(36).max(36).optional(),
});

module.exports = {
  jobValidationSchema,
};
