import { useState } from "react";
import { Button, Container, Row, Form, Image, Col } from "react-bootstrap";
import { useMutation } from '@tanstack/react-query';

import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import InputHelper from "@/page/InputHelper";
import APIAuth from "@/api/APIAuth";

import "./css/Auth.css";
import imageBg from "@/assets/images/bg.png";


export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const validationSchema = {
    email: {
      required: true,
      alias: "Email",
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: { required: true, alias: "Kata Sandi" },
  };

  const result = useMutation({
    mutationFn: (data) => APIAuth.login(data),
    onSuccess: () => {
      toast.success("Login berhasil!");
      setTimeout(() => {
        navigate("/");
      }, 250);
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
      toast.error(error.data.message || error.message || "Sesuatu sedang bermasalah pada server!");
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

            <Form className="px-5 py-2" onSubmit={inputHelper.handleSubmit}>
              <Form.Group>
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Email
                </Form.Label>
                <Form.Control
                  style={{ border: "1px #E5E5E5", backgroundColor: "#F2F2F2" }}
                  type="email"
                  placeholder="Masukkan alamat email"
                  name="email"
                  onChange={inputHelper.handleInputChange}
                  disabled={result.isPending}
                  required
                />
              </Form.Group>
              <Form.Group className="mt-4">
                <Form.Label style={{ fontWeight: "bold" }}>Password</Form.Label>
                <Form.Control
                  type="password"
                  style={{ border: "1px #E5E5E5", backgroundColor: "#F2F2F2" }}
                  placeholder="Masukkan kata sandi"
                  name="password"
                  onChange={inputHelper.handleInputChange}
                  disabled={result.isPending}
                  required
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
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Masuk"}
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
