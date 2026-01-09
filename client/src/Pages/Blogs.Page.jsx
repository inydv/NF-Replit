import { Children, useContext, useEffect, useState } from "react";
import SEO from "../Components/SEO.Component";
import { Link, useLocation } from "react-router-dom";
import BlogsService from "../Services/Blogs.Service";
import RoutesConstant from "../Constants/Routes.Constant.json";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { CalendarDays, Clock } from "lucide-react";
import { generatePageTitle, generateCanonicalUrl, generateKeywords } from "../Utils/SEOHelpers.Util";

export default function Blogs() {
  // SEO Configuration using SEOHelpers
  const pageData = {
    title: generatePageTitle("Nursing Career Blogs & Healthcare Industry News"),
    description: "Stay informed with the latest nursing career advice, healthcare trends, and industry news on the NursingFront blog. Empower your nursing career with expert tips, growth strategies, and inspiring stories.",
    keywords: generateKeywords(
      ["nursing blogs", "nursing career growth", "healthcare job search", "nursing career advice"],
      ["healthcare trends", "nurse job platform", "supportive workplace for nurses", "nursing work values"]
    ),
    url: generateCanonicalUrl("/blogs"),
    imageUrl: "https://nursingfront.com/src/Assets/Logo.svg"
  };

  document.title = pageData.title;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Blogs",
    url: "https://blog.nursingfront.com/",
    publisher: {
      "@type": "Organization",
      name: "NursingFront",
      url: "https://nursingfront.com",
    },
  };

  const generateBreadcrumbs = () => {
    const location = useLocation(); // Get the current URL location
    const pathSegments = location.pathname
      .split("/")
      .filter((segment) => segment !== ""); // Split the path into segments
    const breadcrumbs = []; // Initialize an empty array to store breadcrumb objects

    breadcrumbs.push({ path: "/", label: "Home" }); // Add the "Home" breadcrumb

    if (location.pathname === RoutesConstant.BLOGS) {
      // Check if the current path is the main blogs page
      breadcrumbs.push({ path: RoutesConstant.BLOGS, label: "Blogs" }); // Add the "Blogs" breadcrumb
    } else {
      // Handle paths for individual blog posts or other nested routes
      pathSegments.forEach((segment, index) => {
        // Iterate over the path segments
        const currentPath = `/${pathSegments.slice(0, index + 3).join("/")}`; // Construct the current path

        let label = segment; // Initialize the label with the current segment

        if (currentPath.startsWith(`${RoutesConstant.BLOGS}/`)) {
          // Check if it's a blog post path
          label = segment
            .replace(
              new RegExp(`^${RoutesConstant.BLOGS.replace(/\//g, "\\/")}\/`),
              ""
            )
            .replace(/-/g, " "); // Extract and format the blog post title
          label = label.charAt(0).toUpperCase() + label.slice(1); // Capitalize the label
        } else if (currentPath === RoutesConstant.BLOGS) {
          // Check if it's the main blogs path (again, for clarity)
          label = "Blogs"; // Set the label to "Blogs"
        }

        breadcrumbs.push({
          // Add the breadcrumb object to the array
          path: currentPath, // The URL path for the breadcrumb
          label: label, // The display label for the breadcrumb
        });
      });
    }

    return breadcrumbs; // Return the array of breadcrumb objects
  };

  const breadcrumbs = generateBreadcrumbs();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.label,
      item: window.location.origin + breadcrumb.path,
    })),
  };

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    getBlogs();
  }, []);

  const getBlogs = async () => {
    const { data } = await BlogsService.LIST_BLOGS();
    if (data && data?.SUCCESS) {
      setBlogs(data?.DATA);
    }
  };

  const formatDate = (date) => {
    const inputDate = new Date(date);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return inputDate.toLocaleDateString("en-US", options);
  };

  const calculateReadingTime = (text) => {
    if (!text) return "0 min read";
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return `${Math.ceil(wordCount / wordsPerMinute)} min read`;
  };

  return (
    <div className="min-h-screen bg-gray-50 top-0">
      <SEO
        title={pageData.title}
        description={pageData.description}
        keywords={pageData.keywords}
        structuredData={structuredData}
        url={pageData.url}
        pageType="website"
        imageUrl={pageData.imageUrl}
        breadcrumbs={breadcrumbJsonLd}
      />

      {/* Hero Section with gradient background */}
      <main>
        <header className="bg-gradient-to-r from-indigo-600 to-blue-500 py-20 text-white">
          <div className="max-w-3xl mx-auto text-center px-6">
            <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
              NursingFront Blogs
            </h1>
            <p className="text-xl text-indigo-100 leading-relaxed max-w-2xl mx-auto">
              Explore expert tips, career growth strategies, and inspiring
              stories designed to empower and guide you in your nursing journey.
            </p>
          </div>
        </header>

        {/* Blogs Grid Section */}
        <section className="max-w-7xl mx-auto py-16 px-6">
          {blogs?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Children.toArray(
                blogs?.map((item) => (
                  <Link
                    to={`${RoutesConstant.BLOGS}/${item.slug}`}
                    state={{ id: item?.id }}
                    className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    <div className="relative">
                      <LazyLoadImage
                        src={item?.image?.url}
                        alt={item?.title || "Blog Image"}
                        className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{calculateReadingTime(item?.content)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarDays size={16} />
                          <span>{formatDate(item?.createdAt)}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 mb-3">
                        {item?.title}
                      </h3>

                      <p className="text-gray-600 line-clamp-3 leading-relaxed mb-4">
                        {item?.description}
                      </p>

                      <span className="text-indigo-600 font-medium group-hover:text-indigo-700 transition-colors duration-300 mt-auto">
                        Read more →
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">
                No blogs available at the moment.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
