
import { Helmet } from "react-helmet-async";

const SitelinksSearchbox = () => {
  const searchboxData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://nursingfront.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://nursingfront.com/jobs?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(searchboxData)}
      </script>
    </Helmet>
  );
};

export default SitelinksSearchbox;
