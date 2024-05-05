import { useNavigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
/* eslint-disable react/prop-types */

const RoleRoute = ({ roles = [], children }) => {
  const navigate = useNavigate();
  const [tf, setRole] = useState(false);
  useEffect(() => {
    const currRole = sessionStorage.getItem("role");
    if (
      !roles.includes(currRole) ||
      currRole === undefined ||
      currRole === null
    ) {
      setRole(false);
      navigate("/admin");
    }
    setRole(true);
  }, [navigate, roles]);
  return tf && (children ? children : <Outlet />);
};
export default RoleRoute;
