import Header from "@/component/Admin/Header";
import Footer from "@/component/Admin/Footer";
import SideNav from "@/component/Admin/SideNav";

import { Outlet } from "react-router-dom";
import "./Page/css/Admin.css";

export default function Dashboard() {
  return (
    <>
      <div className="wrapper text-admin-weight">
        <Header />
        <SideNav />
        <div className="content-wrapper">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
}
