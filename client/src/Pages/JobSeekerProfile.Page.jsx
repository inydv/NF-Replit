import React, { useEffect, useState } from "react";
import {
  FaUserEdit,
  FaBriefcase,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaLinkedin,
  FaBookmark,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { Pencil } from "lucide-react";
import routesConstant from "../Constants/Routes.Constant.json";
import { useUser } from "../Context/User.Context";
import UserService from "../Services/User.Service";
import { Link } from "react-router-dom";
import JobsService from "../Services/Jobs.Service";
import { alert } from "../Utils/AlertGlobalInterface.Util";
import { Modal } from "../Shared";

const MAX_IMAGE_SIZE_MB = 25;

const JobSeekerProfilePage = () => {
  const [profileData, setProfileData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [savedJobs, setSavedJobs] = useState([]);

  const [skills, setSkills] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const { user } = useUser();

  // Handle input changes
  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInputChange2 = (field, value) => {
    const keys = field.split(".");
    setProfileData((prev) => {
      let updated = { ...prev };
      let current = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        current[key] = { ...current[key] }; // ensure immutability
        current = current[key];
      }

      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleSkillInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = inputValue.trim().replace(/,$/, "");
      if (value && !skills.includes(value)) {
        setSkills([...skills, value]);
      }
      setInputValue("");
    }
  };

  const removeSkill = (indexToRemove) => {
    setSkills(skills.filter((_, index) => index !== indexToRemove));
  };

  // Handle adding new entries to nested arrays
  const handleAddNewEntry = (section) => {
    setProfileData((prev) => {
      const newEntry =
        section === "education"
          ? { degree: "", institution: "", graduationYear: "" }
          : section === "certification"
          ? {
              name: "",
              issuingOrganization: "",
              issueDate: "",
              expirationDate: "",
            }
          : {
              title: "",
              hospital: "",
              location: "",
              startDate: "",
              endDate: "",
              description: "",
            };

      return {
        ...prev,
        [section]: [...(prev[section] || []), newEntry],
      };
    });
  };

  // Update the handleNestedChange function to handle changes in nested fields
  const handleNestedChange = (section, index, field, value) => {
    setProfileData((prev) => {
      const updatedSection = [...prev[section]];
      updatedSection[index] = { ...updatedSection[index], [field]: value };
      return { ...prev, [section]: updatedSection };
    });
  };

  // Add a function to handle deleting entries
  const handleDeleteEntry = (section, index) => {
    setProfileData((prev) => {
      const updatedSection = [...prev[section]];
      updatedSection.splice(index, 1);
      return { ...prev, [section]: updatedSection };
    });
  };

  const validateAndUploadImage = async (e) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const fileSizeMB = file.size / (1024 * 1024); // Convert size to MB

        if (fileSizeMB > MAX_IMAGE_SIZE_MB) {
          alert.error(
            "Uh oh! The image you are trying to upload is too big. Please resize it so that it is under 25MB."
          );
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        );
        formData.append("timestamp", Date.now() / 1000);

        try {
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${
              import.meta.env.VITE_CLOUDINARY_NAME
            }/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          const data = await response.json();

          setPreviewLogo(data.secure_url); // Use URL for preview
          handleInputChange("image", {
            public_id: data.public_id,
            url: data.secure_url,
          }); // Store the URL
        } catch (error) {
          console.error("Cloudinary Upload Error:", error);
          alert.error("Image upload failed. Please try again.");
        }
      }
    };

    fileInput.click();
  };

  const deleteSavedJob = async (slug) => {
    setDeletingId(slug);
    setShowDeleteConfirm(null);
    const { data } = await JobsService.DELETE_SAVED_JOB({ jobSlug: slug });
    if (data?.SUCCESS) {
      getListSavedJobs();
      setDeletingId(null);
      alert.success("Notification deleted successfully");
    } else {
      setDeletingId(null);
      alert.error("Failed to delete notification");
    }
  };

  const updateUserProfile = async () => {
    const { data } = await UserService.UPDATE_PROFILE({
      reqBody: { ...profileData, skills },
    });

    if (data?.SUCCESS) {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    setSkills(user?.skills);
    setProfileData({
      about: user?.about,
      certification: user?.certification,
      education: user?.education,
      experience: user?.experience,
      image: user?.image,
      links: user?.links,
      location: user?.location,
      name: user?.name,
      phone: user?.phone,
      title: user?.title,
    });
  }, [user]);

  async function getListSavedJobs() {
    const { data } = await JobsService.LIST_SAVED_JOBS();
    if (data?.SUCCESS) {
      setSavedJobs(data?.DATA);
    } else {
      setSavedJobs([]);
    }
  }

  useEffect(() => {
    getListSavedJobs();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            {/* About section */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-50">
              <div className="p-6">
                <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
                  <span className="bg-blue-50 p-2 rounded-lg mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                  About
                </h3>
                {isEditing ? (
                  <textarea
                    defaultValue={profileData?.about}
                    className="border border-gray-200 outline-none rounded-lg px-4 py-3 w-full text-gray-700 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="Tell us about yourself, your nursing specialty, and career goals..."
                    rows={4}
                    onChange={(e) => handleInputChange("about", e.target.value)}
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">
                    {profileData?.about}
                  </p>
                )}
              </div>
            </div>

            {/* Experience section */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-50">
              <div className="p-6">
                <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
                  <span className="bg-blue-50 p-2 rounded-lg mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                  Professional Experience
                </h3>
                {profileData?.experience?.map((exp, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          className="border border-gray-200 outline-none rounded-lg px-4 py-3 w-full text-gray-700 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          placeholder="Job Title (e.g., Registered Nurse, Nurse Practitioner)"
                          value={exp.title}
                          onChange={(e) =>
                            handleNestedChange(
                              "experience",
                              index,
                              "title",
                              e.target.value
                            )
                          }
                        />
                        <div className="flex gap-2 mt-2 items-center">
                          <input
                            type="text"
                            className="border border-gray-200 outline-none rounded-lg px-4 py-3 w-full text-gray-700 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                            placeholder="Hospital or Facility Name"
                            value={exp.hospital}
                            onChange={(e) =>
                              handleNestedChange(
                                "experience",
                                index,
                                "hospital",
                                e.target.value
                              )
                            }
                          />
                          <span className="text-gray-400"> • </span>
                          <input
                            type="text"
                            className="border border-gray-200 outline-none rounded-lg px-4 py-3 w-full text-gray-700 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                            placeholder="Location"
                            value={exp.location}
                            onChange={(e) =>
                              handleNestedChange(
                                "experience",
                                index,
                                "location",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="flex gap-2 mt-2 items-center">
                          <input
                            type="text"
                            className="border border-gray-200 outline-none rounded-lg px-4 py-3 w-full text-gray-700 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                            placeholder="Start Date (MM/YYYY)"
                            value={exp.startDate}
                            onChange={(e) =>
                              handleNestedChange(
                                "experience",
                                index,
                                "startDate",
                                e.target.value
                              )
                            }
                          />
                          <span className="text-gray-400"> - </span>
                          <input
                            type="text"
                            className="border border-gray-200 outline-none rounded-lg px-4 py-3 w-full text-gray-700 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                            placeholder="End Date (MM/YYYY or Present)"
                            value={exp.endDate}
                            onChange={(e) =>
                              handleNestedChange(
                                "experience",
                                index,
                                "endDate",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <textarea
                          value={exp.description}
                          className="border border-gray-200 outline-none rounded-lg px-4 py-3 w-full text-gray-700 text-sm mt-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          placeholder="Describe your responsibilities, skills used, and accomplishments..."
                          rows={4}
                          onChange={(e) =>
                            handleNestedChange(
                              "experience",
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg px-4 py-2 text-sm mt-2 cursor-pointer transition-colors"
                            onClick={() =>
                              handleDeleteEntry("experience", index)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start">
                          <div className="h-10 w-10 flex-shrink-0 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-blue-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M12 14l9-5-9-5-9 5 9 5z" />
                              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-semibold text-blue-900">
                              {exp.title}
                            </h4>
                            <p className="text-gray-600">
                              {exp.hospital} • {exp.location}
                            </p>
                            <p className="text-sm text-blue-600 font-medium">
                              {exp.startDate} - {exp.endDate}
                            </p>
                            <p className="mt-2 text-gray-700 leading-relaxed">
                              {exp.description}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button
                    type="button"
                    className="mt-4 bg-blue-100 text-blue-700 hover:bg-blue-200 px-5 py-2 text-sm rounded-lg font-medium cursor-pointer transition-colors flex items-center"
                    onClick={() => handleAddNewEntry("experience")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add New Experience
                  </button>
                )}
              </div>
            </div>

            {/* Education section */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-50">
              <div className="p-6">
                <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
                  <span className="bg-blue-50 p-2 rounded-lg mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </span>
                  Education
                </h3>
                {profileData?.education?.map((edu, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          className="border border-gray-200 outline-none rounded-lg px-4 py-3 w-full text-gray-700 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          placeholder="Degree (e.g., BSN, MSN, DNP)"
                          value={edu.degree}
                          onChange={(e) =>
                            handleNestedChange(
                              "education",
                              index,
                              "degree",
                              e.target.value
                            )
                          }
                        />
                        <input
                          type="text"
                          className="border border-gray-200 outline-none rounded-lg px-4 py-3 w-full text-gray-700 text-sm mt-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          placeholder="University or Institution"
                          value={edu.institution}
                          onChange={(e) =>
                            handleNestedChange(
                              "education",
                              index,
                              "institution",
                              e.target.value
                            )
                          }
                        />
                        <input
                          type="text"
                          className="border border-gray-200 outline-none rounded-lg px-4 py-3 w-full text-gray-700 text-sm mt-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          placeholder="Graduation graduationYear"
                          value={edu.graduationYear}
                          onChange={(e) =>
                            handleNestedChange(
                              "education",
                              index,
                              "graduationYear",
                              e.target.value
                            )
                          }
                        />
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg px-4 py-2 text-sm mt-2 cursor-pointer transition-colors"
                            onClick={() =>
                              handleDeleteEntry("education", index)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start">
                          <div className="h-10 w-10 flex-shrink-0 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-blue-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-semibold text-blue-900">
                              {edu.degree}
                            </h4>
                            <p className="text-gray-600">{edu.institution}</p>
                            <p className="text-sm text-blue-600 font-medium">
                              Graduated: {edu.graduationYear}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {isEditing && (
                  <button
                    type="button"
                    className="mt-4 bg-blue-100 text-blue-700 hover:bg-blue-200 px-5 py-2 text-sm rounded-lg font-medium cursor-pointer transition-colors flex items-center"
                    onClick={() => handleAddNewEntry("education")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add New Education
                  </button>
                )}
              </div>
            </div>

            {/* Certifications section */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-50">
              <div className="p-6">
                <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
                  <span className="bg-blue-50 p-2 rounded-lg mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </span>
                  Licenses & Certifications
                </h3>
                {profileData?.certification?.map((cert, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          className="border border-gray-200 outline-none rounded-lg px-4 py-3 w-full text-gray-700 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          placeholder="Certification Name (e.g., RN, CNOR, CCRN)"
                          value={cert.name}
                          onChange={(e) =>
                            handleNestedChange(
                              "certification",
                              index,
                              "name",
                              e.target.value
                            )
                          }
                        />
                        <input
                          type="text"
                          className="border border-gray-200 outline-none rounded-lg px-4 py-3 w-full text-gray-700 text-sm mt-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          placeholder="Issuing Organization"
                          value={cert.issuingOrganization}
                          onChange={(e) =>
                            handleNestedChange(
                              "certification",
                              index,
                              "issuingOrganization",
                              e.target.value
                            )
                          }
                        />
                        <div className="flex gap-2 mt-2 items-center">
                          <input
                            type="text"
                            className="border border-gray-200 outline-none rounded-lg px-4 py-3 w-full text-gray-700 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                            placeholder="Issue Date"
                            value={cert.issueDate}
                            onChange={(e) =>
                              handleNestedChange(
                                "certification",
                                index,
                                "issueDate",
                                e.target.value
                              )
                            }
                          />
                          <span className="text-gray-400"> - </span>
                          <input
                            type="text"
                            className="border border-gray-200 outline-none rounded-lg px-4 py-3 w-full text-gray-700 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                            placeholder="Expiration Date"
                            value={cert.expirationDate}
                            onChange={(e) =>
                              handleNestedChange(
                                "certification",
                                index,
                                "expirationDate",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg px-4 py-2 text-sm mt-2 cursor-pointer transition-colors"
                            onClick={() =>
                              handleDeleteEntry("certification", index)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start">
                          <div className="h-10 w-10 flex-shrink-0 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-blue-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-semibold text-blue-900">
                              {cert.name}
                            </h4>
                            <p className="text-gray-600">
                              {cert.issuingOrganization}
                            </p>
                            <p className="text-sm text-blue-600 font-medium">
                              {cert.issueDate} - {cert.expirationDate}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {isEditing && (
                  <button
                    type="button"
                    className="mt-4 bg-blue-100 text-blue-700 hover:bg-blue-200 px-5 py-2 text-sm rounded-lg font-medium cursor-pointer transition-colors flex items-center"
                    onClick={() => handleAddNewEntry("certification")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add New Certification
                  </button>
                )}
              </div>
            </div>

            {/* Skills section */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-50">
              <div className="p-6">
                <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
                  <span className="bg-blue-50 p-2 rounded-lg mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </span>
                  Skills & Specialties
                </h3>
                {isEditing ? (
                  <div className="border border-gray-200 rounded-lg px-4 py-3 w-full text-gray-700 text-sm focus-within:ring-2 focus-within:ring-blue-100">
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <div
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center text-sm"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="ml-2 text-blue-500 hover:text-blue-700"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                      <input
                        type="text"
                        value={inputValue}
                        onChange={handleSkillInputChange}
                        onKeyDown={handleSkillKeyDown}
                        placeholder="Enter a skill"
                        className="outline-none flex-1 min-w-[120px]"
                      />
                    </div>
                    <p className="text-gray-500 text-xs mt-2">
                      Add your clinical skills, specializations, and technical
                      abilities.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case "saved":
        return (
          <div className="bg-white rounded-xl shadow-sm border border-blue-50">
            <div className="p-6">
              <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
                <span className="bg-blue-50 p-2 rounded-lg mr-3">
                  <FaBookmark className="text-blue-600" />
                </span>
                Saved Jobs
              </h3>
              {savedJobs?.length > 0 ? (
                <div className="space-y-4">
                  {savedJobs?.map((job, index) => (
                    <div
                      key={index}
                      className="border border-blue-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            {job?.companyImage?.url ? (
                              <img
                                src={job?.companyImage?.url}
                                alt={job?.companyName}
                                className="h-10 w-10 object-contain"
                              />
                            ) : (
                              <FaBriefcase className="text-blue-600 text-xl" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-blue-900">
                              {job?.title}
                            </h4>
                            <p className="text-gray-600 text-sm">
                              {job?.companyName}
                            </p>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <FaMapMarkerAlt className="mr-1 text-blue-500" />
                              <span>{job?.location}</span>
                              {job?.jobType && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span>{job?.jobType}</span>
                                </>
                              )}
                              {job?.salary && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span>{job?.salary}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <a
                            href={`${routesConstant.SINGLE_JOB_DETAILS_PAGE}/${job?.slug}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            target="_blank"
                          >
                            <FaExternalLinkAlt />
                          </a>
                          <button
                            className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            title="Remove from Saved Jobs"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteConfirm(job?.slug);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>

                          {/* Improved Delete Confirmation Modal */}
                          {showDeleteConfirm === job?.slug && (
                            <Modal
                              heading={"Delete Saved job"}
                              subHeading={"This action cannot be undone."}
                              onClose={(e) => {
                                e?.stopPropagation();
                                setShowDeleteConfirm(null);
                              }}
                              onBtnClick={(e) => {
                                e?.stopPropagation();
                                deleteSavedJob(job?.slug);
                              }}
                              isLoading={deletingId === job?.slug}
                              loadingText={"Deleting..."}
                              bgColor={"red"}
                              actionBtnText={"Delete"}
                            />
                          )}
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-gray-700 text-sm line-clamp-2">
                          {job?.overview}
                        </p>
                      </div>
                      <div className="mt-3 text-sm text-gray-500">
                        Saved on:{" "}
                        {new Date(job?.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-blue-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">
                    No Saved Jobs Yet
                  </h4>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Start saving jobs that interest you to build your collection
                    and apply to them later.
                  </p>
                  <Link
                    to={routesConstant.HOME}
                    className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Jobs
                  </Link>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6 bg-white rounded-xl shadow-sm border border-blue-50">
            <p className="text-gray-700">Select a tab to view content.</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header with profile picture and basic info */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-50 p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile picture */}
              <div className="relative group">
                <div className="h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden bg-blue-50 border-4 border-white shadow-sm flex items-center justify-center">
                  {previewLogo || profileData?.image?.url ? (
                    <img
                      src={previewLogo || profileData?.image?.url}
                      alt={profileData?.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-blue-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                </div>
                {isEditing && (
                  <button
                    onClick={validateAndUploadImage}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="text-white text-xs font-medium">
                      <Pencil className="h-5 w-5 mb-1 mx-auto" />
                      Change
                    </div>
                  </button>
                )}
              </div>

              {/* Basic info */}
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      className="border border-gray-200 outline-none rounded-lg px-4 py-3 w-full text-gray-800 text-xl font-semibold focus:border-blue-400 focus:ring-2 focus:ring-blue-100 mb-2"
                      placeholder="Your Name"
                      defaultValue={profileData?.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className="border border-gray-200 outline-none rounded-lg px-4 py-2 w-full text-gray-600 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 mb-2"
                      placeholder="Your Title (e.g., Registered Nurse, ICU)"
                      defaultValue={profileData?.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className="border border-gray-200 outline-none rounded-lg px-4 py-2 w-full text-gray-600 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 mb-3"
                      placeholder="Your Location"
                      defaultValue={profileData?.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                      <input
                        type="email"
                        className="border border-gray-200 outline-none rounded-lg px-4 py-2 w-full text-gray-600 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        placeholder="Email Address"
                        defaultValue={user?.email}
                        readOnly
                      />
                      <input
                        type="number"
                        className="border border-gray-200 outline-none rounded-lg px-4 py-2 w-full text-gray-600 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        placeholder="Phone Number"
                        defaultValue={profileData?.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    </div>
                    <input
                      type="url"
                      className="border border-gray-200 outline-none rounded-lg px-4 py-2 w-full text-gray-600 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      placeholder="LinkedIn Profile URL"
                      defaultValue={profileData?.links?.linkedIn}
                      onChange={(e) =>
                        handleInputChange2("links.linkedIn", e.target.value)
                      }
                    />
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-blue-900">
                      {profileData?.name}
                    </h2>
                    <p className="text-gray-600 font-medium mt-1">
                      {profileData?.title}
                    </p>
                    <p className="text-gray-500 flex items-center justify-center md:justify-start mt-1">
                      <FaMapMarkerAlt className="mr-1 text-blue-500" />
                      {profileData?.location}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-3 justify-center md:justify-start">
                      {user?.email && (
                        <a
                          href={`mailto:${user?.email}`}
                          className="flex items-center text-gray-600 hover:text-blue-700"
                        >
                          <FaEnvelope className="mr-2" />
                          <span>{user?.email}</span>
                        </a>
                      )}
                      {profileData?.phone && (
                        <a
                          href={`tel:${profileData?.phone}`}
                          className="flex items-center text-gray-600 hover:text-blue-700"
                        >
                          <FaPhone className="mr-2" />
                          <span>{profileData?.phone}</span>
                        </a>
                      )}
                      {profileData?.links?.linkedIn && (
                        <a
                          href={profileData?.links?.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-600 hover:text-blue-700"
                        >
                          <FaLinkedin className="mr-2" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Edit button */}
              <div className="mt-4 md:mt-0">
                {isEditing ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={updateUserProfile}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <FaUserEdit className="mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tabs and content */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Tabs */}
            <div className="md:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-blue-50">
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Profile Sections
                  </h3>
                  <nav className="space-y-1">
                    <button
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                        activeTab === "profile"
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={() => setActiveTab("profile")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Professional Profile
                    </button>
                    <button
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                        activeTab === "saved"
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={() => setActiveTab("saved")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                      </svg>
                      Saved Jobs
                      {savedJobs?.length > 0 && (
                        <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {savedJobs?.length}
                        </span>
                      )}
                    </button>
                  </nav>
                </div>
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1">{renderTabContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerProfilePage;
