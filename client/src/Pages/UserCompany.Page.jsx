import React, { useState, Children, useEffect, useRef } from "react";
import CompanyCard from "../Components/CompanyCard.Component";
import { useUser } from "../Context/User.Context";
import { Link } from "react-router-dom";
import routesConstant from "../Constants/Routes.Constant.json";
import UserService from "../Services/User.Service.js";
import JobsService from "../Services/Jobs.Service.js";
import CompaniesService from "../Services/Companies.Service.js";
import TimeAgoFormat from "../Pipes/DateFormat.Pipe";
import { MdDelete, MdEdit } from "react-icons/md";
import { alert } from "../Utils/AlertGlobalInterface.Util.js";
import { Modal } from "../Shared/index.js";
import PaymentService from "../Services/Payment.Service.js";
import EnumConstant from "../Constants/Enum.Constant.json";

const AVAILABLE_PAGES = [
  { key: "JOBS", label: "Edit Jobs (Able To Edit & Post Jobs)" },
  {
    key: "COMPANIES",
    label: "Edit Companies (Able To Create & Edit Companies)",
  },
  { key: "USERS", label: "Admin (Able To Do Everything)" },
];

const UserCompany = () => {
  const [activeTab, setActiveTab] = useState("JOBS");
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [managedUsersList, setManagedUsersList] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showDeleteManagedUserConfirm, setShowDeleteManagedUserConfirm] =
    useState(null);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(null);
  const { user } = useUser();
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeout = useRef();
  const [accessPages, setAccessPages] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [editUserModal, setEditUserModal] = useState({
    open: false,
    user: null,
  });
  const [editAccessPages, setEditAccessPages] = useState([]);

  const deleteJob = async (jobSlug) => {
    setDeletingId(jobSlug);
    setShowDeleteConfirm(null);
    const { data } = await JobsService.DELETE_Job({ jobSlug });
    if (data?.SUCCESS) {
      setJobs(data?.DATA);
      setDeletingId(null);
      alert.success("Job deleted successfully");
    }
  };

  const payAgain = async (job) => {
    setPaymentId(job?.slug);
    setShowPaymentConfirm(null);

    const { data } = await PaymentService.CREATE_STRIPE_CHECKOUT_SESSION({
      reqBody: {
        id: job?.id,
        name: job?.title,
        img: job?.companyImage?.url,
        slug: job?.slug,
        email: job?.email,
        type: job?.isUrgent
          ? "URGENT"
          : job?.isFeatured
          ? "FEATURED"
          : "REGULAR",
        model: "JOB",
        website: job?.website,
      },
    });

    if (data && data?.SUCCESS) {
      setPaymentId(null);
      window.open(data?.DATA?.url, "_self");
    } else {
      setPaymentId(null);
      alert.error("Something went wrong!");
    }
  };

  const reactivateJob = async (job) => {
    const { data } = await JobsService.UPDATE_JOB_STATUS({
      slug: job?.slug,
    });

    if (data && data?.SUCCESS) {
      getJobListing();
      alert.success(data?.MESSAGE);
    }
  };

  const deactivateJob = async (jobSlug) => {
    setDeletingId(jobSlug);
    setShowDeactivateConfirm(null);

    const { data } = await JobsService.DEACTIVATE_JOB({
      slug: jobSlug,
    });

    if (data && data?.SUCCESS) {
      getJobListing();
      setDeletingId(null);
      alert.success("Job deactivated successfully");
    }
  };

  const getUser = async () => {
    const { data } = await UserService.LIST_MANAGED_USERS();

    if (data?.SUCCESS) {
      setManagedUsersList(data.DATA);
    }
  };

  const deleteUser = async (id) => {
    setDeletingId(id);
    setShowDeleteManagedUserConfirm(null);

    const { data } = await UserService.DELETE_MANAGED_USER({ userId: id });

    if (data?.SUCCESS) {
      getUser();
      setDeletingId(null);
      alert.success("Moderator deleted successfully");
    }
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setShowDropdown(!!value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (value) {
      setIsSearching(true);
      searchTimeout.current = setTimeout(async () => {
        const { data } = await UserService.SEARCH_USERS(value);
        setSearchResults(data?.DATA || []);
        setIsSearching(false);
      }, 400);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const handleSelectUser = (user) => {
    setSearchInput(user.email);
    setShowDropdown(false);
    setSearchResults([]);
  };

  const handleUserSubmit = async () => {
    if (accessPages.length > 0) {
      const { data } = await UserService.CREATE_MANAGED_USER({
        reqBody: { email: searchInput, accessPages },
      });

      if (data?.SUCCESS) {
        alert.success("Invitition Sent.");
      }
    } else {
      alert.success("Please Select Access Pages.");
    }
  };

  async function getJobListing() {
    const { data } = await JobsService.LIST_JOBS_USING_USER();

    if (data && data.SUCCESS) {
      setJobs(data.DATA);
    }
  }

  useEffect(() => {
    getJobListing();

    (async function () {
      const { data } = await CompaniesService.LIST_COMPANIES_USING_USER();

      if (data && data.SUCCESS) {
        setCompanies(data.DATA);
      }
    })();

    getUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Function to handle update
  const handleUpdateUserRoles = async () => {
    if (editAccessPages.length > 0) {
      if (!editUserModal.user) return;
      const { data } = await UserService.UPDATE_MANAGED_USER_ROLES({
        userId: editUserModal.user.id,
        reqBody: {
          accessPages: editAccessPages,
        },
      });
      if (data?.SUCCESS) {
        alert.success("User roles updated.");
        setEditUserModal({ open: false, user: null });
        getUser();
      }
    } else {
      alert.success("Please Select Access Pages.");
    }
  };

  useEffect(() => {
    if (!user?.accessPages?.includes(EnumConstant?.ACCESS_PAGES.JOBS)) {
      setActiveTab(user?.accessPages[0]);
    }
  }, [user]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6 mt-6">
          <h1 className="text-2xl font-semibold">Employer Dashboard</h1>
          <Link
            to={routesConstant.USER_CREATE_JOB}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            + Post New Job
          </Link>
        </div>

        <div className="flex border-b mb-6">
          {user?.accessPages?.includes(EnumConstant?.ACCESS_PAGES.JOBS) && (
            <button
              className={`px-4 py-2 relative ${
                activeTab === "JOBS"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("JOBS")}
            >
              Posted Jobs
            </button>
          )}
          {user?.accessPages?.includes(
            EnumConstant?.ACCESS_PAGES.COMPANIES
          ) && (
            <button
              className={`px-4 py-2 relative ${
                activeTab === "COMPANIES"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("COMPANIES")}
            >
              Company Profile
            </button>
          )}
          {user?.accessPages?.includes(EnumConstant?.ACCESS_PAGES.USERS) && (
            <button
              className={`px-4 py-2 relative ${
                activeTab === "USERS"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("USERS")}
            >
              Users
            </button>
          )}
        </div>

        {activeTab === "JOBS" && (
          <div className="bg-white shadow-md rounded-md">
            {jobs.map((job, index) => (
              <div
                key={index}
                className="border-b last:border-none p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <div className="text-gray-500 text-sm flex flex-wrap gap-2 sm:gap-4">
                    <span>{job.location}</span>
                    <span>{job.employementType}</span>
                    <span>Posted on {TimeAgoFormat(job.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      job?.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {job?.active ? "Active" : "InActive"}
                  </span>
                  <div className="flex items-center gap-2">
                    {job?.active ? (
                      <>
                        <Link
                          to={routesConstant.USER_CREATE_JOB + "/" + job.slug}
                          className="w-9 h-9 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 rounded flex items-center justify-center"
                          title="Edit"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                          </svg>
                        </Link>
                        <button
                          className="w-9 h-9 bg-gray-100 text-gray-500 hover:bg-red-600 hover:text-white rounded flex items-center justify-center"
                          title="Deactivate Job"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeactivateConfirm(job.slug);
                          }}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            ></rect>
                            <line x1="8" y1="8" x2="16" y2="16"></line>
                            <line x1="16" y1="8" x2="8" y2="16"></line>
                          </svg>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="w-9 h-9 bg-gray-100 text-gray-500 hover:bg-red-600 hover:text-white rounded flex items-center justify-center"
                          title="Delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(job.slug);
                          }}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6l-1 14H6L5 6"></path>
                            <path d="M10 11v6"></path>
                            <path d="M14 11v6"></path>
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
                          </svg>
                        </button>

                        {job.createdAt &&
                        (new Date() - new Date(job.createdAt)) /
                          (1000 * 60 * 60 * 24) >
                          30 ? (
                          <button
                            className="w-9 h-9 bg-gray-100 text-gray-500 hover:bg-green-600 hover:text-white rounded flex items-center justify-center"
                            title="Pay To Active"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowPaymentConfirm(job.slug);
                            }}
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect
                                x="2"
                                y="4"
                                width="20"
                                height="16"
                                rx="2"
                                ry="2"
                              ></rect>
                              <line x1="2" y1="10" x2="22" y2="10"></line>
                              <line x1="6" y1="16" x2="6.01" y2="16"></line>
                              <line x1="10" y1="16" x2="14" y2="16"></line>
                            </svg>
                          </button>
                        ) : (
                          <button
                            className="w-9 h-9 bg-gray-100 text-gray-500 hover:bg-green-600 hover:text-white rounded flex items-center justify-center"
                            title="Activate Again"
                            onClick={(e) => {
                              e.stopPropagation();
                              reactivateJob(job);
                            }}
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="23 4 23 10 17 10" />
                              <path d="M20.49 15a9 9 0 1 1 1.41-4.23" />
                            </svg>
                            <span className="sr-only">Activate Again</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {(showDeleteConfirm === job.slug ||
                  showDeactivateConfirm === job.slug ||
                  showPaymentConfirm === job.slug) && (
                  <Modal
                    heading={
                      showPaymentConfirm
                        ? `Pay For ${job.title}`
                        : showDeleteConfirm
                        ? `Delete ${job.title}?`
                        : `Deactivate ${job.title}?`
                    }
                    subHeading={
                      showPaymentConfirm ? "" : "This action cannot be undone."
                    }
                    onClose={(e) => {
                      e?.stopPropagation();
                      setShowDeleteConfirm(null);
                      setShowDeactivateConfirm(null);
                      setShowPaymentConfirm(null);
                    }}
                    onBtnClick={(e) => {
                      e?.stopPropagation();
                      showPaymentConfirm
                        ? payAgain(job)
                        : showDeleteConfirm
                        ? deleteJob(job.slug)
                        : deactivateJob(job.slug);
                    }}
                    isLoading={
                      deletingId === job.slug || paymentId === job.slug
                    }
                    loadingText={
                      showPaymentConfirm
                        ? "Redirecting..."
                        : showDeleteConfirm
                        ? "Deleting..."
                        : "Deactivating..."
                    }
                    bgColor={showPaymentConfirm ? "green" : "red"}
                    actionBtnText={
                      showPaymentConfirm
                        ? "Pay"
                        : showDeleteConfirm
                        ? "Delete"
                        : "Deactivate"
                    }
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "COMPANIES" && (
          <div className="bg-white shadow-md rounded-md p-6">
            <div className="pb-6">
              <section className="flex flex-wrap justify-center gap-8">
                {Children.toArray(
                  companies?.map((item) => (
                    <CompanyCard data={item} isEditBtn={true} />
                  ))
                )}
              </section>
              <div className="mt-6">
                <Link
                  to={routesConstant.USER_CREATE_COMPANY}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition"
                >
                  Add Company
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === "USERS" && (
          <div className="bg-white shadow-md rounded-md p-6">
            <div className="flex w-full gap-2">
              <div className="flex flex-col w-full relative">
                <input
                  type="text"
                  className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Search users by email or name..."
                  value={searchInput}
                  onChange={handleSearchInput}
                  onFocus={() => setShowDropdown(!!searchInput)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                />
                {showDropdown && (searchResults.length > 0 || isSearching) && (
                  <div className="absolute top-full left-0 w-full bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-2 text-gray-500 text-sm">
                        Searching...
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((user) => (
                        <div
                          key={user.id}
                          className="p-2 hover:bg-blue-100 cursor-pointer text-sm"
                          onMouseDown={() => handleSelectUser(user)}
                        >
                          {user.name} ({user.email})
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-gray-500 text-sm">
                        No users found.
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div
                className="relative inline-block text-left"
                ref={dropdownRef}
              >
                {/* Toggle Button */}
                <button
                  className="border px-3 py-2 rounded-md text-sm bg-white hover:bg-gray-100 whitespace-nowrap h-full"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                >
                  Access Pages
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute z-20 right-0 mt-2 w-72 bg-white border shadow-md rounded-md">
                    <div className="p-2 max-h-60 overflow-y-auto">
                      {AVAILABLE_PAGES.map((page) => (
                        <label
                          key={page.key}
                          className="flex items-center gap-2 mb-2 text-sm cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={accessPages.includes(page.key)}
                            onChange={(e) => {
                              const updated = new Set(accessPages);
                              e.target.checked
                                ? updated.add(page.key)
                                : updated.delete(page.key);
                              setAccessPages(Array.from(updated));
                            }}
                          />
                          {page.label}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition whitespace-nowrap"
                onClick={handleUserSubmit}
              >
                Add Users
              </button>
            </div>

            <div className="mt-10">
              {managedUsersList?.map((item, index) => (
                <React.Fragment key={index}>
                  <div className="border-b last:border-none p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p>{item.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditUserModal({ open: true, user: item });
                        setEditAccessPages(item.accessPages || []);
                      }}
                      className="border p-2 rounded-sm"
                    >
                      <MdEdit color="blue" size={20} />
                    </button>
                    <button
                      onClick={() => setShowDeleteManagedUserConfirm(item.id)}
                      className="border p-2 rounded-sm"
                    >
                      <MdDelete color="red" size={20} />
                    </button>
                  </div>

                  {showDeleteManagedUserConfirm === item.id && (
                    <Modal
                      heading={`Delete Moderator ${item.name}?`}
                      subHeading={"This action cannot be undone."}
                      onClose={(e) => {
                        e?.stopPropagation();
                        setShowDeleteManagedUserConfirm(null);
                      }}
                      onBtnClick={(e) => {
                        e?.stopPropagation();
                        deleteUser(item.id);
                      }}
                      isLoading={deletingId === item.id}
                      loadingText={"Deleting..."}
                      bgColor={"red"}
                      actionBtnText={"Delete"}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {editUserModal.open && (
              <Modal
                heading={`Edit Roles for ${editUserModal.user?.name}`}
                subHeading={"Select access pages for this user."}
                onClose={() => setEditUserModal({ open: false, user: null })}
                onBtnClick={handleUpdateUserRoles}
                actionBtnText="Update"
                bgColor="green"
              >
                <div className="p-5 pt-0">
                  {AVAILABLE_PAGES.map((page) => (
                    <label
                      key={page.key}
                      className="flex items-center gap-2 mb-2 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={editAccessPages.includes(page.key)}
                        onChange={(e) => {
                          const updated = new Set(editAccessPages);
                          e.target.checked
                            ? updated.add(page.key)
                            : updated.delete(page.key);
                          setEditAccessPages(Array.from(updated));
                        }}
                      />
                      {page.label}
                    </label>
                  ))}
                </div>
              </Modal>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserCompany;
