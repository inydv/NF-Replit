/* eslint-disable react/prop-types */
// REACT
import { Children } from "react";

export default function ProgressStepper({ steps, currentStep }) {
  return (
    <div className="flex items-center justify-center space-x-2 p-2">
      {Children?.toArray(
        steps?.map((step, index) => (
          <div className="flex items-center text-sm space-x-2">
            <div
              className={`w-6 h-6 grid place-content-center rounded-full ${
                index < currentStep ? "bg-brand-400" : "bg-gray-200"
              }`}
            >
              <span
                className={index < currentStep ? "text-white" : "text-black"}
              >
                {index + 1}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
