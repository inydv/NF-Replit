/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
// CUSTOM IMPORTS
import { Children } from "react";

export default function Features({ FEATURES, HEADING, PARAGRAPH }) {
  return (
    <>
      <h5 className="text-center">
        <span className="font-bold bg-brand-200 text-white text-sm md:text-lg sm:text-xlg px-2 sm:px-4 py-1 sm:py-2 rounded-lg border-2 border-gray-200 ">
          What We Do
        </span>
      </h5>
      <h2 className="text-xl sm:text-3xl md:text-4xl xl:text-5xl text-center my-2 sm:my-4 md:my-8 font-recoleta font-bold">
        {HEADING}
      </h2>
      <p className="text-sm md:text-base text-center">{PARAGRAPH}</p>
      <div className="flex flex-col md:flex-row mt-10 md:mt-20 gap-5 md:gap-10">
        {Children.toArray(
          FEATURES?.map(({ HEADING, ICON, TEXT }) => (
            <div className="flex-1 border-b-2 md:border-b-0 md:border-r-2 pb-5 md:pb-0 md:pr-10 last:border-b-0 last:border-r-0">
              {ICON}
              <h5 className="font-recoleta font-semibold text-base sm:text-xl mt-2 sm:mt-5 sm:mb-2 text-center md:text-start">
                {HEADING}
              </h5>
              <p className="text-gray-800 text-center md:text-start text-sm sm:text-base">
                {TEXT}
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
}
