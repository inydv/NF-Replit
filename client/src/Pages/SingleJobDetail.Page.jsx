import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { JobDetail } from "../Components";
import JobsService from "../Services/Jobs.Service.js";
import { Pin, Clock, MapPin, BriefcaseMedical } from "lucide-react";
import { alert } from "../Utils/AlertGlobalInterface.Util";
import RoutesConstant from "../Constants/Routes.Constant.json";

export default function SingleJobDetail() {
  const { slug } = useParams();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleSaveJob = async () => {
    const response = await JobsService.SAVE_JOB({ jobSlug: slug });

    if (response?.data?.SUCCESS) {
      alert.success("Job Saved Successfully!");
    } else {
      navigate(RoutesConstant.LOGINSIGNUP);
    }
  };

  useEffect(() => {
    const loadJobData = async () => {
      setLoading(true);
      try {
        const { data } = await JobsService.GET_JOB({ jobSlug: slug });
        if (data?.SUCCESS) {
          setJobData(data.DATA);
        } else {
          setJobData(null);
        }
      } catch (error) {
        setJobData(null);
      }
      setLoading(false);
    };

    if (slug) {
      loadJobData();
    }
  }, [slug]);

  useEffect(() => {
    if (jobData?.title) {
      document.title = `${jobData?.title} | NursingFront`; // Update document title dynamically
    }
  }, [jobData?.title]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Job Container */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 relative">
        <button
          onClick={handleSaveJob}
          className="flex items-center gap-1 text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 py-1 px-3 rounded-full text-sm transition-colors duration-200"
        >
          <Pin size={16} /> Save Job
        </button>

        {/* Company Logo */}
        {jobData?.companyImage?.url && (
          <div className="flex justify-center mb-6">
            <img
              src={jobData.companyImage.url}
              alt={`${jobData.companyName} Logo`}
              className="w-32 h-32 rounded-full shadow-lg ring-4 ring-blue-200"
            />
          </div>
        )}

        {/* Content */}
        {loading ? (
          <p className="text-center text-gray-600 text-lg">
            Loading job details...
          </p>
        ) : jobData ? (
          <div className="space-y-6">
            {/* Job Title and Company Name */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">
                {jobData.title}
              </h1>
              <p className="text-lg text-gray-600 mt-1 font-medium">
                {jobData.companyName}
              </p>
            </div>

            {/* Job Tags */}
            <div className="flex flex-wrap justify-center gap-2">
              {jobData?.employementType && (
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
                  <BriefcaseMedical size={12} className="text-green-500" />
                  {jobData.employementType.replace(/-/g, " ")}
                </span>
              )}
              {jobData?.jobType && (
                <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs font-medium">
                  <Clock size={12} className="text-purple-500" />
                  {jobData.jobType.replace(/-/g, " ")}
                </span>
              )}
              {jobData?.location && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                  <MapPin size={12} className="text-blue-500" />
                  {jobData.location.replace(/-/g, " ")}
                </span>
              )}
            </div>

            {/* Job Details */}
            <div>
              <JobDetail data={jobData} />
            </div>
          </div>
        ) : (
          <p className="text-center text-red-500 text-lg">
            Job details not found. Please try again later.
          </p>
        )}
      </div>
    </div>
  );
}
