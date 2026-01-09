import React from "react";
import SEO from "../Components/SEO.Component";
import Images from "../Assets/index";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";
import RoutesConstant from "../Constants/Routes.Constant.json";
import { useLocation } from "react-router-dom";
import { generatePageTitle, generateCanonicalUrl, generateKeywords } from "../Utils/SEOHelpers.Util";

// Social Media Data

const SOCIAL_MEDIA = {
  francis: [
    {
      href: "https://x.com/nduatifm",
      event_desc: "Link to Twitter",
      icon: <FaXTwitter size={24} />,
    },
    {
      href: "https://linkedin.com/in/francisnduati",
      event_desc: "Link to LinkedIn",
      icon: <FaLinkedinIn size={24} />,
    },
  ],
  nichole: [
    {
      href: "https://www.linkedin.com/in/nichole-nduati-ab521b99/",
      event_desc: "Link to LinkedIn",
      icon: <FaLinkedinIn size={24} />,
    },
  ],
};

// Reusable Co-Founder Card
const CoFounderCard = ({
  imageSrc,
  name,
  role,
  paragraph1,
  paragraph2,
  paragraph3,
  socialLinks,
}) => (
  <div className="flex flex-col md:flex-row items-start gap-8 border-t bg-[#F1F0FA] p-8 rounded-lg shadow-md">
    {/* Image */}
    <div className="w-full md:w-[30%]">
      <img
        src={imageSrc}
        alt={name}
        className="w-full h-auto object-cover rounded-lg shadow-md"
      />
    </div>
    {/* Content */}
    <div className="w-full md:w-[70%]">
      <h3 className="font-bold text-xl sm:text-2xl text-gray-900">{name}</h3>
      <p className="text-sm sm:text-base text-gray-600 font-semibold mb-4">
        {role}
      </p>
      <p className="text-gray-700 leading-7 text-base sm:text-lg">
        {paragraph1}
      </p>
      {paragraph2 && (
        <p className="text-gray-700 leading-7 text-base sm:text-lg mt-4">
          {paragraph2}
        </p>
      )}
      {paragraph3 && (
        <p className="text-gray-700 leading-7 text-base sm:text-lg mt-4">
          {paragraph3}
        </p>
      )}

      {/* Social Media Section */}
      {socialLinks && socialLinks.length > 0 && (
        <div className="mt-6">
          <div className="flex gap-4 mt-3">
            <h3 className="text-lg font-bold text-gray-800">Let's Connect</h3>
            {socialLinks.map(({ href, icon, event_desc }, index) => (
              <a
                key={index}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => console.log(event_desc)}
                className="text-brand-900 hover:text-brand-700 transition-colors"
                aria-label={event_desc}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default function About() {
  // SEO Configuration using SEOHelpers
  const pageData = {
    title: generatePageTitle("About NursingFront - Find Nursing Jobs & Support"),
    description: "Learn about NursingFront's mission to connect nurses with supportive workplaces. Find nursing jobs that prioritize your well-being and career growth. Join our community today!",
    keywords: generateKeywords(
      ["about", "nursing jobs", "career growth", "supportive workplace"],
      ["nursing mission", "healthcare jobs", "job platform for nurses", "nurse well-being"]
    ),
    url: generateCanonicalUrl("/about"),
    imageUrl: "https://res.cloudinary.com/nursingfront/image/upload/v1739509727/About_NursingFront_image.jpg"
  };

  document.title = pageData.title;
  const pageType = "website";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "About NursingFront", // Improved name
    url: "https://nursingfront.com/about",
    publisher: {
      "@type": "Organization",
      name: "NursingFront",
      url: "https://nursingfront.com",
    },
    description: pageData.description, // Added description for schema
  };

  const generateBreadcrumbs = () => {
    const location = useLocation();
    const pathSegments = location.pathname
      .split("/")
      .filter((segment) => segment !== "");
    const breadcrumbs = [];

    breadcrumbs.push({ path: "/", label: "Home" });

    // Check if on the /about page
    if (location.pathname === RoutesConstant.ABOUT) {
      // Use the constant for your about page route
      breadcrumbs.push({ path: RoutesConstant.ABOUT, label: "About" });
    } else {
      // Handle nested paths if you ever have them under /about
      pathSegments.forEach((segment, index) => {
        const currentPath = `/${pathSegments.slice(0, index + 2).join("/")}`;
        let label = segment;

        if (currentPath === RoutesConstant.ABOUT) {
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

  return (
    <>
      <SEO
        title={pageData.title}
        description={pageData.description}
        keywords={pageData.keywords}
        structuredData={structuredData}
        url={pageData.url}
        pageType={pageType}
        imageUrl={pageData.imageUrl}
        breadcrumbs={breadcrumbJsonLd}
      />

      <main className="bg-white sm:px-10 top-0 sm:py-4 mx-auto lg:max-w-7xl my-8 px-2">
        {/* Hero Section */}
        <section className="w-full max-w-[1200px] mx-auto my-16 px-4 flex flex-col md:flex-row gap-12 items-center">
          {/* Content */}
          <div className="w-full md:w-[45%]">
            <h1 className="font-bold text-3xl text-brand-600 mb-6">
              {" "}
              {/* Changed to H1 */}
              About NursingFront
            </h1>
            <p className="text-gray-700 leading-7 text-base sm:text-lg mb-6">
              At NursingFront, we believe exceptional patient care starts with
              supporting and prioritizing the well-being of caregivers.
            </p>
          </div>
          {/* Image */}
          <div className="w-full md:w-[55%]">
            <LazyLoadImage
              src={Images["ThreeHappyNurses"]}
              alt="Three happy and diverse nurses smiling together, representing a supportive workplace." // Improved alt text
              className="w-full h-auto object-cover rounded-xl shadow-lg"
            />
          </div>
        </section>
        {/* About NursingFront */}
        <section className="w-full max-w-[1200px] mx-auto p-8 bg-[#E9F7EF] rounded-lg shadow-md mt-8 mb-8 border-b">
          <h2 className="font-bold text-xl sm:text-2xl text-brand-600 mb-4 text-center">
            Find a Workplace That Supports Your Growth as a Nurse
          </h2>
          <p className="leading-6 text-gray-800">
            The right workplace can transform your nursing career. At
            NursingFront, we help nurses find fulfilling opportunities that
            align with their values and well-being.
          </p>
          <p className="leading-6 text-gray-800 mt-3">
            Burnout and turnover are real challenges in nursing. That’s why we
            focus on connecting you with healthcare organizations that
            prioritize career growth, work-life balance, and a supportive
            environment. Nurses deserve workplaces that value their
            contributions and encourage their professional development.
          </p>
          <p className="leading-6 text-gray-800 mt-3">
            NursingFront is more than just a job board. We’re your career
            partner, providing carefully selected job opportunities and
            resources to help you grow professionally and create a meaningful
            path forward.
          </p>
        </section>
        {/*Our Mission*/}

        <section className="w-full max-w-[1200px] mx-auto p-8 mt-8 mb-8">
          <h2 className="font-bold text-3xl text-brand-600 text-center mb-4">
            Our Mission
          </h2>
          <p className="leading-7 text-gray-800 text-lg text-center">
            Connect nurses with organizations that align with their values,
            helping them find workplaces prioritizing growth and well-being.
          </p>
        </section>

        {/* Founders Section */}
        <section className="w-full max-w-[1200px] mx-auto space-y-16">
          <h2 className="font-bold text-3xl text-brand-600 text-center">
            Meet Our Team
          </h2>
          <CoFounderCard
            imageSrc={Images["Aboutpicture"]}
            name="Francis Nduati"
            role="Co-Founder"
            paragraph1="As a former care provider, I know the struggle of job-hopping to find a workplace that values growth, balance, and support. Navigating the healthcare job market is tough, and many nurses face the same challenge"
            paragraph2="That’s why I created NursingFront,to connect nurses with employers who prioritize their well-being and career growth."
            paragraph3="My goal is to make job searching easier for nurses and help healthcare organizations attract top talent. Let’s build a better future for nursing together"
            socialLinks={SOCIAL_MEDIA.francis}
          />
          <CoFounderCard
            imageSrc={Images["Aboutpicture2"]}
            name="Nichole Nduati"
            role="Co-Founder"
            paragraph1="For 21 years in behavioral health, I worked alongside nurses, nurse practitioners, CNAs, and other healthcare professionals. I saw firsthand the challenges of burnout, high turnover, and the struggle to find workplaces that truly value their dedication and career growth."
            paragraph2="Nursing retention and turnover aren’t just industry buzzwords, they’re real issues that affect both healthcare workers and patient care. A lack of supportive workplaces takes a toll on well-being, making it harder for nurses to stay and thrive in their careers."
            paragraph3="I’m passionate about building connections and helping healthcare professionals find organizations that genuinely prioritize growth, support, and a positive work environment. When nurses thrive, healthcare as a whole improves."
            socialLinks={SOCIAL_MEDIA.nichole}
          />
        </section>
      </main>
    </>
  );
}
