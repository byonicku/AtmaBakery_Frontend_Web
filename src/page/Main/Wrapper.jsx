import Header from "@/component/Main/Header";
import Footer from "@/component/Main/Footer";

import { Outlet } from "react-router-dom";
import "./css/Home.css";
import "./css/ProdukDetail.css";

export default function Wrapper() {
  return (
    <>
      <Header />
      <div className="content-main front-end-font-non-admin">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
