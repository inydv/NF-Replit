import { Helmet } from "react-helmet-async";
import RoutesConstant from "../Constants/Routes.Constant.json";
import { useLocation } from "react-router-dom";

const SEO = ({
  title,
  description,
  keywords,
  structuredData,
  imageUrl,
  url,
  pageType,
}) => {
  const currentUrl = url || window.location.href;
  const location = useLocation();

  // Dynamically generate schema data based on pageType
  const generateSchemaData = () => {
    switch (pageType) {
      case "article":
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description: description,
          author: {
            "@type": "Organization",
            name: "NursingFront"
          },
          publisher: {
            "@type": "Organization",
            name: "NursingFront",
            logo: {
              "@type": "ImageObject",
              url: "https://nursingfront.com/android-chrome-512x512.png",
              width: 512,
              height: 512
            }
          },
          datePublished: new Date().toISOString(),
          dateModified: new Date().toISOString()
        };
      case "jobPosting":
        return {
          "@context": "https://schema.org",
          "@type": "JobPosting",
          title: title,
          description: description,
          hiringOrganization: {
            "@type": "Organization",
            name: "NursingFront"
          },
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              addressCountry: "US"
            }
          },
          employmentType: "FULL_TIME",
          industry: "Healthcare"
        };
      case "faq":
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: structuredData?.questions || []
        };
      case "product":
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          name: title,
          description: description,
          brand: {
            "@type": "Organization",
            name: "NursingFront"
          }
        };
      default:
        return structuredData;
    }
  };

  const schemaData = generateSchemaData();

  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname
      .split("/")
      .filter((segment) => segment !== "");
    const breadcrumbs = [];

    breadcrumbs.push({ path: "/", label: "Home" });

    if (
      location.pathname === RoutesConstant.BLOGS ||
      location.pathname === RoutesConstant.ABOUT ||
      location.pathname === RoutesConstant.HOME
    ) {
      //check if it is one of the main pages
      breadcrumbs.push({
        path: location.pathname,
        label:
          location.pathname === RoutesConstant.BLOGS
            ? "Blogs"
            : location.pathname === RoutesConstant.ABOUT
            ? "About"
            : "Home",
      });
    } else {
      pathSegments.forEach((segment, index) => {
        const currentPath = `/${pathSegments.slice(0, index + 1).join("/")}`;
        let label = segment;

        if (currentPath.startsWith(`${RoutesConstant.BLOGS}/`)) {
          label = segment
            .replace(
              new RegExp(`^${RoutesConstant.BLOGS.replace(/\//g, "\\/")}\/`),
              ""
            )
            .replace(/-/g, " ");
          label = label.charAt(0).toUpperCase() + label.slice(1);
        } else if (currentPath === RoutesConstant.BLOGS) {
          label = "Blogs";
        } else if (currentPath === RoutesConstant.ABOUT) {
          label = "About";
        }

        breadcrumbs.push({
          path: currentPath,
          label: label,
        });
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const breadcrumbJsonLd = breadcrumbs && {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.label,
      item: window.location.origin + breadcrumb.path,
    })),
  };

  return (
    <Helmet>
        {/* Title */}
        <title>{title}</title>

        {/* Meta Tags */}
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:none, max-video-preview:-1" />
        <meta name="author" content="NursingFront" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />

        {/* Canonical Link */}
        <link rel="canonical" href={currentUrl} />

        {/* Open Graph / Facebook Meta Tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={pageType || "website"} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:site_name" content="NursingFront" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        <meta name="twitter:url" content={currentUrl} />
        <meta name="twitter:image:alt" content="NursingFront logo" />
        <meta name="twitter:site" content="@nursingfront" />

        {/* LinkedIn Meta Tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:alt" content="NursingFront logo" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:site_name" content="NursingFront" />
        <meta property="og:type" content="website" />

        {/* Structured Data (JSON-LD) */}
        {schemaData && ( // Use schemaData here
          <script type="application/ld+json">
            {JSON.stringify(schemaData)}
          </script>
        )}

        {/* Breadcrumb structured data */}
        {breadcrumbJsonLd && ( // Conditionally render breadcrumbs JSON-LD
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbJsonLd)}
          </script>
        )}
      </Helmet>
  );
};

export default SEO;
