import React, { useRef, useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import OrganizationSchema from "../Components/OrganizationSchema.Component";
import WebsiteSchema from "../Components/WebsiteSchema.Component";
import SitelinksSearchbox from "../Components/SitelinksSearchbox.Component";
import NavigationStructuredData from "../Components/NavigationStructuredData.Component";

const MainLayout = ({ children }) => {
  const headerRef = useRef(null);
  const navRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current && headerRef.current) {
        const headerBottom = headerRef.current.getBoundingClientRect().bottom;
        setIsSticky(headerBottom <= 0);
      }

      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <header
        ref={headerRef}
        className={`bg-white w-full transition-all duration-300 ${
          isSticky ? "shadow-lg py-2" : "py-3 border-b border-gray-100"
        }`}
      >
        {/* Header content */}
      </header>

      <nav
        ref={navRef}
        className={`bg-white w-full z-50 transition-all duration-300 ${
          isSticky ? "fixed top-0 shadow-lg py-2" : "relative py-3"
        }`}
      >
        {/* Navigation content */}
      </nav>
      <OrganizationSchema />
      <WebsiteSchema />
      <SitelinksSearchbox />
      <NavigationStructuredData />

      <main className="w-full">
        {/* Main content will be injected here */}
        {children}
      </main>

      {showScrollTop && (
        <button
          className="fixed bottom-6 right-6 bg-teal-600 p-3 rounded-full shadow-lg text-white"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
};

export default MainLayout;