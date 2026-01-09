import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  IoMenu,
  IoClose,
  IoChevronDown,
  IoChevronUp,
  IoNotifications,
  IoNotificationsOutline,
} from "react-icons/io5";
import { LazyLoadImage } from "react-lazy-load-image-component";
import SEO from "../Components/SEO.Component";
import RoutesConstant from "../Constants/Routes.Constant.json";
import Images from "../Assets/index";
import { SideDrawer } from "../Shared/index";
import HandleEvent from "../Pipes/HandleEvent.Pipe";
import {
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa6";
import AuthService from "../Services/Auth.Service";
import { useUser } from "../Context/User.Context";
import NotificationsService from "../Services/Notifications.Service";
import TimeAgoFormat from "../Pipes/DateFormat.Pipe";
import { generateImageAlt } from "../Utils/SEOHelpers.Util";
import EnumConstant from "../Constants/Enum.Constant.json";

// Custom hook for dropdown management
const useDropdown = (onClose) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    if (onClose) onClose();
  }, [onClose]);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, close]);

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, close]);

  return {
    isOpen,
    toggle,
    close,
    open,
    dropdownRef,
  };
};

// SEO JSON-LD Structured Data
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SiteNavigationElement",
  name: "NursingFront Navigation",
  url: "https://nursingfront.com",
  potentialAction: [
    {
      "@type": "SearchAction",
      target: "https://nursingfront.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  ],
};

// Simplified Navigation Menu Items
const MENU_ITEMS = [
  {
    route: RoutesConstant.BLOGS,
    name: "Blogs",
    icon: "📝",
  },
  {
    route: RoutesConstant.ABOUT,
    name: "About",
    icon: "ℹ️",
  },
  // Uncomment and modify as needed
  // {
  //   name: "Resources",
  //   icon: "📚",
  //   hasSubmenu: true,
  //   submenu: [
  //     { route: RoutesConstant.SALARY_GUIDE, name: "Salary Guide" },
  //     { route: RoutesConstant.CAREER_TIPS, name: "Career Tips" },
  //     { route: RoutesConstant.LICENSURE, name: "Licensure Info" },
  //   ],
  // },
];

// Simplified Navigation Menu Component
const NavLinks = ({ setIsDrawerOpen, isMobile = false }) => {
  const { pathname } = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // Toggle submenu, close others if open
  const toggleSubmenu = (index) => {
    setOpenSubmenu((prevIndex) => (prevIndex === index ? null : index));
  };

  // Close submenu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".submenu-container")) {
        setOpenSubmenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <ul
      className={`list-none ${
        isMobile
          ? "flex-col w-full space-y-1"
          : "flex-row items-center space-x-6"
      } flex`}
    >
      {MENU_ITEMS.map((item, index) => (
        <li
          key={index}
          className={`${isMobile ? "w-full" : "relative submenu-container"}`}
        >
          {item.hasSubmenu ? (
            <div className="w-full">
              <button
                onClick={() => toggleSubmenu(index)}
                className={`flex items-center justify-between w-full ${
                  isMobile
                    ? "p-4 text-left bg-gray-50 rounded-xl"
                    : "p-2 hover:text-brand-600"
                } transition duration-200 text-gray-700 font-medium`}
              >
                <span className="flex items-center">
                  {isMobile && item.icon && (
                    <span className="mr-3 text-brand-600">{item.icon}</span>
                  )}
                  {item.name}
                </span>
                {openSubmenu === index ? (
                  <IoChevronUp className="text-brand-600" />
                ) : (
                  <IoChevronDown />
                )}
              </button>

              {/* Submenu */}
              <div
                className={`$
                  {isMobile
                    ? "mt-1 ml-4 space-y-1"
                    : "absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-lg z-20 border border-gray-100"
                } 
                  ${openSubmenu === index ? "block" : "hidden"}
                `}
              >
                {item.submenu.map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    to={subItem.route}
                    onClick={() => {
                      setIsDrawerOpen(false);
                      HandleEvent?.("Link", `Navigated to ${subItem.name}`);
                    }}
                    className={`block ${
                      isMobile
                        ? "p-3 rounded-lg bg-white my-1"
                        : "p-3 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl"
                    } 
                      text-gray-700 hover:text-brand-600 transition-colors ${
                        pathname === subItem.route
                          ? "text-brand-600 font-medium"
                          : ""
                      }`}
                  >
                    {subItem.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link
              to={item.route}
              onClick={() => {
                setIsDrawerOpen(false);
                HandleEvent?.("Link", `Navigated to ${item.name}`);
              }}
              className={`block ${
                isMobile ? "p-4 bg-gray-50 rounded-xl" : "p-2"
              } 
                hover:text-brand-600 transition duration-200
                ${
                  pathname === item.route
                    ? "text-brand-600 font-bold"
                    : "text-gray-700"
                } 
                ${isMobile ? "flex items-center" : ""}`}
            >
              {isMobile && item.icon && (
                <span className="mr-3 text-brand-600">{item.icon}</span>
              )}
              {item.name}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
};

// NotificationBell Component with Improved Dropdown Management
const NotificationBell = () => {
  const [unReadNotifications, setUnReadNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("unread");
  const { user } = useUser();

  const notificationDropdown = useDropdown();

  // Mark all as read function
  const markAllAsRead = async () => {
    try {
      const { data } =
        await NotificationsService.UPDATE_ALL_NOTIFICATIONS_READ_STATUS();
      if (data?.SUCCESS) {
        setUnReadNotifications(data?.DATA?.unReadNotifications || []);
        setReadNotifications(data?.DATA?.readNotifications || []);
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // Update notifications when user changes
  useEffect(() => {
    setUnReadNotifications(user?.unReadNotifications || []);
    setReadNotifications(user?.readNotifications || []);
  }, [user]);

  // Handle notification click to close dropdown
  const handleNotificationClick = useCallback(() => {
    notificationDropdown.close();
  }, [notificationDropdown]);

  return (
    <div className="relative" ref={notificationDropdown.dropdownRef}>
      <button
        onClick={notificationDropdown.toggle}
        className="p-2 text-gray-700 hover:text-brand-600 hover:bg-gray-50 rounded-full transition relative"
        aria-label="Notifications"
        aria-expanded={notificationDropdown.isOpen}
        aria-haspopup="true"
      >
        {unReadNotifications.length > 0 ? (
          <>
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-xs text-white font-medium">
              {unReadNotifications.length}
            </span>
            <IoNotifications size={22} className="text-brand-600" />
          </>
        ) : (
          <IoNotificationsOutline size={22} />
        )}
      </button>

      {notificationDropdown.isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg z-50 border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gradient-to-r from-brand-50 to-white">
            <div className="flex items-center space-x-2">
              <IoNotifications className="text-brand-600" size={18} />
              <h3 className="font-semibold text-gray-800">Notifications</h3>
            </div>
            {unReadNotifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center"
              >
                <span>Mark all as read</span>
              </button>
            )}
          </div>

          {/* Tabs Toggle */}
          <div className="flex items-center justify-center border-b border-gray-100 p-2">
            <div className="bg-gray-100 p-1 rounded-lg flex w-full shadow-sm">
              <button
                onClick={() => setActiveTab("unread")}
                className={`flex-1 flex items-center justify-center py-2 px-4 text-sm rounded-md transition ${
                  activeTab === "unread"
                    ? "bg-white text-brand-600 font-medium shadow-sm"
                    : "text-gray-600 hover:text-gray-700"
                }`}
              >
                <span>Unread</span>
                {unReadNotifications.length > 0 && (
                  <span className="ml-2 bg-brand-600 text-white text-xs font-medium min-w-5 h-5 flex items-center justify-center px-1.5 rounded-full">
                    {unReadNotifications.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("read")}
                className={`flex-1 flex items-center justify-center py-2 px-4 text-sm rounded-md transition ${
                  activeTab === "read"
                    ? "bg-white text-brand-600 font-medium shadow-sm"
                    : "text-gray-600 hover:text-gray-700"
                }`}
              >
                <span>Read</span>
              </button>
            </div>
          </div>

          {/* Notifications Content */}
          <div className="max-h-96 overflow-y-auto">
            {(activeTab === "unread" ? unReadNotifications : readNotifications)
              .length > 0 ? (
              <ul className="divide-y divide-gray-100 list-none">
                {(activeTab === "unread"
                  ? unReadNotifications
                  : readNotifications
                ).map((notification) => (
                  <li
                    key={notification.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <div className="p-4 flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1">
                        <div
                          className={`h-8 w-8 rounded-full ${
                            activeTab === "unread"
                              ? "bg-brand-100"
                              : "bg-gray-100"
                          } flex items-center justify-center`}
                        >
                          <IoNotifications
                            className={`h-4 w-4 ${
                              activeTab === "unread"
                                ? "text-brand-600"
                                : "text-gray-500"
                            }`}
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm ${
                            activeTab === "unread"
                              ? "text-gray-800 font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <div className="flex items-center mt-1">
                          <p className="text-xs text-gray-500">
                            {TimeAgoFormat?.(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-12 px-4 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <IoNotificationsOutline size={24} className="text-gray-400" />
                </div>
                <h3 className="text-gray-700 font-medium mb-1">
                  {activeTab === "unread"
                    ? "All caught up!"
                    : "No read notifications"}
                </h3>
                <p className="text-sm text-gray-500">
                  {activeTab === "unread"
                    ? "You have no unread notifications"
                    : "Your read notifications will appear here"}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 flex justify-center bg-gray-50">
            <Link
              to={RoutesConstant.NOTIFICATIONS}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center"
              onClick={handleNotificationClick}
            >
              View all notifications
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// User Profile Component with Improved Dropdown Management
const UserProfile = ({ user, isMobile }) => {
  const { setUser } = useUser();

  const profileDropdown = useDropdown();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { data } = await AuthService.LOGOUT();
      if (data?.SUCCESS) {
        setUser(null);
        profileDropdown.close();
        navigate(RoutesConstant.HOME);
      }
    } catch (error) {
      console.error("Logout error:", error);
      profileDropdown.close();
    }
  };

  const handleMenuItemClick = useCallback(() => {
    profileDropdown.close();
  }, [profileDropdown]);

  return (
    <div
      className={`${isMobile ? "w-full" : "relative"}`}
      ref={profileDropdown.dropdownRef}
    >
      <button
        onClick={profileDropdown.toggle}
        className={`
          ${isMobile ? "w-full justify-between" : ""}
          flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition
        `}
        aria-expanded={profileDropdown.isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center">
          {user?.image?.url ? (
            <img
              className="h-8 w-8 rounded-full border object-cover"
              src={user?.image?.url}
              alt={generateImageAlt("userProfile", "User profile image")}
            />
          ) : (
            <div className="h-8 w-8 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0) || "U"}
            </div>
          )}
          {!isMobile && (
            <span className="ml-2 font-medium text-gray-700">
              {user?.name || "User"}
            </span>
          )}
        </div>
        {isMobile && (
          <span className="font-medium text-gray-700">
            {user?.name || "User"}
          </span>
        )}
        <IoChevronDown
          className={`${
            profileDropdown.isOpen ? "rotate-180" : ""
          } transition-transform duration-200`}
        />
      </button>

      {profileDropdown.isOpen && (
        <div
          className={`
          bg-white rounded-xl shadow-lg z-50 overflow-hidden border border-gray-100
          ${isMobile ? "mt-2 w-full" : "absolute right-0 mt-2 w-56"}
        `}
        >
          <div className="p-4 border-b border-gray-100">
            <p className="font-bold text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          {(user?.role === "RECRUITER" || user?.role === "MASTER") && (
            <>
              <Link
                to={RoutesConstant.USER_COMPANY}
                onClick={handleMenuItemClick}
                className="block w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700"
              >
                Company Profile
              </Link>
              {user?.accessPages?.includes(EnumConstant?.ACCESS_PAGES.JOBS) && (
                <Link
                  to={RoutesConstant.USER_CREATE_JOB}
                  onClick={handleMenuItemClick}
                  className="block w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700"
                >
                  Post a Job
                </Link>
              )}
            </>
          )}

          <Link
            to={RoutesConstant.JOBSEEKERPROFILEPAGE + "/" + user?.name}
            onClick={handleMenuItemClick}
            className="block w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700"
          >
            My Profile
          </Link>

          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-3 hover:bg-gray-50 text-red-600 font-medium border-t border-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

// Action Buttons Component
const ActionButtons = ({ setIsDrawerOpen, isMobile = false }) => {
  const { user } = useUser();

  return (
    <div
      className={`flex ${
        isMobile ? "flex-col w-full space-y-3" : "items-center space-x-3"
      }`}
    >
      {user ? (
        <>
          {!isMobile && <NotificationBell />}
          <UserProfile user={user} isMobile={isMobile} />
        </>
      ) : (
        <>
          <Link
            to={RoutesConstant.POST_QUICK_JOB}
            onClick={() => {
              setIsDrawerOpen(false);
              HandleEvent?.("Link", "Navigated to Post Job");
            }}
            className={`
              ${isMobile ? "w-full" : ""} 
              bg-gray-100 text-gray-800 px-5 py-2.5 rounded-lg font-medium 
              hover:bg-gray-200 transition flex items-center justify-center
            `}
          >
            Post a Job
          </Link>

          <Link
            to={RoutesConstant.LOGINSIGNUP}
            onClick={() => {
              setIsDrawerOpen(false);
            }}
            className={`
              ${isMobile ? "w-full" : ""} 
              bg-brand-600 text-white px-5 py-2.5 rounded-lg font-medium 
              hover:bg-brand-700 transition flex items-center justify-center
            `}
          >
            Login / Sign Up
          </Link>
        </>
      )}
    </div>
  );
};

// / Mobile Notifications Component with Modern UI and Toggle
const MobileNotifications = () => {
  const [unReadNotifications, setUnReadNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("unread");
  const { user } = useUser();

  const markAllAsRead = async () => {
    const { data } =
      await NotificationsService.UPDATE_ALL_NOTIFICATIONS_READ_STATUS();
    if (data?.SUCCESS) {
      setUnReadNotifications(data?.DATA?.unReadNotifications);
      setReadNotifications(data?.DATA?.readNotifications);
    }
  };

  useEffect(() => {
    setUnReadNotifications(user?.unReadNotifications || []);
    setReadNotifications(user?.readNotifications || []);
  }, [user]);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <IoNotifications className="text-brand-600 mr-2" size={16} />
          <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
        </div>
        {unReadNotifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-brand-600 hover:text-brand-700 font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Tabs Toggle */}
      <div className="flex items-center justify-center mb-4">
        <div className="bg-gray-100 p-1 rounded-lg flex w-full shadow-sm">
          <button
            onClick={() => setActiveTab("unread")}
            className={`flex-1 flex items-center justify-center py-2 px-3 text-sm rounded-md transition ${
              activeTab === "unread"
                ? "bg-white text-brand-600 font-medium shadow-sm"
                : "text-gray-600 hover:text-gray-700"
            }`}
          >
            <span>Unread</span>
            {unReadNotifications.length > 0 && (
              <span className="ml-2 bg-brand-600 text-white text-xs font-medium min-w-5 h-5 flex items-center justify-center px-1.5 rounded-full">
                {unReadNotifications.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("read")}
            className={`flex-1 flex items-center justify-center py-2 px-3 text-sm rounded-md transition ${
              activeTab === "read"
                ? "bg-white text-brand-600 font-medium shadow-sm"
                : "text-gray-600 hover:text-gray-700"
            }`}
          >
            <span>Read</span>
          </button>
        </div>
      </div>

      {(activeTab === "unread" ? unReadNotifications : readNotifications)
        .length > 0 ? (
        <div className="space-y-3">
          {(activeTab === "unread"
            ? unReadNotifications
            : readNotifications
          ).map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-xl bg-white border ${
                activeTab === "unread"
                  ? "border-gray-200 shadow-sm relative overflow-hidden"
                  : "border-gray-100"
              }`}
            >
              {activeTab === "unread" && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-600"></div>
              )}
              <div className={activeTab === "unread" ? "ml-2" : ""}>
                <p
                  className={`text-sm ${
                    activeTab === "unread" ? "text-gray-800" : "text-gray-700"
                  }`}
                >
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {TimeAgoFormat(notification.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 px-4 text-center bg-white rounded-xl border border-gray-200">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <IoNotificationsOutline size={24} className="text-gray-400" />
          </div>
          <h3 className="text-gray-700 font-medium">
            {activeTab === "unread"
              ? "All caught up!"
              : "No read notifications"}
          </h3>
          <p className="text-sm text-gray-500">
            {activeTab === "unread"
              ? "You have no unread notifications"
              : "Your read notifications will appear here"}
          </p>
        </div>
      )}

      <Link
        to={RoutesConstant.NOTIFICATIONS}
        className="block text-center text-sm text-brand-600 hover:text-brand-700 font-medium mt-4 py-2 border border-brand-100 rounded-lg bg-brand-50 hover:bg-brand-100 transition"
      >
        View all notifications
      </Link>
    </div>
  );
};

// Redesigned Mobile Menu
const MobileMenu = ({ setIsDrawerOpen }) => {
  const { user } = useUser();

  return (
    <div className="flex flex-col h-full">
      {user && (
        <div className="p-6 border-b border-gray-200">
          <UserProfile user={user} isMobile={true} />
        </div>
      )}

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Menu
          </h3>
          <NavLinks setIsDrawerOpen={setIsDrawerOpen} isMobile={true} />
        </div>

        {user && <MobileNotifications />}

        {!user && (
          <div className="mb-6 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Account
            </h3>
            <ActionButtons setIsDrawerOpen={setIsDrawerOpen} isMobile={true} />
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-200">
        <div className="text-sm text-gray-600 mb-4">
          Connect with NursingFront:
        </div>
        <div className="flex items-center space-x-5">
          <a
            href={RoutesConstant.FACEBOOK}
            className="text-gray-600 hover:text-brand-600 p-2 hover:bg-gray-100 rounded-full transition"
            aria-label="Facebook"
          >
            <FaFacebookF size={18} />
          </a>
          <a
            href={RoutesConstant.X}
            className="text-gray-600 hover:text-brand-600 p-2 hover:bg-gray-100 rounded-full transition"
            aria-label="Twitter"
          >
            <FaXTwitter size={18} />
          </a>
          <a
            href={RoutesConstant.LINKEDIN}
            className="text-gray-600 hover:text-brand-600 p-2 hover:bg-gray-100 rounded-full transition"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn size={18} />
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-brand-600 p-2 hover:bg-gray-100 rounded-full transition"
            aria-label="Instagram"
          >
            <FaInstagram size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* SEO Metadata */}
      <SEO structuredData={structuredData} />

      {/* Main Header */}
      <header
        className={`bg-white fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled ? "shadow-lg py-2" : "py-3 border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo with animation */}
            <Link
              to={RoutesConstant.HOME}
              className="transition-transform duration-300 hover:opacity-90"
            >
              <LazyLoadImage
                src={Images["logoSVG"]}
                alt={generateImageAlt("logoSVG", "NursingFront Logo")}
                className="h-10 sm:h-11 w-auto"
                effect="opacity"
              />
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden md:block">
              <NavLinks setIsDrawerOpen={setIsDrawerOpen} />
            </nav>
          </div>

          {/* Actions Menu */}
          <div className="flex items-center gap-2">
            {/* Desktop Actions */}
            <div className="hidden md:block">
              <ActionButtons setIsDrawerOpen={setIsDrawerOpen} />
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 ml-1 text-gray-700 hover:bg-gray-100 rounded-full transition"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open menu"
            >
              <IoMenu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <SideDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        content={<MobileMenu setIsDrawerOpen={setIsDrawerOpen} />}
        isShowLogo={true}
        drawerWidth="85%"
      />
    </>
  );
}
