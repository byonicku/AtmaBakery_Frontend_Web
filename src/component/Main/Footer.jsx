import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import { Col, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";

import logo from "@/assets/images/atma-bakery.png";

import "./css/Footer.css";

export default function Footer() {
  return (
    <footer className="footer-main">
      <Row>
        <Col sm={3} className="mb-4 mt-4 mx-3">
          <img src={logo} alt="Logo" className="footer-logo" />
          <ul className="list-unstyled footer-contact mb-0">
            <li>
              <div className="footer-text desc">
                Atma Bakery terpercaya dalam pembuatan setiap produk kue kami.
                “Bake from Heart”
              </div>
            </li>
            <li>
              <div className="footer-text desc mt-4">
                <button
                  className="btn btn-circle mr-2"
                  style={{ color: "#F48E28" }}
                  onClick={() =>
                    (window.location.href = "https://www.facebook.com")
                  }
                >
                  <FaFacebookF />
                </button>
                <button
                  className="btn btn-circle mr-2"
                  style={{ color: "#F48E28" }}
                  onClick={() =>
                    (window.location.href = "https://www.instagram.com")
                  }
                >
                  <FaInstagram />
                </button>
                <button
                  className="btn btn-circle mr-2"
                  style={{ color: "#F48E28" }}
                  onClick={() =>
                    (window.location.href = "https://twitter.com/")
                  }
                >
                  <FaTwitter />
                </button>
                <button
                  className="btn btn-circle"
                  style={{ color: "#F48E28" }}
                  onClick={() =>
                    (window.location.href = "https://www.linkedin.com")
                  }
                >
                  <FaLinkedinIn />
                </button>
              </div>
            </li>
          </ul>
        </Col>
        <Col sm={3} className="mb-4 mt-4 mx-2">
          <h4 className="footer-title">Waktu Operasional</h4>
          <ul className="list-unstyled footer-contact mb-0">
            <li>
              <div className="footer-text desc">
                Senin - Sabtu : 09:00 - 22:00 WIB
              </div>
            </li>
            <li>
              <div className="footer-text desc">Minggu : 13.00 - 22:00 WIB</div>
            </li>
          </ul>
        </Col>
        <Col sm={2} className="mb-4 mt-4 mx-2">
          <h3 className="footer-title">Kunjungi</h3>
          <ul className="list-unstyled footer-contact mb-0">
            <li>
              <NavLink className="footer-text desc" to="/">
                Beranda
              </NavLink>
            </li>
            <li>
              <NavLink className="footer-text desc" to="/tentang">
                Tentang Kami
              </NavLink>
            </li>
            <li>
              <NavLink className="footer-text desc" to="/produk">
                Produk
              </NavLink>
            </li>
            <li>
              <NavLink className="footer-text desc" to="/pesan">
                Pesan
              </NavLink>
            </li>
            <li>
              <NavLink className="footer-text desc" to="/kontak">
                Kontak
              </NavLink>
            </li>
          </ul>
        </Col>
        <Col sm={3} className="mb-4 mt-4 mx-2">
          <h4 className="footer-title">Hubungi Kami</h4>
          <ul className="list-unstyled footer-contact mb-0">
            <li>
              <div className="footer-text desc">
                Jl. Babarsari No.43, Janti, Caturtunggal, Kec. Depok, Kabupaten
                Sleman, Daerah Istimewa Yogyakarta 55281
              </div>
            </li>
            <li>
              <div className="footer-text desc">(0274) 487711</div>
            </li>
          </ul>
        </Col>
      </Row>
    </footer>
  );
}
