import { Button, Container, Row, Form, Image, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import "./css/Auth.css";

import imageBg from "@/assets/images/bg.png";

export default function Login() {
  return (
    <div className="bg-half">
      <Container className="container-setting">
        <Row className="no-gutters shadow-lg rounded h-auto">
          <Col sm className="remove p-0 m-0" style={{ backgroundColor: "#FFEDDB" }}>
            <Image
              src={imageBg}
              className="p-0 m-0 rounded left-img"
            />
          </Col>
          <Col sm style={{ backgroundColor: "#FFFFFF" }}>
            <div className="pt-5 px-5" style={{ color: "black" }}>
              <h1 style={{ fontWeight: "bold", fontSize: "2em" }}>
                <span>Selamat</span>
                <span style={{ color: "#F48E28" }}> Datang</span>
                <span> Kembali</span>
              </h1>
              <p className="py-2" style={{ fontSize: "1em" }}>
                Masuk ke akun untuk melanjutkan
              </p>
            </div>

            <Form className="px-5 py-2">
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
              <Form.Group className="mt-4">
                <Form.Label style={{ fontWeight: "bold" }}>Password</Form.Label>
                <Form.Control
                  type="password"
                  style={{ border: "1px #E5E5E5", backgroundColor: "#F2F2F2" }}
                  placeholder="Masukkan kata sandi"
                />
              </Form.Group>
              <Container className="my-3 d-flex justify-content-end">
                <Link to="/reset" style={{ textDecoration: "none" }}>
                  Lupa Kata Sandi?
                </Link>
              </Container>

              <Container className="text-center">
                <Button
                  className="button-custom"
                  type="submit"
                >
                  Masuk
                </Button>
              </Container>
            </Form>
            <Container className="text-center">
              <div className="px-5" style={{ color: "black" }}>
                <p style={{ fontWeight: "bold", fontSize: "0.85em" }}>
                  <span>Belum memiliki akun?</span>
                  <span>
                    {" "}
                    <Link to="/register" style={{ textDecoration: "none" }}>
                      Daftar Sekarang
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
