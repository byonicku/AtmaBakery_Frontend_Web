import { Button, Container, Row, Form, Image, Col } from "react-bootstrap";

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
                <span style={{ color: "#F48E28" }}>Kata Sandi</span>
                <span> Baru Anda</span>
              </h1>
              <p className="py-2" style={{ fontSize: "1em" }}>
                Mohon masukkan kata sandi baru Anda dan harap simpan dengan baik data tersebut. 
                Setelah berhasil masuk ke akun kembali dengan kata sandi baru!
              </p>
            </div>

            <Form className="px-5 py-2">
              <Form.Group>
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Kata Sandi Lama
                </Form.Label>
                <Form.Control
                  style={{ border: "1px #E5E5E5", backgroundColor: "#F2F2F2" }}
                  type="password"
                  placeholder="Masukkan alamat email"
                />
              </Form.Group>
              <Form.Group className="mt-4">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Kata Sandi Baru
                </Form.Label>
                <Form.Control
                  style={{ border: "1px #E5E5E5", backgroundColor: "#F2F2F2" }}
                  type="password"
                  placeholder="Masukkan alamat email"
                />
              </Form.Group>
              <Form.Group className="mt-4">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Konfirmasi Kata Sandi Baru
                </Form.Label>
                <Form.Control
                  style={{ border: "1px #E5E5E5", backgroundColor: "#F2F2F2" }}
                  type="password"
                  placeholder="Masukkan alamat email"
                />
              </Form.Group>
              <Container className="text-center">
                <Button
                  className="button-custom w-75 mx-5 my-5 h-25"
                  type="submit"
                >
                  Simpan
                </Button>
              </Container>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
