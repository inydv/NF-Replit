/* eslint-disable react/prop-types */
// REACT ROUTER DOM
import { Link } from "react-router-dom";

// CUSTOM IMPORT
import { Children, useEffect, useState } from "react";

// REACT ICONS
import { IoBagHandleSharp } from "@react-icons/all-files/io5/IoBagHandleSharp";
import { RiUserSearchFill } from "@react-icons/all-files/ri/RiUserSearchFill";

// IMAGE LAZY LOADING
import { LazyLoadImage } from "react-lazy-load-image-component";

// CUSTOM IMPORTS
import HandleEvent from "../Pipes/HandleEvent.Pipe";
import { generateImageAlt } from "../Utils/SEOHelpers.Util";

export default function Banner({
  BANNER_IMAGES,
  heading,
  paragraph,
  btnText,
  btnHref,
}) {
  // STATES
  const [slideIndex, setSlideIndex] = useState(0);

  // USE EFFECT
  useEffect(() => {
    const time = setTimeout(() => {
      slideIndex === BANNER_IMAGES?.length - 1
        ? setSlideIndex(0)
        : setSlideIndex(slideIndex + 1);
    }, 3000);
    return () => clearInterval(time);
  });

  return (
    <div className="px-4 bg-white pt-5 sm:pt-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-10 flex-col sm:flex-row">
        {/* Left Section */}
        <div className="text-center sm:text-start">
          <h2
            className="text-xl sm:text-3xl md:text-4xl xl:text-5xl font-bold leading-tight whitespace-nowrap"
            dangerouslySetInnerHTML={{ __html: heading }}
          ></h2>
          <p className="text-sm sm:text-base md:text-xl mt-3 md:mt-8 mb-3 sm:mb-5 md:mb-10">
            {paragraph}
          </p>
          <div className="flex justify-center sm:justify-start">
            <Link
              onClick={() => {
                HandleEvent("Link", `Click on ${btnText} Button`);
              }}
              to={btnHref}
              className="bg-brand-400 hover:bg-brand-600 text-white rounded-lg py-2 sm:py-3 px-3 sm:px-6 text-xs sm:text-sm md:text-base"
            >
              {btnText}
            </Link>
          </div>
        </div>

        {/* Right Section with Banner */}
        <div className="relative grid place-items-center">
          <div className="relative h-[300px] w-[300px] md:h-[450px] md:w-[450px] lg:h-[600px] lg:w-[600px] xl:h-[700px] xl:w-[700px] aspect-square flex justify-center items-end overflow-hidden">
            <div className="bg-gradient-to-b from-[#DCDAEF] to-transparent h-[75%] w-[75%] rounded-full translate-y-[-10]"></div>
            <div className="bg-gradient-to-b from-[#e9e7f7] to-transparent h-[65%] w-[65%] rounded-full absolute bottom-4 md:bottom-6 lg:bottom-8 translate-y-[-10]"></div>

            {Children.toArray(
              BANNER_IMAGES?.map((item, index) => (
                <LazyLoadImage
                  src={item}
                  alt={generateImageAlt(`banner-${index}`, "NursingFront hero banner showcasing nursing opportunities")}
                  className={`h-full w-full absolute bottom-0 ${
                    index === slideIndex ? "block" : "hidden"
                  }`}
                />
              ))
            )}
          </div>

          {/* Icons positioned with consistent spacing */}
          <div className="absolute inset-0 flex justify-between items-center px-4 sm:px-8 md:px-12 lg:px-16">
            <RiUserSearchFill
              className="bg-[#F38850] rounded-md p-1 sm:p-2 lg:p-3 -rotate-45"
              size="clamp(30px, 5vw, 50px)" // Adjust size responsively using CSS clamp
              color="white"
            />
            <IoBagHandleSharp
              className="bg-[#2A8176] rounded-full p-1 sm:p-2 lg:p-3 rotate-12"
              size="clamp(30px, 5vw, 50px)" // Adjust size responsively using CSS clamp
              color="white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}