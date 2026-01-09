// Helper function to generate user profile completion
module.exports = (user, next) => {
  try {
    let isProfileComplete = false;
    let isCreatedCompany = false;

    if (!user || !user.role)
      return {
        isProfileComplete: false,
        isCreatedCompany: false,
        message: "User or role not found",
      };

    if (user.role === "JOB_SEEKER") {
      const details = {
        education: Array.isArray(user.education) && user.education.length > 0,
        experience:
          Array.isArray(user.experience) && user.experience.length > 0,
        location: !!user.location,
        skills: Array.isArray(user.skills) && user.skills.length > 0,
        certification:
          Array.isArray(user.certification) && user.certification.length > 0,
      };
      isProfileComplete = Object.values(details).every(Boolean);
      isCreatedCompany = true;
    } else if (user.role === "RECRUITER") {
      const details = {
        companies: Array.isArray(user.companies) && user.companies.length > 0,
        location: !!user.location,
      };
      isProfileComplete = Object.values(details).every(Boolean);
      isCreatedCompany = details.companies;
    } else {
      return {
        isProfileComplete: false,
        isCreatedCompany: false,
        message: "Role not supported for profile completion",
      };
    }

    return { isProfileComplete, isCreatedCompany };
  } catch (err) {
    next(new errorHandler("Database error", 500));
    return null;
  }
};
