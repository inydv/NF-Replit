/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HandleEvent from "../Pipes/HandleEvent.Pipe";
import RoutesConstant from "../Constants/Routes.Constant.json";
import DigitFormat from "../Pipes/DigitFormat.Pipe";
import { FiExternalLink } from "@react-icons/all-files/fi/FiExternalLink";
import JobsService from "../Services/Jobs.Service";
import parse from "react-html-parser";
import {
  Pin,
  Building,
  Clock,
  Calendar,
  Award,
  DollarSign,
  Share2,
  BookOpen,
} from "lucide-react";
import { alert } from "../Utils/AlertGlobalInterface.Util";

export default function JobDetail({ data, showBtn = true }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSaveJob = async () => {
    const response = await JobsService.SAVE_JOB({ jobSlug: data?.slug });

    if (response?.data?.SUCCESS) {
      alert.success("Job Saved Successfully!");
    } else {
      navigate(RoutesConstant.LOGINSIGNUP);
    }
  };

  function formatJobDescription(description) {
    if (!description) return "";

    // Remove backslashes and unnecessary escape sequences
    let cleanedDescription = description.replace(/\\[-\\]/g, "");

    // Replace bold text enclosed in ** with HTML <strong> tags
    cleanedDescription = cleanedDescription.replace(
      /\*\*(.*?)\*\*/g,
      "<br><br><strong>$1</strong><br>"
    );

    // Remove unnecessary newlines and spaces around "Job Description:"
    cleanedDescription = cleanedDescription.replace(
      /<br><br><strong>Job Description:/gi,
      "<strong>Job Description"
    );

    // Replace all asterisks (*) with bullet points
    cleanedDescription = cleanedDescription.replace(
      /(?:^|\n)\*\s?/g,
      "<br>&bull; "
    );

    // Add padding and emphasis to "Responsibilities" and "Requirements" sections
    cleanedDescription = cleanedDescription.replace(
      /Responsibilities:/gi,
      '<div style="padding: 10px 0; font-weight: bold;"><strong>Responsibilities:</strong></div>'
    );
    cleanedDescription = cleanedDescription.replace(
      /Requirements:/gi,
      '<div style="padding: 10px 0; font-weight: bold;"><strong>Requirements:</strong></div>'
    );

    // Add emphasis to "Benefits" section
    cleanedDescription = cleanedDescription.replace(
      /Benefits:/gi,
      '<div style="padding: 10px 0; font-weight: bold;"><strong>Benefits:</strong></div>'
    );

    // Normalize extra line breaks and spaces
    cleanedDescription = cleanedDescription.replace(
      /(<br\s*\/?>\s*)+/g,
      "<br>"
    ); // Replace multiple <br> with a single <br>
    cleanedDescription = cleanedDescription.replace(/\s{2,}/g, " "); // Replace multiple spaces with a single space

    // Trim leading/trailing whitespace and unnecessary HTML tags
    cleanedDescription = cleanedDescription.trim();
    cleanedDescription = cleanedDescription.replace(
      /^\s*<br>\s*|\s*<br>\s*$/g,
      ""
    );

    // Ensure headings stand out with consistent formatting
    cleanedDescription = cleanedDescription.replace(
      /(Job Description:|Responsibilities:|Requirements:|Benefits:)/gi,
      '<strong style="font-size: 16px; color: #333;">$1</strong>'
    );

    return cleanedDescription;
  }

  return (
    <>
      <div className="p-5 mx-auto max-w-4xl bg-white font-sans rounded-lg border border-gray-200">
        {/* Top Actions Bar */}
        {location.pathname === "/" && (
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleSaveJob}
              className="flex items-center gap-1 text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 py-1 px-3 rounded-full text-sm transition-colors duration-200"
            >
              <Pin size={16} /> Save Job
            </button>
            <Link
              className="flex items-center gap-1 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 py-1 px-3 rounded-full text-sm transition-colors duration-200"
              to={`${RoutesConstant.SINGLE_JOB_DETAILS_PAGE}/${data?.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => HandleEvent("Link", "Open Job in New Tab")}
            >
              <Share2 size={16} /> Open Page
            </Link>
          </div>
        )}

        {/* Header Section with Company Info */}
        <div className="flex flex-col gap-4 mb-6 border-b border-gray-200 pb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1">
              {/* Job Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {data?.title}
              </h1>

              {/* Company Name with Link */}
              {data?.companyName && location.pathname === "/" && (
                <div className="flex items-center gap-2 mb-3">
                  <Building size={18} className="text-gray-500" />
                  <a
                    href={
                      false
                        ? data?.website?.includes("?")
                          ? data?.website + "&access_from=NursingFront"
                          : data?.website + "?access_from=NursingFront"
                        : data?.website
                    }
                    onClick={() =>
                      HandleEvent("Link", "Link to Company Name in Job Detail")
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-teal-600 hover:text-teal-700 text-sm"
                  >
                    <span>{data?.companyName}</span>
                    <FiExternalLink />
                  </a>
                </div>
              )}

              {/* Location */}
              {/* {data?.job_location && (
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPin size={16} className="text-gray-500" />
                  <span>{data?.job_location.replace(/-/g, " ")}</span>
                </div>
              )} */}

              {/* Posted Date */}
              {/* {data?.created_at && (
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Clock size={14} className="text-gray-500" />
                  <span>Posted {DateFormat(data?.created_at)}</span>
                </div>
              )} */}
            </div>

            {/* Apply Button - Desktop */}
            {showBtn && (
              <div className="hidden sm:block">
                <a
                  href={
                    false
                      ? data?.website?.includes("?")
                        ? data?.website + "&access_from=NursingFront"
                        : data?.website + "?access_from=NursingFront"
                      : data?.website
                  }
                  onClick={() => HandleEvent("Link", "Link to Apply Now")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 whitespace-nowrap text-base"
                >
                  Apply Now <FiExternalLink />
                </a>
              </div>
            )}
          </div>

          {/* Apply Button - Mobile */}
          {showBtn && (
            <div className="sm:hidden">
              <a
                href={
                  false
                    ? data?.website?.includes("?")
                      ? data?.website + "&access_from=NursingFront"
                      : data?.website + "?access_from=NursingFront"
                    : data?.website
                }
                onClick={() => HandleEvent("Link", "Link to Apply Now")}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 text-base"
              >
                Apply Now <FiExternalLink />
              </a>
            </div>
          )}
        </div>

        {/* Job Details Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {data?.shift && (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={16} className="text-teal-600" />
                <p className="text-xs font-medium text-gray-600">Shift</p>
              </div>
              <h6 className="text-sm font-semibold ml-6 text-gray-800">
                {data?.shift?.replace(/-/g, " ")}
              </h6>
            </div>
          )}

          {data?.schedule && (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={16} className="text-teal-600" />
                <p className="text-xs font-medium text-gray-600">Schedule</p>
              </div>
              <h6 className="text-sm font-semibold ml-6 text-gray-800">
                {data?.schedule}
              </h6>
            </div>
          )}

          {data?.minSalary > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign size={16} className="text-teal-600" />
                <p className="text-xs font-medium text-gray-600">Pay</p>
              </div>
              <h6 className="text-sm font-semibold ml-6 text-gray-800">
                {DigitFormat(data?.minSalary)} - {DigitFormat(data?.maxSalary)}{" "}
                / {data?.salaryType === "HOURLY" ? "hr" : "yr"}
              </h6>
            </div>
          )}

          {data?.experience && (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Award size={16} className="text-teal-600" />
                <p className="text-xs font-medium text-gray-600">Experience</p>
              </div>
              <h6 className="text-sm font-semibold ml-6 text-gray-800">
                {data?.experience}
              </h6>
            </div>
          )}
        </div>

        {/* Referral Message */}
        <div className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
          <p className="text-blue-800 text-sm">
            Please mention that you found this job through{" "}
            <span className="font-bold">NursingFront</span> — it helps us grow!
          </p>
        </div>

        {/* Job Description */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={20} className="text-teal-600" />
            <h3 className="text-xl font-bold text-gray-900">About the job</h3>
          </div>

          <div className="bg-white rounded-lg text-gray-700 text-sm md:text-base prose prose-sm sm:prose-base max-w-none prose-headings:text-teal-700 prose-strong:text-gray-800">
            {parse(formatJobDescription(data?.overview))}
          </div>
        </div>
      </div>
    </>
  );
}
