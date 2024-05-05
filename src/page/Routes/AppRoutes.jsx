import { Routes } from "react-router-dom";
import getAdminRoutes from "./AdminRoutes";
import getCustomerRoutes from "./CustomerRoutes";
import getPublicRoutes from "./PublicRoutes";
import getAuthRoutes from "./AuthRoutes";

export default function AppRoutes() {
  return (
    <>
      <Routes>
        {getPublicRoutes()}
        {getAdminRoutes()}
        {getCustomerRoutes()}
        {getAuthRoutes()}
      </Routes>
    </>
  );
}
