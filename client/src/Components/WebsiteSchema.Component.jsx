
import { Helmet } from "react-helmet-async";

const WebsiteSchema = () => {
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NursingFront",
    description: "Connect nurses with supportive workplaces and find nursing jobs that prioritize your well-being and career growth.",
    url: "https://nursingfront.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://nursingfront.com/jobs?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    publisher: {
      "@type": "Organization",
      name: "NursingFront",
      url: "https://nursingfront.com"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(websiteData)}
      </script>
    </Helmet>
  );
};

export default WebsiteSchema;
