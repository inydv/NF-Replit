import TimeAgoFormat from "../Pipes/DateFormat.Pipe";
import DigitFormat from "../Pipes/DigitFormat.Pipe";
import { LazyLoadImage } from "react-lazy-load-image-component";
import JobStructuredData from "./JobStructuredData.Component";
import {
  MapPin,
  Clock,
  Building,
  BriefcaseMedical,
  Star,
  DollarSign,
  AlertCircle,
} from "lucide-react";

export default function JobPost({ data, jobId, openJob }) {
  const isSelected = jobId === data?.id;

  const handleClick = () => {
    if (isSelected) openJob(null);
    else openJob(data?.id);
  };

  return (
    <>
      <div itemScope itemType="http://schema.org/JobPosting">
        <div
          className={`p-4 rounded-lg cursor-pointer transition-all duration-300 border ${
            isSelected
              ? "bg-[#F1F0FA] border-[#0288D1]"
              : "bg-white hover:bg-[#F1F0FA] hover:border-[#0288D1] hover:shadow-sm border-gray-200"
          }`}
          onClick={handleClick}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Logo Section */}
            <div className="md:col-span-2 flex justify-center items-center">
              {data?.companyImage?.url || data?.companyImage ? (
                <LazyLoadImage
                  src={data?.companyImage?.url || data?.companyImage}
                  alt={`${data?.companyName || "Company"} logo`}
                  className="h-16 w-16 object-contain bg-gray-50 p-1 rounded-md"
                />
              ) : (
                <div className="h-16 w-16 rounded-md flex items-center justify-center bg-[#F1F0FA] text-teal-600 font-bold text-xl">
                  {data?.companyName?.charAt(0) ||
                    data?.title?.charAt(0) ||
                    "N"}
                </div>
              )}
            </div>

            {/* Main Job Details Section */}
            <div className="md:col-span-6 space-y-2">
              {/* Company Name */}
              {data?.companyName && (
                <div className="flex items-center gap-1">
                  <Building size={14} className="text-gray-500" />
                  <a
                    href={data?.companySlug || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-teal-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {data?.companyName.split(" ").slice(0, 3).join(" ")}
                    {data?.companyName.split(" ").length > 3 ? "..." : ""}
                  </a>
                </div>
              )}

              {/* Job Title */}
              <h2 className="text-lg font-semibold text-gray-900">
                {data?.title || "Nursing Position"}
              </h2>

              {/* Tags Row */}
              <div className="flex flex-wrap gap-2">
                {/* Location */}
                {data?.location && (
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs">
                    <MapPin size={12} className="text-blue-500" />
                    {data?.location.replace(/-/g, " ")}
                  </span>
                )}

                {/* Employment type */}
                {data?.employementType && (
                  <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs">
                    <Clock size={12} className="text-purple-500" />
                    {data?.employementType.replace(/-/g, " ")}
                  </span>
                )}

                {/* Specialty/Type */}
                {data?.jobType && (
                  <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs">
                    <BriefcaseMedical size={12} className="text-green-500" />
                    {data?.jobType.replace(/-/g, " ")}
                  </span>
                )}
              </div>
            </div>

            {/* Salary Section */}
            <div className="md:col-span-2 flex items-center">
              <div className="font-medium flex items-center gap-1 text-gray-800">
                <DollarSign size={16} className="text-green-600" />
                {data?.minSalary > 0 || data?.maxSalary > 0 ? (
                  <span>
                    {data?.minSalary > 0 ? DigitFormat(data?.minSalary) : ""}
                    {data?.minSalary > 0 && data?.maxSalary > 0 ? " - " : ""}
                    {data?.maxSalary > 0
                      ? DigitFormat(data?.maxSalary)
                      : ""}{" "}
                    <span className="text-gray-600 text-sm">
                      /{data?.salaryType === "HOURLY" ? "hr" : "yr"}
                    </span>
                  </span>
                ) : (
                  <span className="text-gray-600 text-sm">
                    Contact for details
                  </span>
                )}
              </div>
            </div>

            {/* Right Section - Date and Tags */}
            <div className="md:col-span-2 flex flex-col items-end justify-center gap-2">
              {/* Urgent & Featured Markers */}
              <div className="flex flex-col gap-1 items-end">
                {data?.isFeatured && (
                  <span className="flex items-center gap-1 text-[#F97316] text-xs font-medium">
                    <Star size={14} className="fill-[#F97316] text-[#F97316]" />
                    Featured Job
                  </span>
                )}
                {data?.isUrgent && (
                  <span className="bg-[#FFC9E6] text-slate-800 py-1 px-2 rounded-md text-xs font-semibold flex items-center gap-1">
                    <AlertCircle size={12} />
                    Urgently Hiring
                  </span>
                )}
              </div>

              {/* Posted Time */}
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Clock size={12} />
                {data?.createdAt ? TimeAgoFormat(data?.createdAt) : "N/A"}
              </div>
            </div>
          </div>
        </div>
        <JobStructuredData jobs={[data]} />
      </div>
    </>
  );
}
