import Header from "@/component/Main/Header";
import Footer from "@/component/Main/Footer";

import { Outlet } from "react-router-dom";
import "./css/Home.css";

export default function Wrapper() {
  return (
    <>
      <Header />
      <div className="content-main">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
