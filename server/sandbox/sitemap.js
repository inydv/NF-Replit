const path = require("path");
const axios = require("axios");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createWriteStream, existsSync, mkdirSync } = require("fs");

// Configuration
const hostname = "https://nursingfront.com";
const apiEndpoints = {
  jobs: "https://www.backend.nursingfront.com/api/v1/job",
  companies: "https://www.backend.nursingfront.com/api/v1/company",
};
const outputDir = path.join(process.cwd(), "public");
const sitemapPath = path.join(outputDir, "sitemap.xml");

// Ensure the output directory exists
function ensureDirectoryExists(directory) {
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
    console.log(`Created directory: ${directory}`);
  }
}

// Fetch dynamic routes from the backend
async function fetchDynamicRoutes() {
  try {
    const [jobResponse, companyResponse] = await Promise.all([
      axios.get(apiEndpoints.jobs),
      axios.get(apiEndpoints.companies),
    ]);

    const jobs = jobResponse?.data?.DATA || [];
    const companies = companyResponse?.data?.DATA || [];

    return [...jobs, ...companies].map((item) => ({
      loc: `${hostname}/jobs/${item.id}`,
      lastmod: new Date(item.created_at).toISOString().split("T")[0],
      changefreq: "weekly",
      priority: 0.9,
    }));
  } catch (error) {
    console.error("Error fetching dynamic routes:", error.message);
    return [];
  }
}

// Generate the sitemap
async function generateSitemap() {
  ensureDirectoryExists(outputDir);

  const sitemap = new SitemapStream({ hostname });
  const writeStream = createWriteStream(sitemapPath);

  sitemap.pipe(writeStream);

  try {
    // Add static URLs
    const staticUrls = getStaticUrls();
    staticUrls.forEach((url) => {
      sitemap.write({
        url: url.loc,
        lastmod: getCurrentDate(),
        changefreq: url.changefreq,
        priority: url.priority,
      });
    });

    // Add dynamic URLs
    const dynamicUrls = await fetchDynamicRoutes();
    dynamicUrls.forEach((url) => {
      sitemap.write({
        url: url.loc,
        lastmod: url.lastmod,
        changefreq: url.changefreq,
        priority: url.priority,
      });
    });

    sitemap.end();
    await streamToPromise(sitemap);
    console.log("Sitemap generated successfully at:", sitemapPath);
  } catch (error) {
    console.error("Error generating sitemap:", error.message);
  }
}

// Get static URLs
function getStaticUrls() {
  return [
    { loc: `${hostname}/`, changefreq: "monthly", priority: 1.0 },
    { loc: `${hostname}/hr`, changefreq: "monthly", priority: 1.0 },
    { loc: `${hostname}/companies`, changefreq: "daily", priority: 1.0 },
    { loc: `${hostname}/jobs`, changefreq: "daily", priority: 1.0 },
    { loc: `${hostname}/aboutus`, changefreq: "monthly", priority: 0.8 },
    { loc: `${hostname}/privacy`, changefreq: "monthly", priority: 0.8 },
    { loc: `${hostname}/resources`, changefreq: "monthly", priority: 0.8 },
    {
      loc: `${hostname}/terms-and-condition`,
      changefreq: "monthly",
      priority: 0.8,
    },
    { loc: `${hostname}/pricing`, changefreq: "monthly", priority: 0.8 },
    { loc: `${hostname}/create-company`, changefreq: "monthly", priority: 0.8 },
    { loc: `${hostname}/manage-company`, changefreq: "monthly", priority: 0.8 },
    { loc: `${hostname}/postjob`, changefreq: "monthly", priority: 0.8 },
    {
      loc: `${hostname}/proceed-payment`,
      changefreq: "monthly",
      priority: 0.8,
    },
    { loc: `${hostname}/manage-job`, changefreq: "monthly", priority: 0.8 },
    {
      loc: `${hostname}/confirmSubscription`,
      changefreq: "monthly",
      priority: 0.8,
    },
    { loc: `${hostname}/work-values`, changefreq: "monthly", priority: 0.8 },
    {
      loc: `https://blog.nursingfront.com/`,
      changefreq: "monthly",
      priority: 0.8,
    },
  ];
}

// Get the current date in YYYY-MM-DD format
function getCurrentDate() {
  return new Date().toISOString().split("T")[0];
}

// Start the sitemap generation process
generateSitemap().catch((error) => {
  console.error("Unhandled error:", error.message);
});
