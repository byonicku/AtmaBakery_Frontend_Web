import Header from "@/component/Admin/Header";
import Footer from "@/component/Admin/Footer";
import SideNav from "@/component/Admin/SideNav";

import { Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <>
      <div className="wrapper">
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
