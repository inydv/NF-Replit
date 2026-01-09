import { Helmet } from "react-helmet-async";

const NavigationStructuredData = () => {
  const baseUrl = "https://nursingfront.com";

  const navigationData = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: "Main Navigation",
    description:
      "Primary navigation for NursingFront - connecting nurses with healthcare opportunities",
    hasPart: [
      {
        "@type": "SiteNavigationElement",
        name: "Nursing Jobs",
        description: "Browse nursing job opportunities",
        url: `${baseUrl}/jobs`,
        position: 1,
        hasPart: [
          {
            "@type": "SiteNavigationElement",
            name: "Remote Nursing Jobs",
            url: `${baseUrl}/jobs?type=remote`,
            position: 1,
          },
          {
            "@type": "SiteNavigationElement",
            name: "Travel Nursing Jobs",
            url: `${baseUrl}/jobs?type=travel`,
            position: 2,
          },
          {
            "@type": "SiteNavigationElement",
            name: "ICU Nursing Jobs",
            url: `${baseUrl}/jobs?specialty=icu`,
            position: 3,
          },
        ],
      },
      {
        "@type": "SiteNavigationElement",
        name: "Post a Job",
        description: "Employers: Post nursing job opportunities",
        url: `${baseUrl}/post-job`,
        position: 2,
      },
      {
        "@type": "SiteNavigationElement",
        name: "About NursingFront",
        description:
          "Learn about our mission to connect nurses with opportunities",
        url: `${baseUrl}/about`,
        position: 3,
      },
      {
        "@type": "SiteNavigationElement",
        name: "Nursing Resources",
        description:
          "Educational content and resources for nursing professionals",
        url: `${baseUrl}/blogs`,
        position: 4,
      },
      {
        "@type": "SiteNavigationElement",
        name: "Our Values",
        description: "The values that guide our work in healthcare recruitment",
        url: `${baseUrl}/work-values`,
        position: 5,
      },
      {
        "@type": "SiteNavigationElement",
        name: "Contact Us",
        description: "Get in touch with the NursingFront team",
        url: `${baseUrl}/contact`,
        position: 6,
      },
      {
        "@type": "SiteNavigationElement",
        name: "Join NursingFront",
        description: "Create your account to access nursing opportunities",
        url: `${baseUrl}/sign-up`,
        position: 7,
      },
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(navigationData)}
      </script>
    </Helmet>
  );
};

export default NavigationStructuredData;
