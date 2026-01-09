/* eslint-disable react/prop-types */
// REACT ROUTER DOM
import { useLocation, useNavigate } from "react-router-dom";

// MUI
import Drawer from "@mui/material/Drawer";

// REACT ICONS
import { IoCloseOutline } from "@react-icons/all-files/io5/IoCloseOutline";

// CUSTOM IMPORTS
import RoutesConstant from "../Constants/Routes.Constant.json";
import Images from "../Assets/index";

// IMAGE LAZY LOADING
import { LazyLoadImage } from "react-lazy-load-image-component";

const CompanyLogo = ({ closeModal }) => {
  const location = useLocation();

  // Check if the current location matches the "Home" page
  const isHomePage = location.pathname === RoutesConstant.HOME;

  return (
    <div
      className="flex items-center gap-2 cursor-pointer w-fit"
      onClick={() => closeModal()}
    >
      <LazyLoadImage
        src={Images["logoSVG"]}
        alt="Company Logo with text"
        className="w-[40px] h-[40px] rounded-lg"
      />
    </div>
  );
};

export default function SideDrawer({
  isDrawerOpen,
  setIsDrawerOpen,
  content,
  isShowLogo = false,
  handleBtn = null,
  btnText = null,
}) {
  // NAVIGATE
  const navigate = useNavigate();

  // CUSTOM FUNCTION
  const closeModal = () => {
    navigate(location.pathname);
    setIsDrawerOpen(false);
  };

  return (
    <Drawer
      anchor={"right"}
      open={isDrawerOpen}
      onClose={() => closeModal()}
      PaperProps={{
        sx: {
          width: window.innerWidth > 768 ? "900px" : "100%",
          padding: "20px",
          boxShadow:
            "0px 8px 10px -5px rgb(255 255 255 / 20%), 0px 16px 24px 2px rgb(0 0 0 / 14%), 0px 6px 30px 5px rgba(0,0,0,0.12)",
        },
      }}
    >
      <div className="flex h-12 justify-center items-center border-b-2 py-8">
        <div className="flex-grow">
          {isShowLogo ? (
            <CompanyLogo closeModal={() => closeModal()} />
          ) : (
            <h2 className="text-2xl font-semibold">Job Preview</h2>
          )}
        </div>
        <IoCloseOutline
          size={35}
          className="font-bold transition-transform transform hover:rotate-45 cursor-pointer p-1"
          onClick={() => closeModal()}
        />
      </div>

      {content}

      {handleBtn && (
        <button
          className="mt-10 w-full py-2 px-4 font-bold text-center text-white rounded-md shadow-md bg-brand-200 hover:bg-brand-600 cursor-pointer text-sm sm:text-base"
          onClick={() => {
            closeModal();
            handleBtn();
          }}
        >
          {btnText}
        </button>
      )}
    </Drawer>
  );
}
