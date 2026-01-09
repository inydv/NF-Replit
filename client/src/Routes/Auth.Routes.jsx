import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useUser } from "../Context/User.Context";

// WHEN USER IS NOT LOGGEDIN
export default function Authentication({ isUser }) {
  const { user } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    if ((!isUser && !user) || (isUser && user)) return;
    navigate("/");
  }, [navigate, user]);

  // JSX ELEMENT
  return <Outlet />;
}
