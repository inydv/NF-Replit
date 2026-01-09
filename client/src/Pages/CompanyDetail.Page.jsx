import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Add animation library

// CUSTOM IMPORT
import CompaniesService from "../Services/Companies.Service.js";
import { JobDetail, JobPost } from "../Components/index";

// IMAGE LAZY LOADING
import { LazyLoadImage } from "react-lazy-load-image-component";
import routesConstant from "../Constants/Routes.Constant.json";

// ICONS
import {
  Building,
  MapPin,
  Globe,
  Users,
  Award,
  Target,
  Heart,
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  Clock,
  TrendingUp,
  Share2,
  Camera,
  Star,
  Plus,
  Trash2,
  Save,
  Quote,
  Grid,
} from "lucide-react";
import { useUser } from "../Context/User.Context";
import { alert } from "../Utils/AlertGlobalInterface.Util";

// Mock company values (replace with actual data from API when available)
const companyvalues = [
  {
    title: "Innovation",
    icon: "Lightbulb",
    image: {
      public_id: "test",
      url: "https://res.cloudinary.com/nursingfront/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727147032/NursesBanner1_mopwyr.jpg",
    },
    description:
      "Innovation is at the core of everything we do. We invest heavily in research and development, encouraging our teams to dedicate time to exploring new concepts. We've established innovation labs across our offices where teams can collaborate on breakthrough ideas. Our annual Innovation Challenge rewards bold thinking and has resulted in several market-leading products.",
  },
  {
    title: "Collaboration",
    icon: "Users",
    image: {
      public_id: "test",
      url: "https://res.cloudinary.com/nursingfront/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727147032/NursesBanner1_mopwyr.jpg",
    },
    description:
      "Collaboration is how we achieve extraordinary results. Our open office spaces, digital collaboration tools, and cross-functional project teams are designed to bring diverse perspectives together. We believe the best ideas emerge when different disciplines and backgrounds intersect. By working together, we consistently deliver solutions greater than the sum of their parts.",
  },
  {
    title: "Excellence",
    icon: "Award",
    image: {
      public_id: "test",
      url: "https://res.cloudinary.com/nursingfront/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727147032/NursesBanner1_mopwyr.jpg",
    },
    description:
      "Excellence is our standard, not our goal. We've built rigorous quality assurance processes that ensure our deliverables consistently exceed expectations. Our team members pursue mastery in their respective fields through continuous learning and professional development. We regularly benchmark ourselves against industry leaders and work relentlessly to raise the bar.",
  },
  {
    title: "Integrity",
    icon: "Heart",
    image: {
      public_id: "test",
      url: "https://res.cloudinary.com/nursingfront/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727147032/NursesBanner1_mopwyr.jpg",
    },
    description:
      "Integrity forms the foundation of our relationships. We believe in radical transparency, both internally and with our customers and partners. Our ethical guidelines go beyond compliance to embrace genuine responsibility for our impact. We make difficult decisions based on what's right, not just what's profitable in the short term.",
  },
  {
    title: "Customer Focus",
    icon: "Target",
    image: {
      public_id: "test",
      url: "https://res.cloudinary.com/nursingfront/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727147032/NursesBanner1_mopwyr.jpg",
    },
    description:
      "Customer focus drives every decision we make. We regularly engage with our users through surveys, interviews, and advisory boards to deeply understand their challenges. Our product roadmap is built directly from customer feedback, ensuring we solve real problems. We measure our success by our customers' success.",
  },
];

// Company gallery mock data
const companygallery = [
  {
    image: {
      public_id: "test",
      url: "https://res.cloudinary.com/nursingfront/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727147032/NursesBanner1_mopwyr.jpg",
    },
    title: "Our Modern Office",
    description:
      "Our headquarters features collaborative spaces for innovation.",
  },
  {
    image: {
      public_id: "test",
      url: "https://res.cloudinary.com/nursingfront/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727147032/NursesBanner1_mopwyr.jpg",
    },
    title: "Team Building Event",
    description: "Annual team retreat to strengthen our culture.",
  },
  {
    image: {
      public_id: "test",
      url: "https://res.cloudinary.com/nursingfront/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727147032/NursesBanner1_mopwyr.jpg",
    },
    title: "Award Ceremony",
    description: "Celebrating excellence in healthcare innovation.",
  },
  {
    image: {
      public_id: "test",
      url: "https://res.cloudinary.com/nursingfront/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727147032/NursesBanner1_mopwyr.jpg",
    },
    title: "Community Outreach",
    description: "Giving back to the communities we serve.",
  },
];

// Testimonials mock data
const testimonials = [
  {
    quote:
      "Working here has been the highlight of my career. The culture of innovation and collaboration is unlike anywhere else.",
    author: "Jane Doe",
    position: "Senior Developer",
    image: {
      public_id: "test",
      url: "https://res.cloudinary.com/nursingfront/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727147032/NursesBanner1_mopwyr.jpg",
    },
  },
  {
    quote:
      "The leadership team truly cares about employee growth and development. They've invested in my skills from day one.",
    author: "John Smith",
    position: "Product Manager",
    image: {
      public_id: "test",
      url: "https://res.cloudinary.com/nursingfront/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727147032/NursesBanner1_mopwyr.jpg",
    },
  },
];

// Loader component
const ImageUploadLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
    <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
  </div>
);

export default function CompanyDetail() {
  // PAGE TITLE
  document.title = "Company Detail";

  // CONTEXT
  const { user } = useUser();

  // STATES
  const [company, setCompany] = useState({});
  const [choosedImage, setChoosedImage] = useState({});
  const [jobId, setJobId] = useState(null);
  const [isJobOpen, setIsJobOpen] = useState(false);
  const [selectedValueIndex, setSelectedValueIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("about");
  const [isSticky, setIsSticky] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingImages, setUploadingImages] = useState({}); // Track uploading status for each image

  const [specialties, setSpecialties] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // REFS
  const headerRef = useRef(null);
  const navRef = useRef(null);
  const navigate = useNavigate();

  // USE PARAMS
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get("isEdit");

  // Add these state variables to your component
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);

  // Update slidesPerView based on screen size using useEffect and window.innerWidth
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesPerView(1); // Mobile: 1 slide
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2); // Tablet: 2 slides
      } else {
        setSlidesPerView(3); // Desktop: 3 slides
      }
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const updateCompanyPage = async () => {
    // Check if any image is still uploading
    const isUploading = Object.values(uploadingImages).some((status) => status);

    if (isUploading) {
      alert.error(
        "Please wait until all images are uploaded before saving changes."
      );
      return;
    }

    const mission = {
      quote: company?.mission?.quote || "",
      specialties: specialties || [],
    };

    if (company?.mission?.image) {
      mission.image = company.mission.image;
    }

    const reqBody = {
      description: company?.description,
      establishedAt: company?.establishedAt,
      teamsize: company?.teamsize,
      headquarter: company?.headquarter,
      industry: company?.industry,
      mission,
      values: company?.values,
      galleries: company?.galleries,
      testimonials: company?.testimonials,
    };

    const { data } = await CompaniesService.UPDATE_COMPANY_PROFILE({
      companySlug: slug,
      reqBody,
    });

    if (data && data?.SUCCESS) {
      navigate(routesConstant.USER_COMPANY + "/" + company?.slug);
      fetchData();
    }
  };

  const handleInputChange2 = (field, value) => {
    const keys = field.split(".");
    setCompany((prev) => {
      let updated = { ...prev };
      let current = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        current[key] = { ...current[key] }; // ensure immutability
        current = current[key];
      }

      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleInputChangeForSingleValue = (key, value) => {
    setCompany((prev) => {
      const updated = { ...prev };
      updated[key] = value;
      return updated;
    });
  };

  const handleSpecialtiesInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSpecialtiesKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = inputValue.trim().replace(/,$/, "");
      if (value && !specialties.includes(value)) {
        setSpecialties([...specialties, value]);
      }
      setInputValue("");
    }
  };

  const removeSpecialties = (indexToRemove) => {
    setSpecialties(specialties.filter((_, index) => index !== indexToRemove));
  };

  const handleChangeImage = async (name) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 10485760) {
          alert.error("File size exceeds 10 MB. Please upload a smaller file.");
          return;
        }

        try {
          setUploadingImages((prevState) => ({ ...prevState, [name]: true })); // Set loader for the specific image

          // Upload new image to Cloudinary
          const formData = new FormData();
          formData.append("file", file);
          formData.append(
            "upload_preset",
            import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
          );

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${
              import.meta.env.VITE_CLOUDINARY_NAME
            }/image/upload`,
            { method: "POST", body: formData }
          );
          const data = await response.json();

          // Update state with new image details
          setCompany((prevState) => ({
            ...prevState,
            mission: {
              image: { url: data.secure_url, public_id: data.public_id },
            },
          }));
          setChoosedImage((prevState) => ({
            ...prevState,
            [name]: data.secure_url,
          }));
        } catch (error) {
          console.error("Error uploading image:", error);
        } finally {
          setUploadingImages((prevState) => ({ ...prevState, [name]: false })); // Clear loader for the specific image
        }
      }
    };
    fileInput.click();
  };

  const handleArrayChangeImage = async (name, index, keyName) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 10485760) {
          alert.error("File size exceeds 10 MB. Please upload a smaller file.");
          return;
        }

        try {
          const uploadKey = `${keyName}-${index}`; // Unique key for the image
          setUploadingImages((prevState) => ({
            ...prevState,
            [uploadKey]: true,
          })); // Set loader for the specific image

          // Upload new image to Cloudinary
          const formData = new FormData();
          formData.append("file", file);
          formData.append(
            "upload_preset",
            import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
          );

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${
              import.meta.env.VITE_CLOUDINARY_NAME
            }/image/upload`,
            { method: "POST", body: formData }
          );
          const data = await response.json();

          // Update state with new image details
          setCompany((prevState) => {
            const updatedValues = [...prevState[keyName]];
            updatedValues[index] = {
              ...updatedValues[index],
              [name]: { url: data.secure_url, public_id: data.public_id },
            };
            return { ...prevState, [keyName]: updatedValues };
          });
          setChoosedImage((prevState) => ({
            ...prevState,
            [`${keyName}-${name}-${index}`]: data.secure_url,
          }));
        } catch (error) {
          console.error("Error uploading image:", error);
        } finally {
          const uploadKey = `${keyName}-${index}`;
          setUploadingImages((prevState) => ({
            ...prevState,
            [uploadKey]: false,
          })); // Clear loader for the specific image
        }
      }
    };
    fileInput.click();
  };

  const deleteSlide = (type, index) => {
    setCompany((prevState) => ({
      ...prevState,
      [type]: prevState[type].filter((_, i) => i !== index),
    }));
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data } = await CompaniesService.GET_COMPANY({
        companySlug: slug,
      });

      if (data && data?.SUCCESS) {
        setSpecialties(data?.DATA?.mission?.specialties || []);
        setCompany({
          ...data?.DATA,
          values: data?.DATA?.values || companyvalues,
          galleries: data?.DATA?.galleries || companygallery,
          testimonials: data?.DATA?.testimonials || testimonials,
          establishedAt: data?.DATA?.establishedAt || "2010",
          headquarter: data?.DATA?.headquarter || "San Francisco, CA",
          industry: data?.DATA?.industry || "Healthcare Technology",
          teamsize: data?.DATA?.teamsize || "25",
        });
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // USE EFFECT
  useEffect(() => {
    fetchData();
  }, [slug]);

  useEffect(() => {
    scrollTo(0, 0);
    document.body.style.paddingTop = "0px";

    // Setup scroll event listener for sticky nav and scroll-to-top button
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

  const openJob = (id) => {
    setJobId(id === jobId ? null : id);
    setIsJobOpen(id !== jobId);
  };

  // Navigation functions for values
  const goToNextValue = () => {
    setSelectedValueIndex((prevIndex) =>
      prevIndex === company?.values?.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevValue = () => {
    setSelectedValueIndex((prevIndex) =>
      prevIndex === 0 ? company?.values?.length - 1 : prevIndex - 1
    );
  };

  const addNewSlide = (type) => {
    switch (type) {
      case "values":
        setCompany((prevState) => ({
          ...prevState,
          values: [
            ...prevState.values,
            {
              title: "",
              icon: "Lightbulb",
              image: "",
              description: "",
            },
          ],
        }));
        break;

      case "galleries":
        setCompany((prevState) => ({
          ...prevState,
          galleries: [
            ...prevState.galleries,
            {
              image: "",
              title: "",
              description: "",
            },
          ],
        }));
        break;

      case "testimonials":
        setCompany((prevState) => ({
          ...prevState,
          testimonials: [
            ...prevState.testimonials,
            {
              quote: "",
              author: "",
              position: "",
              imageSrc: "",
            },
          ],
        }));
        break;
    }
  };

  const icons = [
    {
      icon: <Lightbulb size={16} />,
      color: "bg-blue-100 text-blue-600",
      name: "Lightbulb",
    },
    {
      icon: <Users size={16} />,
      color: "bg-purple-100 text-purple-600",
      name: "Users",
    },
    {
      icon: <Award size={16} />,
      color: "bg-yellow-100 text-yellow-600",
      name: "Award",
    },
    {
      icon: <Heart size={16} />,
      color: "bg-red-100 text-red-600",
      name: "Heart",
    },
    {
      icon: <Target size={16} />,
      color: "bg-green-100 text-green-600",
      name: "Target",
    },
  ];

  // Function to render the appropriate icon based on name
  const renderIcon = (iconName) => {
    switch (iconName) {
      case "Lightbulb":
        return (
          <div
            className={`inline-flex items-center bg-blue-100 text-blue-600 px-3 py-1 rounded-full mb-3`}
          >
            <Lightbulb size={16} />
            <span className="ml-1 font-medium text-sm">Core Value</span>
          </div>
        );

      case "Users":
        return (
          <div
            className={`inline-flex items-center bg-purple-100 text-purple-600 px-3 py-1 rounded-full mb-3`}
          >
            <Users size={16} />
            <span className="ml-1 font-medium text-sm">Core Value</span>
          </div>
        );

      case "Award":
        return (
          <div
            className={`inline-flex items-center bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full mb-3`}
          >
            <Award size={16} />
            <span className="ml-1 font-medium text-sm">Core Value</span>
          </div>
        );

      case "Heart":
        return (
          <div
            className={`inline-flex items-center bg-red-100 text-red-600 px-3 py-1 rounded-full mb-3`}
          >
            <Heart size={16} />
            <span className="ml-1 font-medium text-sm">Core Value</span>
          </div>
        );

      case "Target":
      default:
        return (
          <div
            className={`inline-flex items-center bg-green-100 text-green-600 px-3 py-1 rounded-full mb-3`}
          >
            <Target size={16} />
            <span className="ml-1 font-medium text-sm">Core Value</span>
          </div>
        );
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-gray-300 h-64 rounded-b-3xl mb-8"></div>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <div className="h-8 bg-gray-300 w-2/3 mb-4 rounded"></div>
            <div className="h-4 bg-gray-200 w-full mb-2 rounded"></div>
            <div className="h-4 bg-gray-200 w-full mb-2 rounded"></div>
            <div className="h-4 bg-gray-200 w-5/6 rounded"></div>
          </div>
          <div className="md:w-1/2">
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );

  {
    /* Company Info Card Component */
  }
  const CompanyInfoCard = ({
    icon,
    title,
    value,
    isEdit,
    fieldName,
    placeholder,
  }) => {
    return (
      <motion.div
        whileHover={{
          y: -5,
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        }}
        transition={{ duration: 0.2 }}
        className="bg-blue-50 p-6 rounded-lg shadow-sm"
      >
        <div className="flex items-center mb-3">
          {icon}
          <h4 className="font-semibold text-lg">{title}</h4>
        </div>
        {isEdit ? (
          <div className="relative">
            <input
              name={fieldName}
              defaultValue={value}
              className="w-full px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all duration-200 bg-white/70"
              placeholder={placeholder}
              onChange={(e) =>
                handleInputChangeForSingleValue(fieldName, e.target.value)
              }
            />
            <div className="absolute top-1 right-1 bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs font-medium">
              Edit
            </div>
          </div>
        ) : (
          <p>{value}</p>
        )}
      </motion.div>
    );
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      {isLoading && <ImageUploadLoader />}
      {/* Hero Header Section */}
      <header
        ref={headerRef}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-12 rounded-b-3xl relative overflow-hidden shadow-xl transition-all duration-300"
      >
        <div className="absolute inset-0 opacity-10">
          <LazyLoadImage
            src="https://res.cloudinary.com/nursingfront/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727147032/NursesBanner1_mopwyr.jpg"
            alt="Company Background"
            className="w-full h-full object-cover"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto relative z-10"
        >
          <div className="flex justify-center">
            <div className="bg-white p-2 rounded-full shadow-lg">
              <LazyLoadImage
                src={
                  company?.image?.url ||
                  "https://res.cloudinary.com/nursingfront/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727147032/NursesBanner1_mopwyr.jpg"
                }
                className="w-20 h-20 rounded-full object-contain"
                alt="Company Logo"
              />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 text-center">
            {company?.name || "Company Name"}
          </h2>
          <div className="flex items-center justify-center mt-2">
            <MapPin size={18} className="mr-1" />
            <p className="text-lg">{company?.location || "Location"}</p>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <a
              href={company?.website}
              className="inline-flex items-center px-5 py-2 bg-white text-blue-600 font-semibold rounded-full shadow-md transition-all hover:bg-gray-100 hover:shadow-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Globe size={16} className="mr-1" />
              Visit Website
            </a>
            <button className="inline-flex items-center px-5 py-2 bg-blue-500 text-white font-semibold rounded-full shadow-md transition-all hover:bg-blue-600 hover:shadow-lg">
              <Share2 size={16} className="mr-1" />
              Share
            </button>
          </div>
        </motion.div>
      </header>

      {/* Sticky Navigation */}
      <div
        ref={navRef}
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isSticky
            ? "bg-white shadow-md py-3"
            : "bg-transparent py-0 pointer-events-none opacity-0"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {isSticky && (
                <img
                  src={
                    company?.image?.url ||
                    "https://res.cloudinary.com/nursingfront/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727147032/NursesBanner1_mopwyr.jpg"
                  }
                  alt={company?.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
              )}
              <h2 className="font-bold text-lg text-blue-800">
                {company?.name}
              </h2>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab("about")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === "about"
                    ? "bg-blue-100 text-blue-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab("values")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === "values"
                    ? "bg-blue-100 text-blue-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Values
              </button>
              <button
                onClick={() => setActiveTab("jobs")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === "jobs"
                    ? "bg-blue-100 text-blue-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Jobs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* About Company Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row gap-12"
          >
            <div className="md:w-1/2">
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full mb-3">
                <Building size={16} className="mr-1" />
                <span className="text-sm font-medium">Company Profile</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-blue-800">
                About {company?.name || "Us"}
              </h3>
              <div className="space-y-4 text-gray-700">
                {isEdit &&
                (company?.createdById === user?.createdById || user?.id) ? (
                  <div className="relative">
                    <textarea
                      name="description"
                      className="w-full p-4 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all duration-200 bg-blue-50/50 text-gray-700"
                      rows={5}
                      defaultValue={company?.description || ""}
                      placeholder="Enter About Company"
                      onChange={(e) =>
                        setCompany((prevState) => ({
                          ...prevState,
                          description: e.target.value,
                        }))
                      }
                    ></textarea>
                    <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      Editing
                    </div>
                  </div>
                ) : (
                  <p>
                    {company?.description ||
                      "Founded with a mission to transform healthcare delivery, we combine cutting-edge technology with compassionate care. Our team of dedicated professionals works tirelessly to develop innovative solutions that improve patient outcomes while reducing costs."}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6 mt-8">
                <CompanyInfoCard
                  icon={<Clock className="text-blue-600 mr-2" size={20} />}
                  title="Established At"
                  value={company?.establishedAt || "2010"}
                  isEdit={
                    isEdit &&
                    (company?.createdById === user?.createdById || user?.id)
                  }
                  fieldName="establishedAt"
                  placeholder="Enter Established At"
                />
                <CompanyInfoCard
                  icon={<Users className="text-blue-600 mr-2" size={20} />}
                  title="Team Size"
                  value={company?.teamsize || 25}
                  isEdit={
                    isEdit &&
                    (company?.createdById === user?.createdById || user?.id)
                  }
                  fieldName="teamsize"
                  placeholder="Enter Team Size"
                />
                <CompanyInfoCard
                  icon={<Building className="text-blue-600 mr-2" size={20} />}
                  title="headquarter"
                  value={company?.headquarter || "San Francisco, CA"}
                  isEdit={
                    isEdit &&
                    (company?.createdById === user?.createdById || user?.id)
                  }
                  fieldName="headquarter"
                  placeholder="Enter Headquarter"
                />
                <CompanyInfoCard
                  icon={<TrendingUp className="text-blue-600 mr-2" size={20} />}
                  title="Industry"
                  value={company?.industry || "Healthcare Technology"}
                  isEdit={
                    isEdit &&
                    (company?.createdById === user?.createdById || user?.id)
                  }
                  fieldName="industry"
                  placeholder="Enter Industry"
                />
              </div>
            </div>

            <div className="md:w-1/2">
              <div className="relative h-full rounded-2xl overflow-hidden shadow-xl group">
                {isEdit &&
                  (company?.createdById === user?.createdById || user?.id) && (
                    <button
                      className="absolute top-4 right-4 z-10 bg-blue-900/90 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 flex items-center"
                      onClick={() => handleChangeImage("mission")}
                    >
                      <Camera size={16} className="mr-2" />
                      Change Image
                    </button>
                  )}
                <LazyLoadImage
                  src={
                    company?.mission?.image?.url ||
                    choosedImage?.mission ||
                    "https://res.cloudinary.com/nursingfront/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727147032/NursesBanner1_mopwyr.jpg"
                  }
                  alt="About our company"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {uploadingImages["mission"] && <ImageUploadLoader />}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/80 to-transparent p-6">
                  <div className="text-white max-w-md">
                    <h4 className="font-bold text-xl mb-2">Our Mission</h4>
                    {isEdit &&
                    (company?.createdById === user?.createdById || user?.id) ? (
                      <div className="relative">
                        <input
                          className="w-full px-4 py-3 border border-blue-300 rounded-lg bg-white/20 backdrop-blur-md text-white font-medium focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="Enter Company Mission"
                          defaultValue={company?.mission?.quote}
                          onChange={(e) =>
                            handleInputChange2("mission.quote", e.target.value)
                          }
                        />
                        <div className="absolute top-2 right-2 bg-blue-500/80 text-white px-2 py-1 rounded text-xs font-medium">
                          Editing
                        </div>
                      </div>
                    ) : (
                      <p className="text-white/90">
                        {company?.mission?.quote ||
                          "To improve lives through innovative healthcare solutions that empower both providers and patients."}
                      </p>
                    )}

                    {isEdit &&
                    (company?.createdById === user?.createdById || user?.id) ? (
                      <div className="mt-4 relative">
                        <label className="block text-white/80 text-sm mb-2">
                          Specialties
                        </label>
                        <div className="border border-gray-200 rounded-lg px-4 py-3 w-full text-gray-700 text-sm focus-within:ring-2 focus-within:ring-blue-100">
                          <div className="flex flex-wrap gap-2">
                            {specialties.map((specialty, index) => (
                              <div
                                key={index}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center text-sm"
                              >
                                {specialty}
                                <button
                                  type="button"
                                  onClick={() => removeSpecialties(index)}
                                  className="ml-2 text-blue-500 hover:text-blue-700"
                                >
                                  &times;
                                </button>
                              </div>
                            ))}
                            <input
                              className="w-full px-4 py-3 border border-blue-300 rounded-lg bg-white/20 backdrop-blur-md text-white font-medium focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200"
                              placeholder="Enter Company Specialties"
                              value={inputValue}
                              onChange={handleSpecialtiesInputChange}
                              onKeyDown={handleSpecialtiesKeyDown}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {(
                          company?.mission?.specialties || [
                            "Healthcare",
                            "Technology",
                            "Innovation",
                          ]
                        ).map((specialty, index) => (
                          <span
                            key={index}
                            className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Featured Value Carousel Section */}
      <section id="values" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full mb-3">
              <Star size={16} className="mr-1" />
              <span className="text-sm font-medium">Our Values</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold">
              What Drives Us Forward
            </h3>
          </div>

          <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${selectedValueIndex * 100}%)`,
                }}
              >
                {company?.values?.map((value, index) => (
                  <div
                    key={index}
                    className="w-full flex-shrink-0 flex flex-col md:flex-row items-center relative"
                  >
                    <div className="md:w-1/2 overflow-hidden relative group">
                      <LazyLoadImage
                        src={
                          choosedImage?.["values-image-" + index] ||
                          value?.image?.url ||
                          value?.image
                        }
                        alt={value.title}
                        className="w-full h-60 md:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {uploadingImages[`values-${index}`] && (
                        <ImageUploadLoader />
                      )}
                      {isEdit &&
                        (company?.createdById === user?.createdById ||
                          user?.id) && (
                          <button
                            className="absolute bottom-4 left-4 z-10 bg-blue-900/90 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 flex items-center"
                            onClick={() =>
                              handleArrayChangeImage("image", index, "values")
                            }
                          >
                            <Camera size={16} className="mr-2" />
                            Change Image
                          </button>
                        )}
                    </div>
                    <div className="md:w-1/2 p-8 bg-gradient-to-r from-gray-50 to-white relative">
                      {isEdit &&
                      (company?.createdById === user?.createdById ||
                        user?.id) ? (
                        <div className="mb-4 border border-gray-200 rounded-lg p-2 bg-gray-50">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Select Icon
                          </label>
                          <div className="grid grid-cols-5 gap-1">
                            {icons.map((icon, i) => (
                              <div
                                key={i}
                                className={`flex items-center justify-center p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                  value.icon === icon.name
                                    ? "ring-2 ring-blue-500 bg-blue-50"
                                    : "hover:bg-gray-100"
                                }`}
                                onClick={() =>
                                  setCompany((prevState) => ({
                                    ...prevState,
                                    values: prevState.values.map((item, j) =>
                                      j === index
                                        ? { ...item, icon: icon.name }
                                        : item
                                    ),
                                  }))
                                }
                              >
                                <div
                                  className={`${icon.color} p-1 rounded-full`}
                                >
                                  {icon.icon}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        renderIcon(value.icon)
                      )}

                      {isEdit &&
                      (company?.createdById === user?.createdById ||
                        user?.id) ? (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Value Title
                          </label>
                          <input
                            name="title"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all duration-200"
                            placeholder="Enter Title"
                            defaultValue={value.title}
                            onChange={(e) =>
                              setCompany((prevState) => ({
                                ...prevState,
                                values: prevState.values.map((item, j) =>
                                  j === index
                                    ? { ...item, title: e.target.value }
                                    : item
                                ),
                              }))
                            }
                          />
                        </div>
                      ) : (
                        <h3 className="text-2xl font-bold mb-3">
                          {value.title}
                        </h3>
                      )}

                      {isEdit &&
                      (company?.createdById === user?.createdById ||
                        user?.id) ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            name="description"
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all duration-200"
                            placeholder="Enter Description"
                            defaultValue={value.description}
                            rows={5}
                            onChange={(e) =>
                              setCompany((prevState) => ({
                                ...prevState,
                                values: prevState.values.map((item, j) =>
                                  j === index
                                    ? {
                                        ...item,
                                        description: e.target.value,
                                      }
                                    : item
                                ),
                              }))
                            }
                          ></textarea>
                        </div>
                      ) : (
                        <p className="text-gray-700 leading-relaxed">
                          {value.description}
                        </p>
                      )}

                      {isEdit &&
                        (company?.createdById === user?.createdById ||
                          user?.id) && (
                          <button
                            className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center transition-colors shadow-sm"
                            onClick={() => {
                              if (
                                confirm(
                                  "Are you sure you want to delete this slide?"
                                )
                              ) {
                                deleteSlide("values", index);
                              }
                            }}
                          >
                            <Trash2 size={16} className="mr-2" />
                            Delete Slide
                          </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Controls */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={goToPrevValue}
                className="flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                aria-label="Previous value"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Carousel Indicators */}
              <div className="flex space-x-2">
                {company?.values?.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedValueIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      selectedValueIndex === index
                        ? "bg-blue-600 w-6"
                        : "bg-gray-300"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {isEdit &&
              (company?.createdById === user?.createdById || user?.id) ? (
                <button
                  onClick={
                    selectedValueIndex === company?.values?.length - 1
                      ? () => addNewSlide("values")
                      : goToNextValue
                  }
                  className={`flex items-center justify-center w-12 h-12 ${
                    selectedValueIndex === company?.values?.length - 1
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white rounded-full transition-colors shadow-md`}
                  aria-label={
                    selectedValueIndex === company?.values?.length - 1
                      ? "Add new slide"
                      : "Next value"
                  }
                >
                  {selectedValueIndex === company?.values?.length - 1 ? (
                    <Plus size={20} />
                  ) : (
                    <ChevronRight size={20} />
                  )}
                </button>
              ) : (
                <button
                  onClick={goToNextValue}
                  className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors shadow-md"
                  aria-label="Next value"
                >
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Company Gallery Carousel Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-purple-100 text-purple-600 px-3 py-1 rounded-full mb-3">
              <Camera size={16} className="mr-1" />
              <span className="text-sm font-medium">Company Life</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold">
              Life at {company?.name || "Our Company"}
            </h3>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              Get a glimpse of our company culture and the amazing team that
              makes everything possible.
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative">
            {/* Previous Slide Button */}
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-purple-800 p-3 rounded-full shadow-lg -ml-5 hidden md:flex"
              onClick={() => {
                // Previous slide logic
                const activeIndex =
                  (currentSlide - 1 + company?.galleries.length) %
                  company?.galleries.length;
                setCurrentSlide(activeIndex);
              }}
            >
              <ChevronLeft size={24} />
            </button>

            {/* Carousel Track */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${
                    (currentSlide * 100) / slidesPerView
                  }%)`,
                }}
              >
                {company?.galleries.map((item, index) => (
                  <div
                    key={item.id}
                    className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{
                        scale: 1.03,
                        boxShadow:
                          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      }}
                      className="group relative rounded-xl overflow-hidden shadow-lg border border-purple-100 h-full"
                    >
                      {isEdit &&
                        (company?.createdById === user?.createdById ||
                          user?.id) && (
                          <div className="absolute top-3 right-3 z-10 flex flex-col space-y-2">
                            <button
                              className="bg-blue-900/80 hover:bg-blue-800 text-white px-3 py-2 rounded-lg shadow-lg transition-all duration-200 flex items-center"
                              onClick={() =>
                                handleArrayChangeImage(
                                  "image",
                                  index,
                                  "galleries"
                                )
                              }
                            >
                              <Camera size={16} className="mr-2" />
                              Change Image
                            </button>
                            <button
                              className="bg-red-600/80 hover:bg-red-700 text-white px-3 py-2 rounded-lg shadow-lg transition-all duration-200 flex items-center"
                              onClick={() => deleteSlide("galleries", index)}
                            >
                              <Trash2 size={16} className="mr-2" />
                              Delete
                            </button>
                          </div>
                        )}

                      <div className="h-72 overflow-hidden relative">
                        <LazyLoadImage
                          src={
                            choosedImage?.["galleries-image-" + index] ||
                            item?.image?.url ||
                            item?.image
                          }
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {uploadingImages[`galleries-${index}`] && (
                          <ImageUploadLoader />
                        )}
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            {isEdit &&
                            (company?.createdById === user?.createdById ||
                              user?.id) ? (
                              <>
                                <div className="relative mb-4">
                                  <input
                                    name="title"
                                    className="w-full px-4 py-3 border border-purple-300 rounded-lg bg-white/20 backdrop-blur-md text-white font-medium focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200"
                                    placeholder="Enter Title"
                                    defaultValue={item.title}
                                    onChange={(e) =>
                                      setCompany((prevState) => ({
                                        ...prevState,
                                        galleries: prevState.galleries.map(
                                          (item, j) =>
                                            j === index
                                              ? {
                                                  ...item,
                                                  title: e.target.value,
                                                }
                                              : item
                                        ),
                                      }))
                                    }
                                  />
                                  <div className="absolute top-2 right-2 bg-purple-500/80 text-white px-2 py-1 rounded text-xs font-medium">
                                    Title
                                  </div>
                                </div>
                                <div className="relative">
                                  <textarea
                                    name="description"
                                    className="w-full px-4 py-3 border border-purple-300 rounded-lg bg-white/20 backdrop-blur-md text-white font-medium focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 resize-none"
                                    placeholder="Enter Description"
                                    rows={2}
                                    defaultValue={item.description}
                                    onChange={(e) =>
                                      setCompany((prevState) => ({
                                        ...prevState,
                                        galleries: prevState.galleries.map(
                                          (item, j) =>
                                            j === index
                                              ? {
                                                  ...item,
                                                  description: e.target.value,
                                                }
                                              : item
                                        ),
                                      }))
                                    }
                                  />
                                  <div className="absolute top-2 right-2 bg-purple-500/80 text-white px-2 py-1 rounded text-xs font-medium">
                                    Description
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <h4 className="font-bold text-xl mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                  {item.title}
                                </h4>
                                <p className="text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                  {item.description}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Title visible outside hover state */}
                      {!isEdit && (
                        <div className="bg-white py-3 px-4">
                          <h4 className="font-semibold text-purple-900 truncate">
                            {item.title}
                          </h4>
                        </div>
                      )}
                    </motion.div>
                  </div>
                ))}

                {/* Add New Slide in Edit Mode */}
                {isEdit &&
                  (company?.createdById === user?.createdById || user?.id) && (
                    <div className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3">
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        onClick={() => addNewSlide("galleries")}
                        className="h-72 rounded-xl overflow-hidden border-2 border-dashed border-purple-300 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 group"
                      >
                        <div className="flex flex-col items-center text-purple-800">
                          <div className="bg-purple-100 p-4 rounded-full mb-3 group-hover:bg-purple-200 transition-colors duration-300">
                            <Plus size={36} className="text-purple-600" />
                          </div>
                          <span className="font-medium text-lg">
                            Add Gallery Item
                          </span>
                          <span className="text-sm text-purple-600 mt-2">
                            Click to upload image
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  )}
              </div>
            </div>

            {/* Next Slide Button */}
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-purple-800 p-3 rounded-full shadow-lg -mr-5 hidden md:flex"
              onClick={() => {
                // Next slide logic
                const activeIndex =
                  (currentSlide + 1) % company?.galleries.length;
                setCurrentSlide(activeIndex);
              }}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {company?.galleries.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index ? "bg-purple-600 w-6" : "bg-purple-300"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>

          {/* Optional View All Images Button */}
          {company?.galleries?.length > 3 && !isEdit && (
            <div className="text-center mt-10">
              <button className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-300 shadow-md">
                <Grid size={18} className="mr-2" />
                View Gallery
              </button>
            </div>
          )}
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center bg-green-100 text-green-600 px-3 py-1 rounded-full mb-3">
              <Users size={16} className="mr-1" />
              <span className="text-sm font-medium">Employee Testimonials</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold">
              Hear From Our Team
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {company?.testimonials?.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-md relative"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4 relative">
                    {isEdit &&
                      (company?.createdById === user?.createdById ||
                        user?.id) && (
                        <button
                          className="absolute inset-0 bg-blue-800/60 hover:bg-blue-800/80 flex items-center justify-center rounded-full transition-all duration-200"
                          onClick={() =>
                            handleArrayChangeImage(
                              "image",
                              index,
                              "testimonials"
                            )
                          }
                        >
                          <Camera size={16} className="text-white" />
                        </button>
                      )}
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-100">
                      <LazyLoadImage
                        src={
                          choosedImage?.["testimonials-image-" + index] ||
                          testimonial?.image?.url ||
                          testimonial?.image
                        }
                        alt={testimonial.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    {isEdit &&
                    (company?.createdById === user?.createdById || user?.id) ? (
                      <div className="space-y-3">
                        <div className="relative">
                          <textarea
                            name="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-green-300 focus:border-green-300 outline-none transition-all duration-200 resize-none"
                            placeholder="Enter testimonial text"
                            rows={3}
                            defaultValue={testimonial.quote}
                            onChange={(e) =>
                              setCompany((prevState) => ({
                                ...prevState,
                                testimonials: prevState.testimonials.map(
                                  (item, j) =>
                                    j === index
                                      ? {
                                          ...item,
                                          quote: e.target.value,
                                        }
                                      : item
                                ),
                              }))
                            }
                          />
                          <div className="absolute top-2 right-2 bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-medium">
                            Quote
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative">
                            <input
                              name="author"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-green-300 focus:border-green-300 outline-none transition-all duration-200"
                              placeholder="Author name"
                              defaultValue={testimonial.author}
                              onChange={(e) =>
                                setCompany((prevState) => ({
                                  ...prevState,
                                  testimonials: prevState.testimonials.map(
                                    (item, j) =>
                                      j === index
                                        ? {
                                            ...item,
                                            author: e.target.value,
                                          }
                                        : item
                                  ),
                                }))
                              }
                            />
                          </div>

                          <div className="relative">
                            <input
                              name="position"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-green-300 focus:border-green-300 outline-none transition-all duration-200"
                              placeholder="Job position"
                              defaultValue={testimonial.position}
                              onChange={(e) =>
                                setCompany((prevState) => ({
                                  ...prevState,
                                  testimonials: prevState.testimonials.map(
                                    (item, j) =>
                                      j === index
                                        ? {
                                            ...item,
                                            position: e.target.value,
                                          }
                                        : item
                                  ),
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="relative">
                          <span className="absolute -top-2 -left-2 text-green-500 transform scale-150">
                            <Quote size={20} />
                          </span>
                          <p className="text-gray-700 italic mb-4 pl-5 pt-3">
                            {testimonial.quote}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <div>
                            <p className="font-bold text-gray-800">
                              {testimonial.author}
                            </p>
                            <p className="text-sm text-gray-600">
                              {testimonial.position}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {isEdit &&
                  (company?.createdById === user?.createdById || user?.id) && (
                    <button
                      className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs font-medium flex items-center transition-colors"
                      onClick={() => deleteSlide("testimonials", index)}
                    >
                      <Trash2 size={14} className="mr-1" />
                      Delete
                    </button>
                  )}
              </motion.div>
            ))}

            {isEdit &&
              (company?.createdById === user?.createdById || user?.id) && (
                <div
                  onClick={() => addNewSlide("testimonials")}
                  className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-green-200 hover:border-green-400 hover:bg-green-50/30 transition-all duration-200 h-60"
                >
                  <div className="bg-green-100 p-3 rounded-full mb-3">
                    <Plus size={24} className="text-green-600" />
                  </div>
                  <p className="font-medium text-green-600">Add Testimonial</p>
                </div>
              )}
          </div>
        </div>
      </section>

      {isEdit && (company?.createdById === user?.createdById || user?.id) && (
        <div className="flex justify-end container mx-auto px-4 space-x-4 py-6 my-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-100 shadow-md">
          <div className="flex items-center">
            <div className="mr-4">
              <span className="text-blue-700 font-medium">
                Save your changes?
              </span>
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-sm font-medium rounded-lg transition-all duration-200 flex items-center shadow-lg transform hover:-translate-y-0.5"
              onClick={updateCompanyPage}
            >
              <Save size={18} className="mr-4" />
              Save Changes
            </button>
            <button
              className=" ml-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 border border-gray-300 shadow-md"
              onClick={() => window.location.reload()}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Jobs Section */}
      <section id="jobs" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full mb-3">
                <Briefcase size={16} className="mr-1" />
                <span className="text-sm font-medium">
                  Career Opportunities
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">Join Our Team</h3>
            </div>
            <div className="bg-blue-600 text-white py-2 px-5 rounded-lg shadow-sm">
              <p className="text-sm font-medium flex items-center">
                <Briefcase size={16} className="mr-2" />
                {company?.jobs?.length || 0} Open Positions
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {company?.jobs?.length > 0 ? (
              company.jobs.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => openJob(item.id)}
                  >
                    <JobPost openJob={openJob} data={item} jobId={jobId} />
                  </div>
                  {jobId === item.id && isJobOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="bg-white border-t border-blue-100 p-6"
                    >
                      <JobDetail data={item} />
                    </motion.div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <div className="flex flex-col items-center">
                  <div className="bg-blue-100 p-4 rounded-full mb-4">
                    <Briefcase size={28} className="text-blue-500" />
                  </div>
                  <p className="text-gray-600 mb-2">
                    No open positions at this time.
                  </p>
                  <p className="text-sm text-gray-500">
                    Check back later for new opportunities!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
