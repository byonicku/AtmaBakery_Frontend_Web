import Footer from "@/component/Main/Footer";
import Header from "@/component/Main/Header";
import { Container } from "react-bootstrap";

import "./css/Main.css";
import { Outlet } from "react-router-dom";

export default function Pesan() {
  return (
    <>
      <Header />
      <Container className="content-main">
        <Outlet />
      </Container>
      <Footer />
    </>
  );
}
