import Footer from "@/component/Main/Footer";
import Header from "@/component/Main/Header";
import { Button } from "react-bootstrap";

import "./css/Main.css";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <>
      <Header />
      <div className="content-main">
        <div
          className="error-message"
          style={{ justifyContent: "center", textAlign: "center" }}
        >
          <span className="error-title">Ooops! 404 Not Found</span>
          <p className="error-description mt-3">
            Halaman ini sedang dalam proses pembangunan atau anda mengakses
            halaman yang tidak tersedia
          </p>
          <Link to="/" className="error-button">
            <Button
              className="button-landing button-style mt-5"
              variant="danger"
            >
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
