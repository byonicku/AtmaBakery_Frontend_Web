import { useState } from "react";
import { Button, Container, Row, Form, Image, Col } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";

import { Link } from "react-router-dom";
import { toast } from "sonner";

import InputHelper from "@/page/InputHelper";
import APIAuth from "@/api/APIAuth";

import "./css/Auth.css";
import Header from "@/component/Auth/Header";

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
        error?.data?.message ||
          error?.message ||
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
    <>
      <Header />
      <div className="bg-half">
        <Container className="container-setting">
          <Row className="no-gutters shadow-lg rounded h-auto">
            <Col
              className="remove p-0 m-0"
              style={{ backgroundColor: "#FFEDDB" }}
            >
              <Image
                src="
              https://res.cloudinary.com/daorbrq8v/image/upload/f_auto,q_auto/v1/atma-bakery/mg1vcigtrnlhkajqc545"
                className="p-0 m-0 rounded left-img"
              />
            </Col>
            <Col className="py-5 px-5" style={{ backgroundColor: "#FFFFFF" }}>
              <h1 className="header-text">
                <span style={{ color: "#F48E28" }}>Lupa</span>
                <span> Kata Sandi</span>
              </h1>
              <p className="py-2 subheader-text">
                Mohon masukkan alamat email yang terhubung dengan akun Anda.
                Kami akan mengirimkan instruksi ubah kata sandi ke email
                tersebut.
              </p>

              <Form onSubmit={inputHelper.handleSubmit}>
                <Form.Group className="pb-3">
                  <Form.Label className="form-label-font">Email</Form.Label>
                  <Form.Control
                    className="input-border"
                    type="email"
                    placeholder="Masukkan alamat email"
                    name="email"
                    onChange={inputHelper.handleInputChange}
                    required
                  />
                </Form.Group>
                <Container className="text-center pb-2">
                  <Button
                    className="button-custom"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Kirim"}
                  </Button>
                </Container>
              </Form>
              <Container className="text-center">
                <p className="text-under-button">
                  <span>Batalkan permintaan lupa kata sandi?</span>
                  <span>
                    {" "}
                    <Link to="/login" style={{ textDecoration: "none" }}>
                      Masuk Sekarang
                    </Link>
                  </span>
                </p>
              </Container>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
