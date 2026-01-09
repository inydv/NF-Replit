import { useState, useEffect, useRef } from "react";
import JobFilterConstant from "../Constants/JobFilter.Constant.json";

export default function JobFilter({ setFilter, filter, handleClear, getJobs }) {
  const [dropdownState, setDropdownState] = useState({});
  const [tempFilter, setTempFilter] = useState({}); // Temporary state for selections
  const dropdownRef = useRef(null);

  // Apply selected filters
  const applyFilters = () => {
    setFilter(tempFilter);
    getJobs(tempFilter);
    setDropdownState({}); // Close all dropdowns
  };

  // Toggle dropdown visibility
  const toggleDropdown = (category) => {
    setDropdownState((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  // Update filter state for checkboxes
  const handleCheckbox = (type, value, checked) => {
    const currentValues = tempFilter[type] || [];
    setTempFilter({
      ...tempFilter,
      [type]: checked
        ? [...currentValues, value]
        : currentValues.filter((item) => item !== value),
    });
  };

  // Update filter state for salary range radio buttons
  const handleSalaryRange = (GTE, LTE) => {
    setTempFilter({
      ...tempFilter,
      salary_gte: GTE,
      salary_lte: LTE,
    });
  };

  // Clear all filters
  const handleClearAll = () => {
    setTempFilter({});
    handleClear();
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownState({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Count total applied filters
  const totalFiltersApplied = () => {
    let count = 0;
    if (tempFilter.employementType?.length)
      count += tempFilter.employementType.length;
    if (tempFilter.jobType?.length) count += tempFilter.jobType.length;
    if (tempFilter.salary_gte !== undefined) count += 1;
    return count;
  };

  // Reusable Dropdown Component
  const Dropdown = ({ label, items, filterKey, isSalaryRange = false }) => {
    const isActive = isSalaryRange
      ? tempFilter.salary_gte !== undefined &&
        tempFilter.salary_lte !== undefined
      : tempFilter[filterKey]?.length > 0;

    const displayText =
      isSalaryRange &&
      tempFilter.salary_gte !== undefined &&
      tempFilter.salary_lte !== undefined
        ? JobFilterConstant.SALARY_RANGE.find(
            ({ GTE, LTE }) =>
              GTE === tempFilter.salary_gte && LTE === tempFilter.salary_lte
          )?.NAME || label
        : `${label}${
            tempFilter[filterKey]?.length
              ? ` (${tempFilter[filterKey].length})`
              : ""
          }`;

    return (
      <div className="relative">
        <button
          onClick={() => toggleDropdown(filterKey)}
          className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-between min-w-[150px] ${
            isActive
              ? "bg-teal-100 text-teal-800 border border-teal-300 shadow-sm"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
          aria-expanded={dropdownState[filterKey]}
        >
          <span className="font-medium text-sm">{displayText}</span>
          <span
            className={`ml-2 transition-transform duration-200 ${
              dropdownState[filterKey] ? "rotate-180" : ""
            }`}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 12L2 6H14L8 12Z" fill="currentColor" />
            </svg>
          </span>
        </button>

        {dropdownState[filterKey] && (
          <div
            ref={dropdownRef}
            className="absolute top-full mt-1 left-0 z-10 bg-white border border-gray-100 rounded-lg shadow-lg w-[280px] overflow-hidden z-30"
          >
            <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100">
              <h3 className="font-medium text-gray-700">{label}</h3>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => toggleDropdown(filterKey)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="max-h-[240px] overflow-y-auto p-1">
              {items.map(({ NAME, VALUE, GTE, LTE }) => (
                <div
                  key={NAME}
                  className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <input
                    type={isSalaryRange ? "radio" : "checkbox"}
                    name={isSalaryRange ? filterKey : `${filterKey}-${NAME}`}
                    id={`${filterKey}-${NAME}`}
                    className={`${
                      isSalaryRange ? "accent-teal-600" : "accent-teal-600"
                    } w-4 h-4`}
                    onChange={(e) =>
                      isSalaryRange
                        ? handleSalaryRange(GTE, LTE)
                        : handleCheckbox(filterKey, VALUE, e.target.checked)
                    }
                    checked={
                      isSalaryRange
                        ? tempFilter.salary_gte === GTE &&
                          tempFilter.salary_lte === LTE
                        : tempFilter[filterKey]?.includes(VALUE)
                    }
                  />
                  <label
                    htmlFor={`${filterKey}-${NAME}`}
                    className="ml-2 text-gray-700 text-sm cursor-pointer w-full"
                  >
                    {NAME}
                  </label>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 border-t border-gray-100">
              {isSalaryRange && tempFilter.salary_gte !== undefined && (
                <button
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() =>
                    setTempFilter((prev) => ({
                      ...prev,
                      salary_gte: undefined,
                      salary_lte: undefined,
                    }))
                  }
                >
                  Clear
                </button>
              )}
              {!isSalaryRange && tempFilter[filterKey]?.length > 0 && (
                <button
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() =>
                    setTempFilter((prev) => ({
                      ...prev,
                      [filterKey]: [],
                    }))
                  }
                >
                  Clear
                </button>
              )}
              <button
                className="px-4 py-1.5 text-xs font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors"
                onClick={applyFilters}
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-teal-600">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 4H21V8H3V4Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 8V20H19V8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 12H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 16H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h2 className="text-lg font-semibold text-gray-800">
            Filter Nursing Jobs
          </h2>
        </div>

        {totalFiltersApplied() > 0 && (
          <div className="ml-auto flex items-center">
            <div className="bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded-full font-medium">
              {totalFiltersApplied()}{" "}
              {totalFiltersApplied() === 1 ? "filter" : "filters"} applied
            </div>
            <button
              onClick={handleClearAll}
              className="ml-3 text-sm text-red-500 hover:text-red-700 transition-colors font-medium flex items-center"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1"
              >
                <path
                  d="M19 7L5 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M17 11L7 11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M15 15L9 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Clear All
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Dropdown
          label="Employment Type"
          items={JobFilterConstant.EMPLOYMENT_TYPE}
          filterKey="employementType"
        />

        <Dropdown
          label="Salary Range"
          items={JobFilterConstant.SALARY_RANGE}
          filterKey="salaryRange"
          isSalaryRange
        />

        <Dropdown
          label="Job Type"
          items={JobFilterConstant.JOB_TYPE}
          filterKey="jobType"
        />

        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg shadow-sm hover:bg-teal-700 transition-colors text-sm font-medium ml-auto flex items-center"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1"
          >
            <path
              d="M21 8L13 8M9 8L3 8M21 16H15M11 16H3M9 12H3M21 12H13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M13 11C13 12.1046 11.8807 13 10.5 13C9.11929 13 8 12.1046 8 11C8 9.89543 9.11929 9 10.5 9C11.8807 9 13 9.89543 13 11Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M13 19C13 20.1046 11.8807 21 10.5 21C9.11929 21 8 20.1046 8 19C8 17.8954 9.11929 17 10.5 17C11.8807 17 13 17.8954 13 19Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M21 3C21 4.10457 19.8807 5 18.5 5C17.1193 5 16 4.10457 16 3C16 1.89543 17.1193 1 18.5 1C19.8807 1 21 1.89543 21 3Z"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          Apply Filters
        </button>
      </div>
    </div>
  );
}
