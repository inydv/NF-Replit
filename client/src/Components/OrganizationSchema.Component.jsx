
import { Helmet } from "react-helmet-async";

const OrganizationSchema = () => {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NursingFront",
    description: "Connect nurses with supportive workplaces. Find nursing jobs that prioritize your well-being and career growth.",
    url: "https://nursingfront.com",
    logo: {
      "@type": "ImageObject",
      url: "https://nursingfront.com/android-chrome-512x512.png",
      width: 512,
      height: 512
    },
    sameAs: [
      "https://linkedin.com/company/nursingfront",
      "https://facebook.com/nursingfront",
      "https://twitter.com/nursingfront"
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-XXX-XXX-XXXX",
      contactType: "customer service",
      availableLanguage: "English"
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "US"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationData)}
      </script>
    </Helmet>
  );
};

export default OrganizationSchema;
