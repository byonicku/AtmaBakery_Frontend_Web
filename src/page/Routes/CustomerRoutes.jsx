import { Route } from "react-router-dom";
import Dashboard from "@/page/Admin/Dashboard";
import RoleRoute from "@/page/Routes/Guards/RoleRoute";

import Profile from "@/page/Admin/Page/Profile";
import HistoryCustomerPageSelf from "@/page/Main/HistoryCustomer/HistoryCustomerPage";
import NotFound404 from "@/page/Admin/Page/NotFound404";
import AlamatPemesananPage from "@/page/Main/AlamatPemesanan/AlamatPemesananPage";

export default function getCustomerRoutes() {
  return (
    <Route
      path="/profile"
      element={
        <RoleRoute roles={["CUST"]}>
          <Dashboard />
        </RoleRoute>
      }
    >
      <Route path="alamat" element={<AlamatPemesananPage />} />
      <Route path="pemesanan" element={<HistoryCustomerPageSelf />} />
      <Route index element={<Profile />} />
      <Route path="*" element={<NotFound404 />} />
    </Route>
  );
}
