import { Helmet } from "react-helmet-async";

const JobStructuredData = ({ jobs }) => {
  const generateJobPostingSchema = (job) => {
    const jobPosting = {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: job.title || "Job Title Unavailable", // Use || for simpler default value
      description: job.overview || "Job Description Unavailable", // Sanitize HTML if needed!
      datePosted: job.createdAt || new Date().toISOString().split("T")[0], // ISO 8601 format, fallback to today's date
      employementType: job.employementType || "Full-time", // More robust default
      hiringOrganization: {
        "@type": "Organization",
        name: job.companyName || "Company Name Unavailable",
        // Add more organization details if available (logo, URL, etc.)
        sameAs: job.website || undefined, // Company website preferred, fallback to job link
      },
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          streetAddress: job.streetAddress || undefined, // Make optional
          addressLocality: job.city || "City Unavailable",
          addressRegion: job.location || "State Unavailable",
          postalCode: job.postalCode || undefined, // Make optional
          addressCountry: job.country || "US", // Make country dynamic if possible
        },
      },
      baseSalary:
        job.minSalary && job.maxSalary
          ? {
              "@type": "MonetaryAmount",
              currency: "USD", // Make currency dynamic if possible
              value: {
                "@type": "QuantitativeValue",
                minValue: job.minSalary,
                maxValue: job.maxSalary,
                unitText: job.salaryType || "YEAR", // Make unit dynamic if possible
              },
            }
          : undefined,
    };

    // Add optional properties if available:
    if (job.experience) {
      jobPosting.experienceLevel = job.experience;
    }

    return jobPosting;
  };

  const jobPostings = jobs.map((job) => generateJobPostingSchema(job));

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": jobPostings,
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default JobStructuredData;
