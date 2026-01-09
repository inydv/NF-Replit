import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaLinkedinIn, FaFacebook, FaXTwitter } from "react-icons/fa6";
import { LazyLoadImage } from "react-lazy-load-image-component";
import SubscribedUsersService from "../Services/SubscribedUsers.Service";
import RoutesConstant from "../Constants/Routes.Constant.json";
import Images from "../Assets/index";
import HandleEvent from "../Pipes/HandleEvent.Pipe";
import SEO from "../Components/SEO.Component";
import { alert } from "../Utils/AlertGlobalInterface.Util";
import { generateImageAlt } from "../Utils/SEOHelpers.Util";

// SEO JSON-LD Structured Data
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NursingFront",
  url: "https://nursingfront.com",
  description:
    "NursingFront connects nurses with job opportunities that align with their values, career growth, and work-life balance.",
  potentialAction: [
    {
      "@type": "SearchAction",
      target: "https://nursingfront.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    {
      "@type": "ContactAction",
      target: "https://nursingfront.com/contact",
      "query-input": "required name=contact_reason",
    },
  ],
  hasPart: [
    {
      "@type": "SiteNavigationElement",
      name: "Jobs",
      url: "https://nursingfront.com/",
    },
    {
      "@type": "SiteNavigationElement",
      name: "About NursingFront",
      url: "https://nursingfront.com/about",
    },
    {
      "@type": "SiteNavigationElement",
      name: "Nursing Blogs",
      url: "https://nursingfront.com/blogs",
    },
    {
      "@type": "SiteNavigationElement",
      name: "Contact Us",
      url: "https://nursingfront.com/contact",
    },
    {
      "@type": "SiteNavigationElement",
      name: "Login / Sign Up",
      url: "https://nursingfront.com/sign-up",
    },
  ],
};

const SOCIAL_MEDIA = [
  {
    href: "https://twitter.com/NursingFront",
    event_desc: "Follow us on Twitter",
    icon: (
      <FaXTwitter
        size={24}
        className="text-brand-900 hover:text-brand-600 transition"
      />
    ),
  },
  {
    href: "https://linkedin.com/company/nursingfront",
    event_desc: "Connect with us on LinkedIn",
    icon: (
      <FaLinkedinIn
        size={24}
        className="text-brand-900 hover:text-brand-600 transition"
      />
    ),
  },
  {
    href: "https://www.facebook.com/NursingFront",
    event_desc: "Like us on Facebook",
    icon: (
      <FaFacebook
        size={24}
        className="text-brand-900 hover:text-brand-600 transition"
      />
    ),
  },
];

const MENU_LINKS = [
  { route: RoutesConstant.HOME, name: "Jobs" },
  { route: RoutesConstant.BLOGS, name: "NursingFront Blogs" },
  { route: RoutesConstant.ABOUT, name: "About NursingFront" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = async () => {
    HandleEvent("Button", "Clicked Subscribe Button");
    const { data } = await SubscribedUsersService.POST_SUBSCRIBED_USERS({
      reqBody: {
        email,
      },
    });

    if (data?.SUCCESS) {
      setEmail("");
      alert.success(data?.MESSAGE);
    }
  };
  // Inject JSON-LD Structured Data into <head>
  useEffect(() => {
    const scriptTag = document.createElement("script");
    scriptTag.type = "application/ld+json";
    scriptTag.textContent = JSON.stringify(structuredData);
    document.head.appendChild(scriptTag);

    return () => {
      document.head.removeChild(scriptTag); // Clean up on unmount
    };
  }, []);

  return (
    <>
      {/* SEO Metadata */}
      <SEO structuredData={structuredData} />

      <footer className="bg-[#F1F0FA] w-full text-gray-800 mt-16">
        {/* Footer Container - Ensures Centering */}
        <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-10 text-center md:text-left">
          {/* LOGO + SUBSCRIPTION FORM */}
          <div className="flex flex-col items-center md:items-start">
            <Link to={RoutesConstant.HOME}>
              <div className="flex items-center gap-2">
                <LazyLoadImage
                  src={Images["logoSVG"]}
                  alt={generateImageAlt("logoSVG", "NursingFront footer logo")}
                  className="h-10 w-10"
                />
                <span className="text-xl font-bold text-gray-900">
                  Nursing<span className="text-brand-500">Front</span>
                </span>
              </div>
            </Link>
            <p className="mt-4 text-sm">
              Stay updated with new job opportunities.
            </p>
            <div className="mt-4 flex flex-col w-full max-w-xs">
              <input
                type="email"
                placeholder="Enter Email Address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded-lg px-4 py-2 bg-white outline-none text-sm"
              />
              <button
                onClick={handleSubscribe}
                className="bg-brand-500 hover:bg-brand-600 text-white rounded-lg py-2 mt-2 text-sm"
              >
                Subscribe
              </button>
            </div>
          </div>

          {/* NAVIGATION LINKS */}
          <div className="flex flex-col items-center md:items-start">
            <h5 className="text-lg font-semibold mb-3">Quick Links</h5>
            <div className="space-y-2">
              {MENU_LINKS.map(({ name, route }, index) => (
                <Link
                  key={index}
                  to={route}
                  onClick={() => HandleEvent("Link", `Navigate to ${name}`)}
                  className="block text-sm hover:text-brand-500 transition"
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>

          {/* SOCIAL MEDIA & CONTACT */}
          <div className="flex flex-col items-center md:items-start">
            <h5 className="text-lg font-semibold mb-3">Follow Us</h5>
            <div className="flex gap-4 mt-2">
              {SOCIAL_MEDIA.map(({ href, icon, event_desc }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => HandleEvent("Link", event_desc)}
                  className="hover:scale-110 transition-transform"
                >
                  {icon}
                </a>
              ))}
            </div>
            <Link
              to={RoutesConstant.CONTACT_US}
              className="text-sm text-brand-600 hover:underline mt-4"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* COPYRIGHT & POLICIES */}
        <div className="bg-brand-600 text-white text-center py-4">
          <div className="flex justify-center space-x-4">
            <Link
              to={RoutesConstant.PRIVACY}
              className="text-sm hover:underline"
            >
              Privacy
            </Link>
            <span>|</span>
            <Link
              to={RoutesConstant.TERMS_AND_CONDITION}
              className="text-sm hover:underline"
            >
              Terms
            </Link>
          </div>
          <p className="text-sm mt-2">
            &copy; {new Date().getFullYear()} NursingFront. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}