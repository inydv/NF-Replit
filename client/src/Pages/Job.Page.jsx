import { Children, useEffect, useState, useContext } from "react";
import { FaSearch, FaLinkedin } from "react-icons/fa";
import { SiIndeed, SiGlassdoor } from "react-icons/si";
import { BiWorld } from "react-icons/bi";
import { useLocation } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  Star,
  MapPin,
  Zap,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

// CUSTOM IMPORTS
import {
  JobPost,
  JobFilter,
  MailNewsLetter,
  Banner,
  JobDetail,
  NursingValuesSection,
} from "../Components/index";
import JobsService from "../Services/Jobs.Service";

import { PopUpModal, EngagementCard } from "../Shared/index";
import SEO from "../Components/SEO.Component";
import Images from "../Assets/index";
import RoutesConstant from "../Constants/Routes.Constant.json";
import {
  generatePageTitle,
  generateCanonicalUrl,
  generateKeywords,
} from "../Utils/SEOHelpers.Util";

// CONSTANTS
const BANNER_IMAGES = [Images["homeBanner4"]];
const FILTER = {
  q: "",
  location: "",
  employementType: [],
  jobType: [],
  salary_gte: 1,
  salary_lte: 1000000,
};

export default function IntegratedJobsPage() {
  // SEO CONFIG using SEOHelpers
  const seoConfig = {
    title: generatePageTitle("Find Nursing Jobs That Align with Your Values"),
    description:
      "Discover the latest nursing job opportunities across the US and build a career that aligns with your values. Connect with supportive healthcare employers. Explore now!",
    keywords: generateKeywords(
      ["nursing jobs", "healthcare jobs", "nurse careers", "job search"],
      [
        "nursing opportunities",
        "healthcare careers",
        "supportive workplace",
        "nurse employment",
      ]
    ),
    type: "website",
    url: generateCanonicalUrl("/"),
    imageUrl:
      "https://res.cloudinary.com/nursingfront/image/upload/v1737208653/BLOGS/mewfa4d4brjtj07qs967.png",
  };

  // STATES
  const [premiumJobs, setPremiumJobs] = useState([]);
  const [extendedJobs, setExtendedJobs] = useState([]);
  const [filter, setFilter] = useState({ ...FILTER });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJobOpen, setIsJobOpen] = useState(false);
  const [jobId, setJobId] = useState(null);

  // Pagination states
  const [premiumCurrentPage, setPremiumCurrentPage] = useState(1);
  const [extendedCurrentPage, setExtendedCurrentPage] = useState(1);
  const jobsPerPage = 100;

  const location = useLocation();

  // USE EFFECTS
  useEffect(() => {
    fetchAllJobs(filter);

    // Show engagement modal after delay
    const timer = setTimeout(() => {
      setIsModalOpen(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // SEO FUNCTIONS
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Jobs Search",
    url: "https://nursingfront.com",
    publisher: {
      "@type": "Organization",
      name: "NursingFront",
      url: "https://nursingfront.com",
    },
  };

  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname
      .split("/")
      .filter((segment) => segment !== "");
    const breadcrumbs = [{ path: "/", label: "Home" }];

    if (location.pathname !== RoutesConstant.HOME) {
      pathSegments.forEach((segment, index) => {
        const currentPath = `/${pathSegments.slice(0, index + 1).join("/")}`;
        let label = segment;

        if (currentPath === RoutesConstant.ABOUT) label = "About";
        else if (currentPath === RoutesConstant.BLOGS) label = "Blogs";

        breadcrumbs.push({ path: currentPath, label });
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const breadcrumbJsonLd = breadcrumbs.length > 1 && {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.label,
      item: window.location.origin + breadcrumb.path,
    })),
  };

  // DATA FETCHING
  const fetchAllJobs = async (filterParams) => {
    await Promise.all([
      getPremiumJobs(filterParams),
      getExtendedJobs(filterParams),
    ]);
  };

  const getPremiumJobs = async (filterParams) => {
    const { data } = await JobsService.LIST_JOBS({ filters: filterParams });
    if (data?.SUCCESS) {
      setPremiumJobs(data.DATA);
    }
  };

  const getExtendedJobs = async (filterParams) => {
    const { data } = await JobsService.LIST_CRAWLED_JOBS({
      filters: filterParams,
    });
    if (data?.SUCCESS) {
      setExtendedJobs(data.DATA);
    }
  };

  // HANDLERS
  const handleFilter = (type, value) => {
    setFilter((prev) => ({ ...prev, [type]: value }));
    // Reset pagination when filters change
    setPremiumCurrentPage(1);
    setExtendedCurrentPage(1);
    // Reset pagination when filters change
    setPremiumCurrentPage(1);
    setExtendedCurrentPage(1);
  };

  const handleClear = () => {
    setFilter({ ...FILTER });
    setPremiumCurrentPage(1);
    setExtendedCurrentPage(1);
    setPremiumCurrentPage(1);
    setExtendedCurrentPage(1);
    fetchAllJobs(FILTER);
  };

  const openJob = (id) => {
    setJobId(id);
    setIsJobOpen(true);
  };

  // PAGINATION HELPERS
  const getPaginatedJobs = (jobs, currentPage) => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    return jobs.slice(startIndex, endIndex);
  };

  const getTotalPages = (totalJobs) => {
    return Math.ceil(totalJobs / jobsPerPage);
  };

  const handlePageChange = (page, type) => {
    if (type === "premium") {
      setPremiumCurrentPage(page);
    } else if (type === "extended") {
      setExtendedCurrentPage(page);
    }
    // Scroll to top of jobs section
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // JOB CATEGORIZATION
  const allUrgentPremiumJobs = premiumJobs.filter(
    (job) => job.isUrgent === true
  );
  const allFeaturedPremiumJobs = premiumJobs.filter(
    (job) => job.isFeatured === true && job.isUrgent !== true
  );
  const allRegularPremiumJobs = premiumJobs.filter(
    (job) => !job.isFeatured && !job.isUrgent
  );

  // PAGINATED JOBS
  const urgentPremiumJobs = getPaginatedJobs(
    allUrgentPremiumJobs,
    premiumCurrentPage
  );
  const featuredPremiumJobs = getPaginatedJobs(
    allFeaturedPremiumJobs,
    premiumCurrentPage
  );
  const regularPremiumJobs = getPaginatedJobs(
    allRegularPremiumJobs,
    premiumCurrentPage
  );
  const paginatedExtendedJobs = getPaginatedJobs(
    extendedJobs,
    extendedCurrentPage
  );

  // STATS
  const totalJobCount = premiumJobs.length + extendedJobs.length;
  const premiumJobCount = premiumJobs.length;
  const extendedJobCount = extendedJobs.length;

  // PAGINATION COMPONENT
  const PaginationComponent = ({
    currentPage,
    totalJobs,
    onPageChange,
    type,
  }) => {
    const totalPages = getTotalPages(totalJobs);

    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, "...");
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push("...", totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="flex justify-center items-center gap-2 mt-6 mb-4">
        <button
          onClick={() => onPageChange(currentPage - 1, type)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() =>
              typeof page === "number" ? onPageChange(page, type) : null
            }
            disabled={page === "..."}
            className={`px-3 py-2 text-sm border rounded-lg ${
              page === currentPage
                ? "bg-teal-600 text-white border-teal-600"
                : page === "..."
                ? "border-transparent cursor-default"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1, type)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>

        <span className="text-sm text-gray-600 ml-4">
          Page {currentPage} of {totalPages} ({totalJobs} jobs)
        </span>
      </div>
    );
  };

  return (
    <>
      <SEO
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        structuredData={structuredData}
        url={seoConfig.url}
        pageType={seoConfig.type}
        imageUrl={seoConfig.imageUrl}
        breadcrumbs={breadcrumbJsonLd}
      />

      <Banner
        BANNER_IMAGES={BANNER_IMAGES}
        heading={"Find Nursing Jobs <br /> That Align with Your Values"}
        paragraph={
          "We connect nurses with workplaces that value growth, balance, and support. Take the next step toward a meaningful career."
        }
        btnText={"Share Your Values"}
        btnHref={RoutesConstant.WORK_VALUES}
      />

      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Search Bar Section */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Find Your Ideal Nursing Position
              </h1>

              <div className="flex flex-col md:flex-row gap-3 mb-5">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search job title, skills, or keywords"
                    className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={filter.q}
                    onChange={(e) => handleFilter("q", e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") fetchAllJobs(filter);
                    }}
                  />
                  <FaSearch className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                </div>

                <div className="relative md:w-36">
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={filter.location}
                    onChange={(e) => handleFilter("location", e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") fetchAllJobs(filter);
                    }}
                  />
                  <MapPin
                    size={16}
                    className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400"
                  />
                </div>

                <button
                  className="p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all flex items-center justify-center gap-2 md:w-24"
                  onClick={() => fetchAllJobs(filter)}
                >
                  <span>Search</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Job Stats */}
              <div className="flex justify-center gap-4 mb-5">
                <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 flex items-center">
                  <span className="text-gray-500 text-sm mr-2">Total:</span>
                  <span className="font-bold text-gray-800 text-lg">
                    {totalJobCount}
                  </span>
                </div>
                <div className="bg-teal-50 px-4 py-2 rounded-lg border border-teal-100 flex items-center">
                  <span className="text-teal-700 text-sm mr-2">Premium:</span>
                  <span className="font-bold text-teal-700 text-lg">
                    {premiumJobCount}
                  </span>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 flex items-center">
                  <span className="text-blue-700 text-sm mr-2">Extended:</span>
                  <span className="font-bold text-blue-700 text-lg">
                    {extendedJobCount}
                  </span>
                </div>
              </div>

              {/* Job Filters */}
              <div className="border-t border-gray-100 pt-4">
                <JobFilter
                  setFilter={setFilter}
                  filter={filter}
                  handleClear={handleClear}
                  getJobs={fetchAllJobs}
                />
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-1">
            {/* Premium Jobs Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-teal-50 to-teal-100 border-b border-teal-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="text-teal-600" size={20} />
                    <h2 className="text-lg font-semibold text-gray-800">
                      Premium Jobs Listing
                    </h2>
                  </div>
                  <span className="bg-white px-3 py-6 rounded-full text-sm font-medium text-teal-600">
                    {premiumJobs.length} jobs{" "}
                    {premiumJobs.length > jobsPerPage &&
                      `(Page ${premiumCurrentPage})`}
                  </span>
                </div>
              </div>

              {premiumJobs.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No premium jobs found matching your criteria.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {/* Urgent Jobs */}
                  {urgentPremiumJobs.length > 0 && (
                    <div className="p-4">
                      <div className="space-y-3">
                        {Children.toArray(
                          urgentPremiumJobs.map((item) => (
                            <div className="bg-white rounded-lg border border-amber-200">
                              <JobPost
                                openJob={openJob}
                                data={item}
                                jobId={jobId}
                              />
                              {jobId === item.id && isJobOpen && (
                                <div className="bg-white border-t border-amber-200 p-4">
                                  <JobDetail data={item} />
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Featured Jobs */}
                  {featuredPremiumJobs.length > 0 && (
                    <div className="p-4">
                      <div className="space-y-3">
                        {Children.toArray(
                          featuredPremiumJobs.map((item) => (
                            <div className="bg-white rounded-lg border border-gray-100 hover:border-teal-200 transition-colors">
                              <JobPost
                                openJob={openJob}
                                data={item}
                                jobId={jobId}
                              />
                              {jobId === item.id && isJobOpen && (
                                <div className="bg-white border-t border-gray-100 p-4">
                                  <JobDetail data={item} />
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Newsletter */}
                  <div className="mt-4">
                    <MailNewsLetter />
                  </div>

                  {/* Regular Premium Jobs */}
                  {regularPremiumJobs.length > 0 && (
                    <div className="p-4">
                      <div className="space-y-3">
                        {Children.toArray(
                          regularPremiumJobs.map((item) => (
                            <div className="bg-white rounded-lg border border-gray-100 hover:border-teal-200 transition-colors">
                              <JobPost
                                openJob={openJob}
                                data={item}
                                jobId={jobId}
                              />
                              {jobId === item.id && isJobOpen && (
                                <div className="bg-white border-t border-gray-100 p-4">
                                  <JobDetail data={item} />
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Premium Jobs Pagination */}
                  <PaginationComponent
                    currentPage={premiumCurrentPage}
                    totalJobs={premiumJobs.length}
                    onPageChange={handlePageChange}
                    type="premium"
                  />
                </div>
              )}
            </div>

            {/* Values Section */}
            <div className="mt-4">
              <NursingValuesSection />
            </div>

            {/* Extended Search Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BiWorld className="text-blue-600" size={20} />
                    <h2 className="text-lg font-semibold text-gray-800">
                      Extended Search Listing
                    </h2>
                  </div>
                  <span className="bg-white px-3 py-6 rounded-full text-sm font-medium text-blue-600">
                    {extendedJobs.length} jobs{" "}
                    {extendedJobs.length > jobsPerPage &&
                      `(Page ${extendedCurrentPage})`}
                  </span>
                </div>
              </div>

              <div className="p-4 border-b border-gray-100">
                <p className="text-gray-600 mb-4">
                  We aggregate nursing positions from multiple trusted sources
                  to give you the most comprehensive job search experience.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-100 hover:border-[#0CAA41] transition-colors">
                    <SiGlassdoor className="text-[#0CAA41] text-2xl" />
                    <div>
                      <p className="font-medium">Glassdoor</p>
                      <p className="text-sm text-gray-500">
                        Company reviews & salaries
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-100 hover:border-[#003A9B] transition-colors">
                    <SiIndeed className="text-[#003A9B] text-2xl" />
                    <div>
                      <p className="font-medium">Indeed</p>
                      <p className="text-sm text-gray-500">
                        Comprehensive job listings
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-100 hover:border-[#0077B5] transition-colors">
                    <FaLinkedin className="text-[#0077B5] text-2xl" />
                    <div>
                      <p className="font-medium">LinkedIn</p>
                      <p className="text-sm text-gray-500">
                        Professional networking
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                {extendedJobs.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No extended jobs found matching your criteria.
                  </div>
                ) : (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
                      <Briefcase size={16} className="text-blue-600" />
                      Available Positions
                    </h3>
                    <div className="space-y-3">
                      {Children.toArray(
                        paginatedExtendedJobs.map((item) => (
                          <div className="bg-white rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                            <JobPost
                              openJob={openJob}
                              data={item}
                              jobId={jobId}
                            />
                            {jobId === item.id && isJobOpen && (
                              <div className="bg-white border-t border-gray-100 p-4">
                                <JobDetail data={item} />
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {/* Extended Jobs Pagination */}
                    <PaginationComponent
                      currentPage={extendedCurrentPage}
                      totalJobs={extendedJobs.length}
                      onPageChange={handlePageChange}
                      type="extended"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <PopUpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <EngagementCard
          title="Let's Create Together"
          mainContent="Join us in building a platform where your skills, dedication, and well-being are not only recognized but celebrated."
          benefits={[
            "Share your unique healthcare perspective",
            "Help shape features that matter to you",
            "Takes just 3 minutes to complete",
          ]}
          ctaSupportingText="Your insights drive our innovation"
          cta="Take the Survey"
          ctaSupportingNote="Your feedback helps us build a better platform for healthcare professionals"
          link="https://docs.google.com/forms/d/e/1FAIpQLSehu8y4CXIxogolia2D8JfIJo-1t6psbhQlK_C-4G25g4jKBQ/viewform?usp=dialog"
          eventLabel="Navigate to Where you work Matters google form surevey"
        />
      </PopUpModal>
    </>
  );
}
