import Images from "../Assets/index";
import SubscribedUsersService from "../Services/SubscribedUsers.Service";
import HandleEvent from "../Pipes/HandleEvent.Pipe";
import { Children, useRef, useEffect, useState, useContext } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import SEO from "../Components/SEO.Component";
import { alert } from "../Utils/AlertGlobalInterface.Util";
import { generateImageAlt } from "../Utils/SEOHelpers.Util";

export default function Work_values() {
  document.title = "Work Values | NursingFront";
  const pageTitle = document.title;
  const pageDescription =
    "Find supportive workplaces that prioritize growth, well-being, and professional development.";
  const pageKeywords =
    "nursing jobs, healthcare jobs, nurse careers, Nursing job opportunities, Nurse career growth, Healthcare jobs for nurses, Nursing work environment, Flexible nursing careers, Supportive nursing workplaces, Jobs for registered nurses, Nurse job search USA, Healthcare career advancement, Top nursing employers";
  const pageImageUrl =
    "https://res.cloudinary.com/nursingfront/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727147444/NursesBanner3_jnjxdm.jpg";

  const formRef = useRef(null);

  // CONSTANT
  const BANNER_FEATURES = [
    "Flexibility?",
    "Recognition?",
    "Safety?",
    "Career Development?",
    "High Retention Rate?",
    "Team Collaboration?",
    "Empowerment?",
    "Career Growth?",
    "Training & Development?",
    "Benefits & Compensation?",
  ];

  // STATES
  const [slideIndex, setSlideIndex] = useState(0);

  // USE EFFECT
  useEffect(() => {
    const time = setTimeout(() => {
      slideIndex === BANNER_FEATURES.length - 1
        ? setSlideIndex(0)
        : setSlideIndex(slideIndex + 1);
    }, 4000);
    return () => clearInterval(time);
  }, [slideIndex, BANNER_FEATURES.length]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    HandleEvent("Button", "Click on convert kit subscribe button");

    const { data } = await SubscribedUsersService.POST_CONVERT_KIT({
      reqBody: {
        email: e.target.elements.email.value,
        name: e.target.elements.name.value,
        message: e.target.elements.message.value,
      },
    });

    if (data && data?.SUCCESS) {
      if (formRef.current) formRef.current.reset();
      alert.success(
        "Thank you for participating. Check your email to confirm your addition to our mailing list"
      );
    }
  };
  //Structured data for Job Seeker Page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Work Values",

    url: "https://nursingfront.com/work-values",
    publisher: {
      "@type": "Organization",
      name: "NursingFront",
      url: "https://nursingfront.com",
    },
  };

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={pageKeywords}
        imageUrl={pageImageUrl}
        structuredData={structuredData}
      />

      <div className="bg-brand-500 min-h-screen flex flex-col lg:flex-row items-center justify-center gap-4 px-4 lg:px-0">
        <div className="relative w-full lg:w-1/2 max-w-[1000px] mb-4 lg:mb-0">
          <LazyLoadImage
            src={Images["ThreeHappyNurses2"]}
            alt={generateImageAlt("ThreeHappyNurses2", "Three happy nurses smiling and holding each other in a hospital setting")}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start gap-4">
          <div className="text-center mb-4">
            <h1 className="text-lg text-white sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold font-recoleta mb-2">
              What defines a positive work environment?
            </h1>

            <div className="text-center">
              {" "}
              {Children.toArray(
                BANNER_FEATURES?.map((item, index) => (
                  <span
                    key={index}
                    className={`py-1 px-2 w-fit text-lg sm:text-xl md:text-xl lg:text-2xl text-white fancy-border-1 underline font-bold ${
                      slideIndex === index ? "inline" : "hidden"
                    } `}
                  >
                    {item}
                  </span>
                ))
              )}
            </div>
          </div>
          <div className="flex flex-col w-full bg-gradient-to-r from-[#e8e6fa] to-indigo-300 p-8 border-2 border-indigo-300 rounded-lg shadow-lg">
            <p className="text-[#281841] text-center mb-4 text-2xl font-bold">
              Share with us your ideal work environment!
            </p>
            <form
              ref={formRef}
              onSubmit={handleSubscribe}
              className="space-y-4 mt-auto"
            >
              <div>
                <input
                  type="text"
                  name="message"
                  placeholder="Share what you value"
                  className="w-full px-4 py-2 text-lg text-[#281841] bg-white border border-indigo-300 rounded-lg"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="First Name"
                  className="w-full px-4 py-2 text-lg text-[#281841] bg-white border border-indigo-300 rounded-lg"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  className="w-full px-4 py-2 text-lg text-[#281841] bg-white border border-indigo-300 rounded-lg"
                />
              </div>
              <button
                onClick={() => {
                  HandleEvent(
                    "Link",
                    "Link to Submit Button in Work Values page"
                  );
                }}
                type="submit"
                className="w-full py-3 text-white bg-[#E35200] font-bold text-lg tracking-wide rounded-lg hover:bg-[#cc4400] focus:outline-none focus:ring-2 focus:ring-[#E35200] focus:ring-opacity-50 transition duration-300 ease-in-out"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}