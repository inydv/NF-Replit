// SEO Helper Functions with Error Handling and Improvements

export const generateImageAlt = (imageName, context = "") => {
  if (!imageName || typeof imageName !== "string") {
    return "";
  }

  const baseAlt = imageName
    .replace(/\.(jpg|jpeg|png|webp|gif)$/i, "")
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return context ? `${baseAlt} - ${context}` : baseAlt;
};

export const generatePageTitle = (title, siteName = "NursingFront") => {
  if (!title || typeof title !== "string") {
    return siteName;
  }
  return title.includes(siteName) ? title : `${title} | ${siteName}`;
};

export const truncateDescription = (description, maxLength = 160) => {
  if (!description || typeof description !== "string") {
    return "";
  }
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 3).trim() + "...";
};

export const generateCanonicalUrl = (path) => {
  if (!path || typeof path !== "string") {
    return "https://nursingfront.com/";
  }

  const baseUrl = "https://nursingfront.com";
  const cleanPath = path.trim();
  return `${baseUrl}${cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`}`;
};

export const generateKeywords = (
  baseKeywords = [],
  pageSpecificKeywords = []
) => {
  const defaultKeywords = [
    "nursing jobs",
    "healthcare careers",
    "nurse employment",
    "nursing opportunities",
    "healthcare jobs",
    "registered nurse jobs",
    "RN positions",
    "travel nursing",
    "nurse practitioner jobs",
    "LPN jobs",
    "CNA positions",
    "nursing staffing",
    "hospital jobs",
    "medical careers",
    "healthcare staffing",
    "nursing recruitment",
    "per diem nursing",
    "nursing salary",
    "nurse job search",
    "healthcare professionals",
    "nursing career opportunities",
    "medical jobs",
    "ICU nursing jobs",
    "emergency nursing",
    "pediatric nursing",
    "surgical nursing",
    "nursing benefits",
    "nurse hiring",
    "healthcare employment",
    "nursing positions near me",
  ];

  // Validate inputs
  const validBaseKeywords = Array.isArray(baseKeywords) ? baseKeywords : [];
  const validPageKeywords = Array.isArray(pageSpecificKeywords)
    ? pageSpecificKeywords
    : [];

  // Combine and deduplicate more efficiently
  const allKeywords = [
    ...validBaseKeywords,
    ...validPageKeywords,
    ...defaultKeywords,
  ];
  const uniqueKeywords = [...new Set(allKeywords)];

  return uniqueKeywords.join(", ");
};

export const generateMetaDescription = (content, maxLength = 160) => {
  if (!content || typeof content !== "string") {
    return "";
  }

  // Remove HTML tags and clean up content
  const cleanContent = content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return truncateDescription(cleanContent, maxLength);
};

export const generateOpenGraphData = (
  title,
  description,
  imageUrl,
  url,
  type = "website"
) => {
  return {
    title: title || "",
    description: truncateDescription(description || "", 160),
    type,
    url: url || "",
    image: imageUrl || "",
    siteName: "NursingFront",
    locale: "en_US",
  };
};

export const generateTwitterCardData = (title, description, imageUrl, url) => {
  return {
    card: "summary_large_image",
    title: truncateDescription(title || "", 70),
    description: truncateDescription(description || "", 160),
    image: imageUrl || "",
    url: url || "",
    site: "@nursingfront",
  };
};

export const generateBreadcrumbSchema = (breadcrumbs) => {
  if (!Array.isArray(breadcrumbs) || breadcrumbs.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs
      .filter((breadcrumb) => breadcrumb && breadcrumb.label && breadcrumb.path)
      .map((breadcrumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: breadcrumb.label,
        item: `https://nursingfront.com${
          breadcrumb.path.startsWith("/")
            ? breadcrumb.path
            : `/${breadcrumb.path}`
        }`,
      })),
  };
};
