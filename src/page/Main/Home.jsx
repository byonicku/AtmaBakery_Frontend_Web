import Footer from "@/component/Main/Footer";
import Header from "@/component/Main/Header";
import { Container, Row, Col, Button } from "react-bootstrap";
import { MdOutlinePlayCircleFilled } from "react-icons/md";

import "./css/Main.css";
import { Outlet } from "react-router-dom";

export default function Home() {
  return (
    <>
      <Header />
      <Container className="content-main">
        <Row>
          <Col md={12} className="content-left">
            <Outlet />
            <div className="ellipse-container button-style" onClick={() => window.open('https://www.youtube.com')}>
              <span className="ellipse-text mr-2">Tonton Video</span>
              <MdOutlinePlayCircleFilled className="btn-circle ml-1" style={{ color: '#F48E28' }} />
            </div>
            <h1 className="main-title mt-5">
              Nikmati <br /> 
              <span style={{ color: '#F48E28' }}>Kelezatan</span> Yang <br /> 
              Tak <span style={{ color: '#F48E28' }}>Terlupakan</span>
            </h1>
            <div className="ftext-desc mt-5">
              Kue-kue ini dibuat dengan teliti menggunakan bahan-bahan berkualitas pilihan. Proses pembuatannya menggabungkan keahlian tangan dan perhatian mendetail untuk menciptakan produk akhir yang istimewa
            </div>
            <Row className="mt-5">
              <Col md={4} className="mb-3 mb-md-0">
                <Button className="button-landing button-style" variant="danger" block>Baca Selanjutnya</Button>
              </Col>
              <Col md={4} className="mb-3 mb-md-0">
                <Button className="button-landing-border button-style" variant="outline-light" block>Pesan Sekarang</Button>
              </Col>
            </Row>
          </Col>
          <Col md={4} className="content-right"></Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}
