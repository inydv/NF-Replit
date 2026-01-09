import { useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../Context/User.Context";
import EnumConstant from "../Constants/Enum.Constant.json";

// WHEN USER IS ADMIN
export default function JobSeeker() {
  const { user } = useUser();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (
      user?.role === EnumConstant.ROLES.JOB_SEEKER ||
      user?.role === EnumConstant.ROLES.MASTER
    )
      return;

    navigate("/");
  }, [navigate, pathname, user]);

  // JSX ELEMENT
  return <Outlet />;
}
