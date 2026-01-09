import { Link } from "react-router-dom";
import { Children, useContext, useState, useEffect, useRef } from "react";
import RoutesConstant from "../Constants/Routes.Constant.json";
import CompanyFilterConstant from "../Constants/CompanyFilter.Constant.json";
import { useUser } from "../Context/User.Context";
import {
  MdEdit,
  MdLocationOn,
  MdCheck,
  MdInfo,
  MdFlip,
  MdOutlineArrowForward,
} from "react-icons/md";
import { FaBriefcase, FaChartLine, FaUsers, FaHeartbeat } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { generateImageAlt } from "../Utils/SEOHelpers.Util";

const BenefitItem = ({ icon, text }) => {
  return (
    <li className="flex items-start gap-2 mb-2 text-gray-700">
      <span className="text-teal-600 flex-shrink-0 mt-0.5">{icon}</span>
      <span className="text-sm">{text}</span>
    </li>
  );
};

const BenefitCategory = ({ title, data, type, icon }) => {
  if (!data?.length) return null;

  return (
    <div className="mb-4">
      <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center bg-white p-2 rounded-md shadow-sm">
        {icon}
        <span className="ml-2">{title}</span>
        {data.length > 0 && (
          <span className="text-xs bg-teal-100 text-teal-800 rounded-full px-2 ml-2">
            {data.length}
          </span>
        )}
      </h5>
      <ul className="pl-2 space-y-1.5">
        {Children?.toArray(
          data?.map((item) => {
            const value = CompanyFilterConstant[type]?.find(
              ({ VALUE }) => VALUE === item
            );

            return (
              <BenefitItem
                icon={<MdCheck size={16} />}
                text={value?.NAME || ""}
              />
            );
          })
        )}
      </ul>
    </div>
  );
};

export default function CompanyCard({ data, isEditBtn = false }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const timeoutRef = useRef(null);
  const cardRef = useRef(null);

  const toggleFlip = (e) => {
    e.preventDefault();
    setIsFlipped(!isFlipped);
    // Clear any existing timeout when manually flipping
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    // Only set timeout if card is currently flipped
    if (isFlipped) {
      // Set a timeout to flip the card back after 2 seconds
      timeoutRef.current = setTimeout(() => {
        setIsFlipped(false);
      }, 2000);
    }
  };

  const handleMouseEnter = () => {
    // Clear the timeout if mouse enters the card again before it flips back
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Count total benefits
  const totalBenefits =
    data?.personalHealth?.length +
    data?.teamValues?.length +
    data?.careerGrowth?.length;

  return (
    <>
      {/* Increased overall height with position relative to handle absolute positioning */}
      <div
        className="perspective-card w-80 relative"
        style={{ height: isEditBtn ? "430px" : "384px" }}
        ref={cardRef}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        {/* 3D perspective container */}
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front of Card */}
          <div className="absolute w-full h-full backface-hidden bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col">
            {/* Card Header */}
            <Link
              to={RoutesConstant.USER_COMPANY + "/" + data?.slug}
              className="relative bg-gradient-to-r from-teal-500 to-teal-600 pt-6 pb-16 px-6 border-b border-gray-100 no-underline flex-shrink-0"
            >
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                <div className="bg-white p-3 rounded-full shadow-md border border-gray-100">
                  <LazyLoadImage
                    src={data?.image?.url}
                    alt={generateImageAlt(data?.name, "Company Logo")}
                    className="h-24 w-24 object-contain rounded-full"
                    placeholderSrc="/company-placeholder.svg"
                  />
                </div>
              </div>
            </Link>

            {/* Card Front Content */}
            <div className="pt-16 px-6 pb-6 flex-grow flex flex-col">
              <Link
                to={RoutesConstant.USER_COMPANY + "/" + data?.slug}
                className="no-underline group"
              >
                <h3 className="text-xl font-semibold text-center text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">
                  {data?.name}
                </h3>

                <p className="text-gray-600 text-base flex items-center justify-center mb-5">
                  <MdLocationOn className="text-gray-500 mr-2 text-md" />
                  {data?.location || "Remote"}
                </p>
              </Link>

              {/* Company Benefits Preview - CLICKABLE PART */}
              <div className="flex-grow">
                <div className="mt-2 flex flex-col items-center justify-center text-gray-600">
                  <div
                    className="bg-teal-50 p-3 rounded-lg w-full text-center mb-3 cursor-pointer hover:bg-teal-100 transition-colors shadow-sm border border-teal-100"
                    onClick={toggleFlip}
                  >
                    <div className="mb-1 flex items-center justify-center">
                      <FaBriefcase className="text-teal-600 mr-2" />
                      <span className="font-medium">Company Benefits</span>
                      <MdFlip
                        className="text-teal-600 ml-2 animate-pulse"
                        size={16}
                      />
                    </div>

                    {totalBenefits > 0 ? (
                      <div className="flex justify-center items-center gap-6 mt-2">
                        {data?.personalHealth?.length > 0 && (
                          <div className="text-center">
                            <div className="bg-white rounded-full p-2 w-8 h-8 flex items-center justify-center mx-auto mb-1 shadow-sm border border-teal-50">
                              <FaHeartbeat className="text-teal-500" />
                            </div>
                            <p className="text-xs font-medium">
                              {data?.personalHealth?.length}
                            </p>
                          </div>
                        )}

                        {data?.teamValues?.length > 0 && (
                          <div className="text-center">
                            <div className="bg-white rounded-full p-2 w-8 h-8 flex items-center justify-center mx-auto mb-1 shadow-sm border border-teal-50">
                              <FaUsers className="text-teal-500" />
                            </div>
                            <p className="text-xs font-medium">
                              {data?.teamValues?.length}
                            </p>
                          </div>
                        )}

                        {data?.careerGrowth?.length > 0 && (
                          <div className="text-center">
                            <div className="bg-white rounded-full p-2 w-8 h-8 flex items-center justify-center mx-auto mb-1 shadow-sm border border-teal-50">
                              <FaChartLine className="text-teal-500" />
                            </div>
                            <p className="text-xs font-medium">
                              {data?.careerGrowth?.length}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm italic mt-1">No benefits listed</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Actions section positioned at the bottom of the card */}
            {isEditBtn && (
              <div className="p-2 border-t border-gray-100 bg-gray-50">
                <div className="flex gap-1">
                  <Link
                    className="flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white px-2 py-1 rounded text-xs flex-1"
                    to={RoutesConstant.USER_CREATE_COMPANY + "/" + data?.slug}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MdEdit className="mr-1" size={14} />
                    Details
                  </Link>

                  <Link
                    className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs flex-1"
                    to={
                      RoutesConstant.USER_COMPANY +
                      "/" +
                      data?.slug +
                      "?isEdit=true"
                    }
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MdEdit className="mr-1" size={14} />
                    Profile
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Back of Card */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 py-4 px-6 border-b border-gray-200 flex items-center text-white">
              {/* Title */}
              <h3 className="text-lg font-semibold text-white flex-grow">
                {data?.name} Benefits
              </h3>

              {/* Flip button */}
              <button
                className="p-2 text-white bg-teal-400 rounded-full hover:bg-teal-300 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFlip(e);
                }}
                aria-label="Flip card"
              >
                <MdFlip size={18} />
              </button>
            </div>

            <div className="p-4 flex-grow overflow-y-auto bg-gray-50">
              {totalBenefits > 0 ? (
                <>
                  <BenefitCategory
                    title="Health & Wellbeing"
                    data={data?.personalHealth}
                    type="PERSONAL_HEALTH"
                    icon={<FaHeartbeat className="text-teal-600" />}
                  />

                  <BenefitCategory
                    title="Team Culture"
                    data={data?.teamValues}
                    type="TEAM_VALUES"
                    icon={<FaUsers className="text-teal-600" />}
                  />

                  <BenefitCategory
                    title="Professional Development"
                    data={data?.careerGrowth}
                    type="CAREER_GROWTH"
                    icon={<FaChartLine className="text-teal-600" />}
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <div className="bg-white p-3 rounded-full shadow-md mb-3">
                    <MdInfo className="text-teal-500" size={24} />
                  </div>
                  <p className="text-gray-500 text-sm font-medium mb-2">
                    No benefits information available
                  </p>
                  <p className="text-gray-400 text-xs">
                    Check back later or visit the company profile for more
                    details
                  </p>
                </div>
              )}
            </div>

            {/* View Full Profile Button - Bottom */}
            <div className="p-3 bg-white border-t border-gray-200 shadow-inner">
              <Link
                className="flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded-md transition-colors text-sm w-full shadow-sm"
                to={RoutesConstant.USER_COMPANY + "/" + data?.slug}
              >
                View Full Profile
                <MdOutlineArrowForward className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for 3D effects */}
      <style jsx>{`
        .perspective-card {
          perspective: 1000px;
        }

        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }

        .backface-hidden {
          backface-visibility: hidden;
        }

        .rotate-y-180 {
          transform: rotateY(180deg);
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  );
}
