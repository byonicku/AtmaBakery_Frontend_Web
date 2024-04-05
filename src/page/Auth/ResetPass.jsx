import { Button, Container, Row, Form, Image, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import "./css/Auth.css";

import imageBg from "@/assets/images/bg.png";

export default function ResetPass() {
  return (
    <div className="bg-half">
      <Container>
        <Row className="m-5 no-gutters shadow-lg rounded h-auto">
          <Col sm className="p-0 m-0" style={{ backgroundColor: "#FFEDDB" }}>
            <Image
              src={imageBg}
              className="p-0 m-0 rounded left-img"
            />
          </Col>
          <Col sm style={{ backgroundColor: "#FFFFFF" }}>
            <div className="pt-5 px-5" style={{ color: "black" }}>
              <h1 style={{ fontWeight: "bold", fontSize: "2em" }}>
                <span style={{ color: "#F48E28" }}>Lupa</span>
                <span> Kata Sandi</span>
              </h1>
              <p className="py-2" style={{ fontSize: "1em" }}>
                Mohon masukkan alamat email yang terhubung dengan akun Anda.
                Kami akan mengirimkan instruksi uba kata sandi ke emailm
                tersebut.
              </p>
            </div>

            <Form className="px-5 py-4">
              <Form.Group>
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Email
                </Form.Label>
                <Form.Control
                  style={{ border: "1px #E5E5E5", backgroundColor: "#F2F2F2" }}
                  type="email"
                  placeholder="Masukkan alamat email"
                />
              </Form.Group>
              <Container className="text-center">
                <Button
                  className="button-custom w-75 mx-5 my-5 h-25"
                  type="submit"
                >
                  Kirim Email
                </Button>
              </Container>
            </Form>
            <Container className="text-center">
              <div className="px-4">
                <p style={{ fontWeight: "bold", fontSize: "0.85em" }}>
                  <span>Batalkan permintaan lupa kata sandi?</span>
                  <span>
                    {" "}
                    <Link to="/login" style={{ textDecoration: "none" }}>
                      Masuk Sekarang
                    </Link>
                  </span>
                </p>
              </div>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
