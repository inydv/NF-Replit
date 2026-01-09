import React from "react";
import { ArrowRight, CheckCircle } from "lucide-react";

const EngagementCard = ({
  title,
  mainContent,
  benefits = [],
  ctaSupportingText,
  cta,
  ctaSupportingNote,
  link,
  onClick,
  eventLabel,
}) => {
  const handleEvent = (type, description) => {
    console.log(`Event: ${type} - ${description}`);
    onClick();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl overflow-hidden transform transition-all md:max-w-xl lg:max-w-2xl">
      {/* Background gradient - works on all screen sizes */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50 opacity-50 z-0"></div>

      <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-10">
        {/* Card Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent leading-tight">
            {title}
          </h2>
          <div className="w-10 sm:w-16 md:w-20 h-1 bg-gradient-to-r from-blue-600 to-teal-500 mx-auto mt-2 rounded-full"></div>
        </div>

        {/* Main Content */}
        <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6 md:mb-8 max-w-lg mx-auto text-center">
          {mainContent}
        </p>

        {/* Benefits List */}
        <div className="mb-4 sm:mb-6 md:mb-8 text-left max-w-lg mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start mb-2 md:mb-3">
              <CheckCircle className="text-teal-500 w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
              <span className="ml-2 text-xs sm:text-sm md:text-base text-gray-700">
                {benefit}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <p className="text-xs sm:text-sm font-medium text-gray-800 mb-3 md:mb-4">
            <span className="bg-blue-100 text-blue-800 py-0.5 px-1.5 sm:py-1 sm:px-2 rounded">
              {ctaSupportingText}
            </span>
          </p>
          <div className="flex justify-center">
            <a
              href={link}


              onClick={() => HandleEvent?.("Link", eventLabel)}


              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold text-xs sm:text-sm md:text-base rounded-full shadow-md hover:from-blue-700 hover:to-teal-600 transform hover:scale-105 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:translate-y-0.5"
            >
              {cta}
              <ArrowRight className="ml-1.5 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          <p className="mt-3 md:mt-4 text-xs sm:text-xs text-gray-500 max-w-sm mx-auto">
            {ctaSupportingNote}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EngagementCard;
