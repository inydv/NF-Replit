import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogsService from "../Services/Blogs.Service";
import Images from "../Assets/index";
import DOMPurify from "dompurify";
import { Calendar, Clock } from "lucide-react";
import { ResponsiveImage } from "../Components/index";
import SEO from "../Components/SEO.Component";
import {
  generatePageTitle,
  generateCanonicalUrl,
  truncateDescription,
} from "../Utils/SEOHelpers.Util";

const NurseImage = Images["homeBanner4"];

const calculateReadingTime = (content) => {
  if (!content || !content.blocks) return "0 min read";

  const wordsPerMinute = 200;
  const text = content.blocks
    .map((block) => {
      switch (block.type) {
        case "header":
        case "paragraph":
        case "quote":
          return block.data.text || "";
        case "list":
          return (
            block.data.items?.map((item) => item.content || "").join(" ") || ""
          );
        default:
          return "";
      }
    })
    .join(" ");

  const wordCount = text.trim().split(/\s+/).length;
  return `${Math.ceil(wordCount / wordsPerMinute)} min read`;
};

export default function SingleBlog() {
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const navigate = useNavigate();
  const { slug } = useParams();
  const [seoData, setSeoData] = useState(null); // State for SEO data

  useEffect(() => {
    if (slug) getBlog(slug);
    else console.error("Blog slug is missing. Cannot fetch blog details.");
  }, [slug]);

  useEffect(() => {
    if (blog?.title) {
      document.title = `${blog.title} | NursingFront`;
    }
  }, [blog?.title]);

  useEffect(() => {
    if (blog) {
      // Set the SEO data once the blog data is available using SEOHelpers
      setSeoData({
        title: generatePageTitle(blog.title),
        description: truncateDescription(
          blog.description || `Read more about ${blog.title}`,
          160
        ),
        url: generateCanonicalUrl(`/blogs/${slug}`),
        type: "article",
        imageUrl: blog.image?.url || NurseImage,
        datePublished: blog.createdAt,
        articleBody: blog.content,
      });
    }
  }, [blog, slug]); // Update when blog or slug changes

  const getBlog = async (slug) => {
    const { data } = await BlogsService.GET_BLOG({ blogSlug: slug });
    if (data?.SUCCESS) {
      setBlog(data?.DATA);
      setRelatedBlogs(data?.RELATED_BLOGS || []);
    }
  };

  const renderContent = (content) => {
    if (!content) return <p>No content available.</p>;

    try {
      const parsedContent = JSON.parse(content);

      return parsedContent.blocks.map((block, index) => {
        switch (block.type) {
          case "header":
            return (
              <h1
                key={index}
                className="text-3xl font-bold mt-6 border-b border-dotted border-gray-400 pb-2 text-indigo-800"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(block.data.text),
                }}
              />
            );
          case "paragraph":
            return (
              <p
                key={index}
                className="text-lg leading-relaxed text-gray-700 mt-4 [&_a]:text-blue-700 [&_a]:hover:underline"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(block.data.text),
                }}
              />
            );
          case "list":
            const listType =
              block.data.style === "ordered" ? "list-decimal" : "list-disc";
            const ListElement = block.data.style === "ordered" ? "ol" : "ul";

            // If there's a startAt property and this is an ordered list, use it
            const startAttr =
              block.data.style === "ordered" && block.data.startAt
                ? { start: block.data.startAt }
                : {};

            return (
              <ListElement
                key={index}
                className={`list-inside ${listType} mt-4 ml-6 space-y-2 text-gray-700`}
                {...startAttr}
              >
                {block.data.items.map((item, i) => (
                  <li
                    key={i}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(item.content),
                    }}
                  />
                ))}
              </ListElement>
            );
          case "image":
            return (
              <div key={index} className="mt-8 mb-8">
                <div className="max-w-4xl mx-auto px-4">
                  <ResponsiveImage
                    src={block.data?.file?.url?.replace("http://", "https://")}
                    alt={block.data.caption || "Blog Image"}
                  />
                  {block.data.caption && (
                    <p className="mt-3 text-center text-sm text-gray-600 italic">
                      {block.data.caption}
                    </p>
                  )}
                </div>
              </div>
            );
          case "quote":
            return (
              <blockquote
                key={index}
                className="italic border-l-4 pl-4 border-indigo-500 mt-6 text-gray-600"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(block.data.text),
                }}
              />
            );
          default:
            return null;
        }
      });
    } catch (err) {
      console.error("Failed to parse content:", err);
      return <p>Error rendering content.</p>;
    }
  };

  const readingTime = calculateReadingTime(
    blog?.content ? JSON.parse(blog.content) : null
  );

  return (
    <>
      {seoData && ( // Only render SEO component if seoData is available
        <SEO
          title={seoData.title}
          description={seoData.description}
          // ... other SEO props
          url={seoData.url}
          type={seoData.type}
          imageUrl={seoData.imageUrl}
          datePublished={seoData.datePublished}
          articleBody={blog?.content} // Pass the blog content for potential schema use
        />
      )}
      <div className="bg-gray-50 min-h-screen font-serif">
        <div className="bg-white shadow-md">
          {/* Blog Header */}
          <header className="max-w-4xl mx-auto px-6 pt-12 pb-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-800 mb-6">
              {blog?.title || "Title not available"}
            </h1>
            <p className="text-base text-gray-600 mb-4">
              {blog?.description || "No description available"}
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <p>{readingTime}</p>
                </div>
                <span>&bull;</span>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <p>
                    {new Date(blog?.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline">&bull;</span>

              {/* Back to Blogs Button */}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center bg-indigo-100 text-indigo-700 font-medium py-2 px-4 rounded-md shadow hover:bg-indigo-200 transition-colors mt-4 sm:mt-0"
              >
                Back to Blogs
              </button>
            </div>
            <div className="relative shadow-lg overflow-hidden">
              <ResponsiveImage
                src={
                  blog?.image?.url?.replace("http://", "https://") || NurseImage
                }
                alt={blog?.title || "Blog Image"}
                className="w-full h-[500px]"
                priority={true}
              />
            </div>
          </header>

          {/* Blog Content */}
          <main className="max-w-4xl mx-auto px-6 py-8">
            <article className="prose prose-lg prose-indigo">
              {renderContent(blog?.content)}
            </article>
          </main>
        </div>
      </div>
    </>
  );
}
