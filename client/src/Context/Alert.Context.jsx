import { createContext, useCallback, useEffect, useState } from "react";
import { registerAlertFunction } from "../Utils/AlertGlobalInterface.Util";
import { MdCheckCircle, MdError, MdInfo, MdWarning } from "react-icons/md";

const iconMap = {
  success: <MdCheckCircle size={24} />,
  error: <MdError size={24} />,
  warning: <MdWarning size={24} />,
  info: <MdInfo size={24} />,
};

const bgColorMap = {
  success: "bg-green-500",
  error: "bg-red-500",
  warning: "bg-yellow-500",
  info: "bg-blue-500",
};

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  const showAlert = useCallback((type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  }, []);

  // Register the alert function globally
  useEffect(() => {
    registerAlertFunction(showAlert);
  }, [showAlert]);

  return (
    <AlertContext.Provider value={showAlert}>
      {children}
      <div
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-4 transition-all duration-500 ease-in-out ${
          alert ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
        }`}
        style={{ zIndex: 1000 }}
      >
        {alert && (
          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg text-white font-medium ${
              bgColorMap[alert.type] || "bg-gray-500"
            }`}
          >
            {iconMap[alert.type] || <MdInfo size={24} />}
            <span>{alert.message}</span>
          </div>
        )}
      </div>
    </AlertContext.Provider>
  );
};
