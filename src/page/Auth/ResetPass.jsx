import { useState } from "react";
import { Button, Container, Row, Form, Image, Col } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";

import { Link } from "react-router-dom";
import { toast } from "sonner";

import InputHelper from "@/page/InputHelper";
import APIAuth from "@/api/APIAuth";

import "./css/Auth.css";
import imageBg from "@/assets/images/bg.png";

export default function ResetPass() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });

  const validationSchema = {
    email: {
      required: true,
      alias: "Email",
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  };

  const result = useMutation({
    mutationFn: (data) => APIAuth.sendEmailForResetPassword(data),
    onSuccess: () => {
      toast.success("Email berhasil dikirim ke " + formData.email + " !");
    },
    onError: (error) => {
      console.error(error);
    },
    onMutate: () => {
      setIsLoading(true);
    },
  });

  const onSubmit = async (formData) => {
    if (isLoading) return;

    try {
      await result.mutateAsync(formData);
    } catch (error) {
      toast.error(
        error.data.message ||
          error.message ||
          "Sesuatu sedang bermasalah pada server!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputHelper = new InputHelper(
    formData,
    setFormData,
    validationSchema,
    onSubmit
  );

  return (
    <div className="bg-half">
      <Container className="container-setting">
        <Row className="no-gutters shadow-lg rounded h-auto">
          <Col
            sm
            className="remove p-0 m-0"
            style={{ backgroundColor: "#FFEDDB" }}
          >
            <Image src={imageBg} className="p-0 m-0 rounded left-img" />
          </Col>
          <Col sm style={{ backgroundColor: "#FFFFFF" }}>
            <div className="pt-5 px-5" style={{ color: "black" }}>
              <h1 style={{ fontWeight: "bold", fontSize: "2em" }}>
                <span style={{ color: "#F48E28" }}>Lupa</span>
                <span> Kata Sandi</span>
              </h1>
              <p className="py-2" style={{ fontSize: "1em" }}>
                Mohon masukkan alamat email yang terhubung dengan akun Anda.
                Kami akan mengirimkan instruksi ubah kata sandi ke email
                tersebut.
              </p>
            </div>

            <Form className="px-5 py-4" onSubmit={inputHelper.handleSubmit}>
              <Form.Group className="pb-3">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Email
                </Form.Label>
                <Form.Control
                  style={{ border: "1px #E5E5E5", backgroundColor: "#F2F2F2" }}
                  type="email"
                  placeholder="Masukkan alamat email"
                  name="email"
                  onChange={inputHelper.handleInputChange}
                  required
                />
              </Form.Group>
              <Container className="text-center">
                <Button
                  className="button-custom"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Kirim Email"}
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
