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

import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

import InputHelper from "@/page/InputHelper";
import APIAuth from "@/api/APIAuth";

import "./css/Auth.css";
import imageBg from "@/assets/images/bg.png";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import Header from "@/component/Auth/Header";

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    password_confirmation: "",
    no_telp: "",
    tanggal_lahir: "",
  });
  const [eyeToggle1, setEyeToggle1] = useState(true);
  const [eyeToggle2, setEyeToggle2] = useState(true);

  const validationSchema = {
    nama: { required: true, alias: "Nama Lengkap" },
    email: {
      required: true,
      alias: "Email",
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: { required: true, alias: "Kata Sandi", minLength: 8 },
    password_confirmation: { required: true, alias: "Konfirmasi Kata Sandi" },
    no_telp: {
      required: true,
      alias: "Nomor Telepon",
      minLength: 10,
      maxLength: 13,
      pattern: /^(?:\+?08)(?:\d{2,3})?[ -]?\d{3,4}[ -]?\d{4}$/,
    },
    tanggal_lahir: { required: true, alias: "Tanggal Lahir" },
  };

  const result = useMutation({
    mutationFn: (data) => APIAuth.register(data),
    onSuccess: () => {
      toast.success(
        "Registrasi berhasil!, silakan cek email Anda untuk verifikasi!"
      );
      setTimeout(() => {
        navigate("/login");
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

    if (formData.password !== formData.password_confirmation) {
      toast.warning("Password dan Konfirmasi Password tidak sama!");
      return;
    }

    if (formData.tanggal_lahir >= new Date().toISOString().split("T")[0]) {
      toast.warning("Tanggal Lahir tidak valid!");
      return;
    }

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
        <Container className="container-setting pb-3">
          <Row className="no-gutters shadow-lg rounded h-auto">
            <Col
              className="remove p-0 m-0"
              style={{ backgroundColor: "#FFEDDB" }}
            >
              <Image src={imageBg} className="p-0 m-0 rounded left-img" />
            </Col>
            <Col className="py-4 px-5" style={{ backgroundColor: "#FFFFFF" }}>
              <div style={{ color: "black" }}>
                <h1 style={{ fontWeight: "bold", fontSize: "2em" }}>
                  <span>Daftarkan</span>
                  <span style={{ color: "#F48E28" }}> Diri</span>
                  <span> Anda</span>
                </h1>
                <p className="py-2" style={{ fontSize: "1em" }}>
                  Daftar segera dan nikmati produk serta pelayanan kami
                </p>
              </div>

              <Form onSubmit={inputHelper.handleSubmit}>
                <Form.Group>
                  <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    Email
                  </Form.Label>
                  <Form.Control
                    style={{
                      border: "1px #E5E5E5",
                      backgroundColor: "#F2F2F2",
                    }}
                    type="email"
                    placeholder="Masukkan alamat email"
                    name="email"
                    onChange={inputHelper.handleInputChange}
                    disabled={result.isPending}
                    required
                  />
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    Nama Lengkap
                  </Form.Label>
                  <Form.Control
                    style={{
                      border: "1px #E5E5E5",
                      backgroundColor: "#F2F2F2",
                    }}
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    name="nama"
                    onChange={inputHelper.handleInputChange}
                    disabled={result.isPending}
                    required
                  />
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    Nomor Telepon
                  </Form.Label>
                  <Form.Control
                    style={{
                      border: "1px #E5E5E5",
                      backgroundColor: "#F2F2F2",
                    }}
                    type="text"
                    placeholder="Masukkan nomor telepon"
                    name="no_telp"
                    onChange={inputHelper.handleInputChange}
                    disabled={result.isPending}
                    required
                  />
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    Tanggal Lahir
                  </Form.Label>
                  <Form.Control
                    style={{
                      border: "1px #E5E5E5",
                      backgroundColor: "#F2F2F2",
                    }}
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    placeholder="Masukkan Tanggal Lahir"
                    name="tanggal_lahir"
                    onChange={inputHelper.handleInputChange}
                    disabled={result.isPending}
                    required
                  />
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label style={{ fontWeight: "bold" }}>
                    Kata Sandi
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={eyeToggle1 ? "password" : "text"}
                      style={{
                        border: "1px #E5E5E5",
                        backgroundColor: "#F2F2F2",
                      }}
                      placeholder="Masukkan kata sandi"
                      name="password"
                      onChange={inputHelper.handleInputChange}
                      disabled={result.isPending}
                      required
                    />
                    <InputGroup.Text
                      style={{
                        border: "1px #E5E5E5",
                        backgroundColor: "#F2F2F2",
                        userSelect: "none",
                      }}
                      onClick={() => setEyeToggle1(!eyeToggle1)}
                    >
                      {eyeToggle1 ? <BsEyeFill /> : <BsEyeSlashFill />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label style={{ fontWeight: "bold" }}>
                    Konfirmasi Kata Sandi
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={eyeToggle2 ? "password" : "text"}
                      style={{
                        border: "1px #E5E5E5",
                        backgroundColor: "#F2F2F2",
                      }}
                      placeholder="Masukkan kembali kata sandi"
                      name="password_confirmation"
                      onChange={inputHelper.handleInputChange}
                      disabled={result.isPending}
                      required
                    />
                    <InputGroup.Text
                      style={{
                        border: "1px #E5E5E5",
                        backgroundColor: "#F2F2F2",
                        userSelect: "none",
                      }}
                      onClick={() => setEyeToggle2(!eyeToggle2)}
                    >
                      {eyeToggle2 ? <BsEyeFill /> : <BsEyeSlashFill />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                <Container className="mt-3 d-flex justify-content-start">
                  <Form.Check
                    required
                    style={{ color: "#ADADAD", fontSize: "0.8em" }}
                    label={
                      <p>
                        <span>
                          Dengan mencentang kotak centang ini, Anda telah
                          menyetujui{" "}
                        </span>
                        <span>
                          <a href="#" style={{ textDecoration: "none" }}>
                            Persyaratan Layanan
                          </a>
                        </span>
                        <span> dan </span>
                        <span>
                          <a href="#" style={{ textDecoration: "none" }}>
                            Kebijakan Privasi
                          </a>
                        </span>
                      </p>
                    }
                  />
                </Container>
                <Container className="text-center pb-2">
                  <Button
                    className="button-custom"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Daftar"}
                  </Button>
                </Container>
              </Form>
              <Container className="text-center">
                <div style={{ color: "black" }}>
                  <p style={{ fontWeight: "bold", fontSize: "1em" }}>
                    <span>Sudah memiliki akun?</span>
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
    </>
  );
}
