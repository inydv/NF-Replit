/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import { IoMenu } from "@react-icons/all-files/io5/IoMenu";
import RoutesConstant from "../Constants/Routes.Constant.json";
import Images from "../Assets/index";
import { SideDrawer } from "../Shared/index";
import HandleEvent from "../Pipes/HandleEvent.Pipe";
import { LazyLoadImage } from "react-lazy-load-image-component";

// Navigation Menu Items
const MENU_ITEMS = [
  { route: RoutesConstant.BLOGS, name: "NursingFront Blogs" },
  { route: RoutesConstant.ABOUT, name: "About NursingFront" },
];

// Desktop Navigation Menu
const LinkMenus = ({ setIsDrawerOpen }) => (
  <ul className="list-none flex items-center gap-6">
    {MENU_ITEMS.map(({ name, route }) => (
      <li key={name}>
        <Link
          onClick={() => {
            setIsDrawerOpen(false);
            HandleEvent("Link", `Link to ${name} page`);
          }}
          to={route}
          className="p-2 text-white hover:text-brand-200 transition-colors"
        >
          {name}
        </Link>
      </li>
    ))}
  </ul>
);

// Post Job Button
const ButtonMenus = ({ setIsDrawerOpen }) => (
  <div className="flex items-center">
    <Link
      onClick={() => {
        setIsDrawerOpen(false);
        HandleEvent("Link", `Link to Post Job page`);
      }}
      to={RoutesConstant.POST_QUICK_JOB}
      className="bg-white text-brand-600 hover:bg-brand-600 hover:text-white 
                 px-5 py-2 rounded-lg font-semibold transition-all duration-200"
    >
      Post a Job
    </Link>
  </div>
);

// Mobile Menu Component
const MobileMenu = ({ setIsDrawerOpen }) => (
  <div className="flex flex-col gap-6 items-center">
    <LinkMenus setIsDrawerOpen={setIsDrawerOpen} />
    <ButtonMenus setIsDrawerOpen={setIsDrawerOpen} />
  </div>
);

// Employer Header Component
export default function EmployerHeader() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <header className="w-full fixed top-0 z-50 bg-brand-500 text-white shadow-lg">
      <div className="px-4 py-3 md:py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-6">
            <Link to={RoutesConstant.HOME}>
              <LazyLoadImage
                src={Images["Logo2"]}
                alt="NursingFront Logo"
                className="h-10 sm:h-12 w-auto rounded-lg"
              />
            </Link>
            <nav className="hidden md:block">
              <LinkMenus setIsDrawerOpen={setIsDrawerOpen} />
            </nav>
          </div>

          {/* Post Job Button (Desktop) */}
          <div className="hidden md:block">
            <ButtonMenus setIsDrawerOpen={setIsDrawerOpen} />
          </div>

          {/* Mobile Menu Icon */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsDrawerOpen(true)}
          >
            <IoMenu size={30} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <SideDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        content={<MobileMenu setIsDrawerOpen={setIsDrawerOpen} />}
        isShowLogo={true}
      />
    </header>
  );
}
