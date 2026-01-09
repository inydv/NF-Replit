import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../Context/User.Context";
import RoutesConstant from "../Constants/Routes.Constant.json";

const ProfileCompletionPrompt = () => {
  const { user } = useUser();
  const [visible, setVisible] = useState(true);

  const isProfileComplete = user?.isProfileComplete;
  const isCreatedCompany = user?.isCreatedCompany;

  if (!user || (isProfileComplete && isCreatedCompany) || !visible) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-[99999] flex items-center justify-center">
      <div className="bg-white border px-10 py-6 rounded-xl text-black min-w-80 shadow-md relative">
        <div className="flex justify-between items-center gap-5 mb-8 border-b-black border-b pb-5">
          <h2 className="m-0 font-semibold text-xl">Complete Your Profile</h2>
          <button
            onClick={() => setVisible(false)}
            className="bg-none border-none text-3xl cursor-pointer text-black p-1"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <ul className="list-none pl-5">
          {!isProfileComplete && (
            <li className="flex flex-col gap-2">
              <span>Please complete your personal profile.</span>
              <Link
                to={RoutesConstant.JOBSEEKERPROFILEPAGE + "/" + user?.name}
                onClick={() => setVisible(false)}
                className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-brand-700 transition w-fit"
              >
                Go to Profile
              </Link>
            </li>
          )}
          {!isCreatedCompany && (
            <li className="flex flex-col gap-2 mt-5">
              <span>Create your company profile.</span>
              <Link
                to={RoutesConstant.USER_CREATE_COMPANY}
                onClick={() => setVisible(false)}
                className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-brand-700 transition w-fit"
              >
                Create Company
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProfileCompletionPrompt;
