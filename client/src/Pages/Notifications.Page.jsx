import { useEffect, useState } from "react";
import { useUser } from "../Context/User.Context";
import NotificationsService from "../Services/Notifications.Service";
import {
  IoChevronForward,
  IoTrashOutline,
  IoHeartOutline,
  IoBriefcaseOutline,
  IoSchoolOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoNotifications,
} from "react-icons/io5";
import TimeAgoFormat from "../Pipes/DateFormat.Pipe";
import { Modal } from "../Shared";

function Notifications() {
  const [unReadNotifications, setUnReadNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("unread");
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showLoadMore, setShowLoadMore] = useState({
    unread: true,
    all: true,
  });
  const [alert, setAlert] = useState(null);
  const { user } = useUser();

  // Show alert function
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  // Mark all as read function
  const markAllAsRead = async () => {
    const { data } =
      await NotificationsService.UPDATE_ALL_NOTIFICATIONS_READ_STATUS();
    if (data?.SUCCESS) {
      setUnReadNotifications(data?.DATA?.unReadNotifications);
      setReadNotifications(data?.DATA?.readNotifications);
    }
  };

  const markSingleAsRead = async (id) => {
    const { data } = await NotificationsService.UPDATE_NOTIFICATION_READ_STATUS(
      { id }
    );
    if (data?.SUCCESS) {
      setUnReadNotifications(data?.DATA?.unReadNotifications);
      setReadNotifications(data?.DATA?.readNotifications);
    }
  };

  // Delete notification function
  const deleteNotification = async (id) => {
    setDeletingId(id);
    setShowDeleteConfirm(null);
    const { data } = await NotificationsService.DELETE_NOTIFICATIONS({ id });
    if (data?.SUCCESS) {
      setReadNotifications(data?.DATA);
      setDeletingId(null);
      showAlert("success", "Notification deleted successfully");
    } else {
      setDeletingId(null);
      showAlert("error", "Failed to delete notification");
    }
  };

  const loadMoreReadNotifications = async () => {
    const isRead = activeTab === "unread" ? false : true;

    const { data } = await NotificationsService.LIST_ALL_READ_NOTIFICATIONS({
      isRead,
    });
    if (data?.SUCCESS) {
      if (isRead) {
        setReadNotifications(data?.DATA);
        setShowLoadMore((prev) => ({ ...prev, all: false }));
      } else {
        setUnReadNotifications(data?.DATA);
        setShowLoadMore((prev) => ({ ...prev, unread: false }));
      }
    }
  };

  // Update notifications when user changes
  useEffect(() => {
    setUnReadNotifications(user?.unReadNotifications || []);
    setReadNotifications(user?.readNotifications || []);
  }, [user]);

  // Get notification icon and color based on type/content
  const getNotificationStyle = (message) => {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("job") ||
      lowerMessage.includes("position") ||
      lowerMessage.includes("opportunity")
    ) {
      return {
        icon: <IoBriefcaseOutline className="h-5 w-5" />,
        bgColor: "bg-emerald-50",
        iconColor: "text-emerald-600",
        borderColor: "border-emerald-200",
      };
    } else if (
      lowerMessage.includes("course") ||
      lowerMessage.includes("training") ||
      lowerMessage.includes("certification") ||
      lowerMessage.includes("certificate") ||
      lowerMessage.includes("trained")
    ) {
      return {
        icon: <IoSchoolOutline className="h-5 w-5" />,
        bgColor: "bg-blue-50",
        iconColor: "text-blue-600",
        borderColor: "border-blue-200",
      };
    } else if (
      lowerMessage.includes("alert") ||
      lowerMessage.includes("urgent") ||
      lowerMessage.includes("important")
    ) {
      return {
        icon: <IoAlertCircleOutline className="h-5 w-5" />,
        bgColor: "bg-red-50",
        iconColor: "text-red-600",
        borderColor: "border-red-200",
      };
    } else {
      return {
        icon: <IoNotifications className="h-5 w-5" />,
        bgColor: "bg-blue-50",
        iconColor: "text-blue-600",
        borderColor: "border-blue-200",
      };
    }
  };

  return (
    <div className="notifications-panel mt-10 relative">
      {/* Global Alert */}
      {alert && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div
            className={`flex items-center p-4 rounded-lg shadow-lg border-l-4 transform transition-all duration-300 ease-in-out ${
              alert.type === "success"
                ? "bg-green-50 border-green-400 text-green-800"
                : alert.type === "error"
                ? "bg-red-50 border-red-400 text-red-800"
                : "bg-blue-50 border-blue-400 text-blue-800"
            }`}
          >
            <div className="flex-shrink-0 mr-3">
              {alert.type === "success" && (
                <IoCheckmarkCircle className="h-5 w-5 text-green-600" />
              )}
              {alert.type === "error" && (
                <IoCloseCircle className="h-5 w-5 text-red-600" />
              )}
              {alert.type === "info" && (
                <IoAlertCircleOutline className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{alert.message}</p>
            </div>
            <button
              onClick={() => setAlert(null)}
              className="ml-3 flex-shrink-0 opacity-70 hover:opacity-100"
            >
              <IoCloseCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="mt-2 w-full max-w-4xl bg-white rounded-xl shadow-lg border border-gray-100 mx-auto overflow-hidden">
        {/* Header with Healthcare Aesthetic */}
        <div className="relative bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 p-8 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-teal-200">
                  <IoHeartOutline className="h-6 w-6 text-teal-600" />
                </div>
                {unReadNotifications.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {unReadNotifications.length}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                  Your Notifications
                </h1>
                <p className="text-sm text-gray-600">
                  Stay updated with nursing opportunities and important updates
                </p>
              </div>
            </div>
            {/* Decorative medical cross pattern */}
            <div className="hidden md:block opacity-10">
              <div className="grid grid-cols-3 gap-2">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-3 h-3 text-teal-300">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-full h-full"
                    >
                      <path d="M12 2L12 10L20 10L20 14L12 14L12 22L8 22L8 14L0 14L0 10L8 10L8 2L12 2Z" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation with Medical Theme */}
        <div className="border-b border-gray-100 bg-gray-50">
          <div className="flex max-w-md mx-auto">
            <button
              onClick={() => setActiveTab("unread")}
              className={`flex-1 px-6 py-4 text-sm font-semibold border-b-3 transition-all duration-200 ${
                activeTab === "unread"
                  ? "border-teal-500 text-teal-700 bg-white shadow-sm"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>Unread</span>
                {unReadNotifications.length > 0 && (
                  <span className="bg-teal-100 text-teal-700 text-xs font-bold px-2 py-1 rounded-full">
                    {unReadNotifications.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 px-6 py-4 text-sm font-semibold border-b-3 transition-all duration-200 ${
                activeTab === "all"
                  ? "border-teal-500 text-teal-700 bg-white shadow-sm"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              All Notifications
            </button>
          </div>
        </div>

        {/* Notifications Content */}
        <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
          {(activeTab === "unread"
            ? unReadNotifications
            : [...unReadNotifications, ...readNotifications]
          ).length > 0 ? (
            <>
              {(activeTab === "unread"
                ? unReadNotifications
                : [...unReadNotifications, ...readNotifications]
              ).map((notification, index) => {
                const isUnread = unReadNotifications.some(
                  (n) => n.id === notification.id
                );
                const style = getNotificationStyle(notification.message);

                return (
                  <div key={notification.id} className="relative">
                    <div
                      className={`group hover:bg-gradient-to-r hover:from-gray-50 hover:to-teal-25 transition-all duration-200 ${
                        isUnread
                          ? "bg-gradient-to-r from-teal-25 to-cyan-25 border-l-4 border-teal-400 cursor-pointer"
                          : ""
                      }`}
                      onClick={() =>
                        isUnread && showDeleteConfirm !== notification.id
                          ? markSingleAsRead(notification.id)
                          : null
                      }
                      title={isUnread ? "Click to mark as read" : ""}
                    >
                      <div className="flex items-start p-6 space-x-4">
                        {/* Notification Icon */}
                        <div
                          className={`flex-shrink-0 w-12 h-12 rounded-full ${style.bgColor} ${style.borderColor} border-2 flex items-center justify-center shadow-sm`}
                        >
                          <div className={style.iconColor}>{style.icon}</div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p
                                className={`text-sm leading-relaxed mb-2 ${
                                  isUnread
                                    ? "text-gray-900 font-semibold"
                                    : "text-gray-700"
                                }`}
                              >
                                {notification.message}
                              </p>
                              <div className="flex items-center space-x-3">
                                <p className="text-xs text-gray-500 font-medium">
                                  {TimeAgoFormat(notification.createdAt)}
                                </p>
                                {isUnread && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
                                    New
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center ml-4 space-x-2">
                              {/* Delete button for read notifications */}
                              {activeTab === "all" && !isUnread && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDeleteConfirm(notification.id);
                                  }}
                                  disabled={deletingId === notification.id}
                                  className={`p-2 rounded-lg transition-all duration-200 ${
                                    deletingId === notification.id
                                      ? "text-gray-400 cursor-not-allowed"
                                      : "text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100"
                                  }`}
                                  title="Delete notification"
                                >
                                  <IoTrashOutline
                                    size={16}
                                    className={
                                      deletingId === notification.id
                                        ? "animate-spin"
                                        : ""
                                    }
                                  />
                                </button>
                              )}
                              <IoChevronForward className="h-4 w-4 text-gray-400 group-hover:text-teal-500 transition-colors" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Improved Delete Confirmation Modal */}
                    {showDeleteConfirm === notification.id && (
                      <Modal
                        heading={"Delete Notification"}
                        subHeading={"This action cannot be undone."}
                        onClose={(e) => {
                          e?.stopPropagation();
                          setShowDeleteConfirm(null);
                        }}
                        onBtnClick={(e) => {
                          e?.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        isLoading={deletingId === notification.id}
                        loadingText={"Deleting..."}
                        bgColor={"red"}
                        actionBtnText={"Delete"}
                      />
                    )}
                  </div>
                );
              })}

              {/* Load More Button */}
              {(showLoadMore.all && activeTab === "all") ||
              (showLoadMore.unread && activeTab === "unread") ? (
                <div className="p-6 bg-gray-50">
                  <button
                    className="w-full py-4 px-6 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    onClick={loadMoreReadNotifications}
                  >
                    Load More Notifications
                  </button>
                </div>
              ) : (
                ""
              )}
            </>
          ) : (
            <div className="py-20 px-6 text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center mb-6 shadow-lg">
                <IoHeartOutline size={32} className="text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {activeTab === "unread"
                  ? "You're All Caught Up! 🩺"
                  : "No Notifications Yet"}
              </h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                {activeTab === "unread"
                  ? "Great job staying on top of your nursing opportunities and updates. Keep up the excellent work!"
                  : "Your nursing job alerts, training updates, and important notifications will appear here to help advance your healthcare career."}
              </p>
            </div>
          )}
        </div>

        {/* Mark all as read for unread tab */}
        {activeTab === "unread" && unReadNotifications.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-teal-50 to-cyan-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {unReadNotifications.length} unread notification
                {unReadNotifications.length !== 1 ? "s" : ""}
              </p>
              <button
                onClick={markAllAsRead}
                className="text-sm text-teal-600 hover:text-teal-700 font-semibold bg-white px-4 py-2 rounded-lg hover:bg-teal-50 transition-all duration-200 shadow-sm border border-teal-200"
              >
                Mark All as Read
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
