// REACT
import { Children } from "react";
import { Link } from "react-router-dom";

// REACT ICONS
import { FaTwitter } from "@react-icons/all-files/fa/FaTwitter";
import { FaLinkedinIn } from "@react-icons/all-files/fa/FaLinkedinIn";
import { FaFacebook } from "@react-icons/all-files/fa/FaFacebook";

// CUSTOM IMPORTS
import RoutesConstant from "../Constants/Routes.Constant.json";
import Images from "../Assets/index";

// IMAGE LAZY LOADING
import { LazyLoadImage } from "react-lazy-load-image-component";

// CONSTANT
const SOCIAL_MEDIA = [
  {
    href: "https://twitter.com/NursingFront",
    icon: (
      <FaTwitter
        size={40}
        className="text-white border-2 border-gray-200 rounded-full p-2"
      />
    ),
  },
  {
    href: "https://linkedin.com/company/nursingfront",
    icon: (
      <FaLinkedinIn
        size={40}
        className="text-white border-2 border-gray-200 rounded-full p-2"
      />
    ),
  },
  {
    href: "https://www.facebook.com/NursingFront",
    icon: (
      <FaFacebook
        size={40}
        className="text-white border-2 border-gray-200 rounded-full p-2"
      />
    ),
  },
];

export default function MarketingFooter() {
  return (
    <footer className="px-4 bg-brand-500 py-10 flex flex-col justify-center items-center gap-5 text-center">
      <LazyLoadImage src={Images["Logo2"]} alt="Logo" className="h-16 w-16" />
      <h2 className="text-white text-xl font-semibold">
        Connect with us on social media
      </h2>
      <div className="flex gap-5">
        {Children?.toArray(
          SOCIAL_MEDIA?.map(({ href, icon }) => (
            <a href={href} target="_blank" rel="noreferrer">
              {icon}
            </a>
          ))
        )}
      </div>
      <div className="h-0.5 w-full bg-gray-400"></div>
      <div className="text-white">
        <Link className="p-1" to={RoutesConstant.PRIVACY}>
          Privacy
        </Link>
        <span className="px-2">|</span>
        <Link className="p-1" to={RoutesConstant.TERMS_AND_CONDITION}>
          Terms
        </Link>
      </div>
      <p className="text-white">
        &copy; 2024 NursingFront. All rights reserved.
      </p>
    </footer>
  );
}
