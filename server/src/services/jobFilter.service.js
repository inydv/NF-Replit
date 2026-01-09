// jobFilter.service.js

const { PrismaClient } = require("@prisma/client");
const zipcodes = require("zipcodes");
const prisma = new PrismaClient();

const TABLE_MAP = {
  JOBS: prisma.jobs,
  CRAWLED_JOBS: prisma.crawledJobs,
};

const normalizeInput = (input) => {
  if (!input) return [];
  if (typeof input === "string") {
    return input
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
  }
  if (Array.isArray(input)) {
    return input.map((i) => i.trim()).filter(Boolean);
  }
  return [];
};

exports.getFilteredJobs = async ({
  q = "",
  location = "",
  employementType = "",
  jobType = "",
  salary_gte = 1,
  salary_lte = 10000000,
  table,
}) => {
  const employmentTypeArray = normalizeInput(employementType);
  const jobTypeArray = normalizeInput(jobType);

  const model = TABLE_MAP[table];
  if (!model) throw new Error(`Invalid table: ${table}`);

  const locationObj = zipcodes.lookup(location);
  let city = location;
  let state = location;
  let country = location;

  if (locationObj) {
    city = locationObj.city?.toLowerCase();
    state = locationObj.state?.toLowerCase();
    country = locationObj.country?.toLowerCase();
  }

  const payLower = parseFloat(salary_gte || 1);
  const payUpper = parseFloat(salary_lte || 10000000);

  return model.findMany({
    where: {
      active: true,

      ...(q && q !== "%undefined%" && q !== "%%"
        ? {
            title: {
              contains: q,
              mode: "insensitive",
            },
          }
        : {}),

      // Combine employmentType and jobType filters in AND
      ...(employmentTypeArray.length > 0 || jobTypeArray.length > 0
        ? {
            AND: [
              ...(employmentTypeArray.length > 0
                ? [
                    {
                      employementType: {
                        in: employmentTypeArray,
                      },
                    },
                  ]
                : []),
              ...(jobTypeArray.length > 0
                ? [
                    {
                      jobType: {
                        in: jobTypeArray,
                      },
                    },
                  ]
                : []),
            ],
          }
        : {}),

      ...(salary_gte || salary_lte
        ? {
            OR: [
              {
                OR: [
                  {
                    salaryType: "HOURLY",
                    AND: [
                      {
                        minSalary: {
                          gte: payLower / 2080,
                        },
                      },
                      {
                        maxSalary: {
                          lte: payUpper / 2080,
                        },
                      },
                    ],
                  },
                  {
                    salaryType: {
                      not: "HOURLY",
                    },
                    AND: [
                      {
                        minSalary: {
                          gte: payLower,
                        },
                      },
                      {
                        maxSalary: {
                          lte: payUpper,
                        },
                      },
                    ],
                  },
                ],
              },
              {
                // Include jobs where salary is not specified
                minSalary: null,
                maxSalary: null,
              },
            ],
          }
        : {}),

      ...(location
        ? {
            OR: [
              { location: { contains: city, mode: "insensitive" } },
              { location: { contains: state, mode: "insensitive" } },
              { location: { contains: country, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
