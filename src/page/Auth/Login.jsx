import { useState } from "react";
import {
  Button,
  Container,
  Row,
  Form,
  Image,
  Col,
  InputGroup,
} from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";

import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import InputHelper from "@/page/InputHelper";
import APIAuth from "@/api/APIAuth";

import "./css/Auth.css";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import Header from "@/component/Auth/Header";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [eyeToggle, setEyeToggle] = useState(true);
  const handleToggle = () => setEyeToggle(!eyeToggle);

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
                src="https://res.cloudinary.com/daorbrq8v/image/upload/f_auto,q_auto/v1/atma-bakery/mg1vcigtrnlhkajqc545"
                className="p-0 m-0 rounded left-img"
              />
            </Col>
            <Col className="py-5 px-5" style={{ backgroundColor: "#FFFFFF" }}>
              <h1 className="header-text">
                <span>Selamat</span>
                <span style={{ color: "#F48E28" }}> Datang</span>
                <span> Kembali</span>
              </h1>
              <p className="py-2 subheader-text">
                Masuk ke akun untuk melanjutkan
              </p>

              <Form onSubmit={inputHelper.handleSubmit}>
                <Form.Group>
                  <Form.Label className="form-label-font">Email</Form.Label>
                  <Form.Control
                    className="input-border"
                    type="email"
                    placeholder="Masukkan alamat email"
                    name="email"
                    onChange={inputHelper.handleInputChange}
                    disabled={result.isPending}
                    required
                  />
                </Form.Group>
                <Form.Group className="mt-4">
                  <Form.Label className="form-label-font">Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      className="input-border"
                      type={eyeToggle ? "password" : "text"}
                      placeholder="Masukkan kata sandi"
                      name="password"
                      onChange={inputHelper.handleInputChange}
                      disabled={result.isPending}
                      required
                    />
                    <InputGroup.Text
                      className="input-border"
                      style={{
                        userSelect: "none",
                      }}
                      onClick={handleToggle}
                    >
                      {eyeToggle ? <BsEyeFill /> : <BsEyeSlashFill />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                <Container className="my-3 d-flex justify-content-end">
                  <Link to="/reset" style={{ textDecoration: "none" }}>
                    Lupa Kata Sandi?
                  </Link>
                </Container>

                <Container className="text-center pb-2">
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
                <p className="text-under-button">
                  <span>Belum memiliki akun?</span>
                  <span>
                    {" "}
                    <Link to="/register" style={{ textDecoration: "none" }}>
                      Daftar Sekarang
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
