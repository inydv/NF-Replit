import { useEffect, useState } from "react";
import { IoCloseOutline } from "@react-icons/all-files/io5/IoCloseOutline";
import HandleEvent from "../Pipes/HandleEvent.Pipe";

export default function PopUpModal({ onClose, children }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const lastShown = localStorage.getItem("lastModalShown");
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // Check if 24 hours have passed or it's the first visit
    if (!lastShown || now - parseInt(lastShown) > twentyFourHours) {
      setIsModalVisible(true);
      localStorage.setItem("lastModalShown", now.toString());
    }
  }, []);

  const closeModal = () => {
    setIsModalVisible(false);
    localStorage.setItem("lastModalShown", Date.now().toString());
    onClose();
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 z-50 ${
        isModalVisible ? "opacity-100 visible" : "opacity-0 invisible"
      } transition-all duration-300`}
      onClick={closeModal}
    >
      <div
        className="bg-white p-4 sm:p-6 mx-4 w-full max-w-xl md:max-w-2xl lg:max-w-3xl rounded-xl shadow-2xl transform transition-transform duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="w-6"></div> {/* Empty div for centering balance */}
          <div className="flex-grow"></div> {/* Spacer */}
          <button
            className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all duration-200 transform hover:rotate-90"
            onClick={closeModal}
            aria-label="Close"
          >
            <IoCloseOutline size={24} />
          </button>
        </div>
        <div className="modal-content overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
