import { useNavigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
/* eslint-disable react/prop-types */

const AdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const [tf, setRole] = useState(false);
  useEffect(() => {
    const currRole = sessionStorage.getItem("role");
    if (currRole === "CUST" || currRole === undefined || currRole === null) {
      setRole(false);
      navigate("/");
    }
    setRole(true);
  }, [navigate]);
  return tf && (children ? children : <Outlet />);
};
export default AdminRoute;
