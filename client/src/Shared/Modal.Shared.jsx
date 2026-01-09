function Modal({
  heading,
  subHeading,
  onClose,
  onBtnClick,
  isLoading,
  loadingText,
  bgColor,
  actionBtnText,
  children
}) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {heading}?
            </h3>
            <p className="text-sm text-gray-600">{subHeading}</p>
          </div>

          {children && <div className="modal-children">{children}</div>}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onBtnClick}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 bg-${bgColor}-600 hover:bg-${bgColor}-700 text-white rounded-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {loadingText}
                </>
              ) : (
                actionBtnText
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
