import { Row, Col, Button, Container } from "react-bootstrap";
import { MdOutlinePlayCircleFilled } from "react-icons/md";

import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [errorMessage, setErrorMessage] = useState("");

  const handleClickCoding2 = () => {
    toast.error("Fitur Belum Tersedia!");
  };

  return (
    <Container>
      <Row>
        <Col md={6} className="content-left">
          <div
            className="ellipse-container button-style"
            onClick={() => window.open("https://www.youtube.com")}
          >
            <span className="ellipse-text mr-2">Tonton Video</span>
            <MdOutlinePlayCircleFilled
              className="btn-circleLanding ml-1"
              style={{ color: "#F48E28" }}
            />
          </div>
          <h1 className="main-title mt-5">
            Nikmati <br />
            <span style={{ color: "#F48E28" }}>Kelezatan</span> Yang <br />
            Tak <span style={{ color: "#F48E28" }}>Terlupakan</span>
          </h1>
          <div className="ftext-desc mt-5">
            Kue-kue ini dibuat dengan teliti menggunakan bahan-bahan berkualitas
            pilihan. Proses pembuatannya menggabungkan keahlian tangan dan
            perhatian mendetail untuk menciptakan produk akhir yang istimewa
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <Row className="mt-5">
            <Col md={6} className="mb-3 mb-md-0">
              <Button
                className="button-landing button-style"
                variant="danger"
                block
                onClick={handleClickCoding2}
              >
                Baca Selanjutnya
              </Button>
            </Col>
            <Col md={6} className="mb-3 mb-md-0">
              <Button
                className="button-landing-border button-style"
                variant="outline-light"
                block
                onClick={handleClickCoding2}
              >
                Pesan Sekarang
              </Button>
            </Col>
          </Row>
        </Col>
        <Col md={6} className="content-right">
          <div className="rectangleLanding"></div>
        </Col>
      </Row>
    </Container>
  );
}
