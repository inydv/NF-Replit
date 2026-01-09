import React from "react";
import SEO from "../Components/SEO.Component";
import WebsiteSchema from "../Components/WebsiteSchema.Component";
import { generatePageTitle, generateCanonicalUrl } from "../Utils/SEOHelpers.Util";

const HomePage = () => {
  const pageData = {
    title: generatePageTitle("Find Your Perfect Nursing Job"),
    description: "Discover nursing jobs that align with your values and career goals. Connect with supportive healthcare employers who prioritize nurse well-being and professional growth.",
    keywords: "nursing jobs, healthcare careers, nurse employment, supportive workplace, nursing opportunities, healthcare jobs, nurse careers, medical jobs",
    url: generateCanonicalUrl("/"),
    imageUrl: "https://nursingfront.com/src/Assets/homeBanner1.webp"
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "NursingFront - Find Your Perfect Nursing Job",
    url: "https://nursingfront.com",
    description: pageData.description,
    publisher: {
      "@type": "Organization",
      name: "NursingFront",
      url: "https://nursingfront.com",
      logo: {
        "@type": "ImageObject",
        url: "https://nursingfront.com/src/Assets/Logo.svg"
      }
    },
    mainEntity: {
      "@type": "WebSite",
      url: "https://nursingfront.com",
      name: "NursingFront",
      alternateName: "Nursing Front",
      description: "Connect nurses with supportive workplaces and find nursing jobs that prioritize your well-being and career growth."
    }
  };

  return (
    <>
      <SEO
        title={pageData.title}
        description={pageData.description}
        keywords={pageData.keywords}
        structuredData={structuredData}
        url={pageData.url}
        pageType="website"
        imageUrl={pageData.imageUrl}
      />
      <WebsiteSchema />

      {/* Your existing home page content goes here */}
      <div className="home-page">
        {/* Add your home page components */}
      </div>
    </>
  );
};

export default HomePage;