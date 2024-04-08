import { useState } from "react";
import { Button, Container, Row, Form, Image, Col } from "react-bootstrap";
import { useMutation } from '@tanstack/react-query';

import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

import InputHelper from "@/page/InputHelper";
import APIAuth from "@/api/APIAuth";

import "./css/Auth.css";
import imageBg from "@/assets/images/bg.png";

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
      toast.success("Registrasi berhasil!");
      setTimeout(() => {
        navigate("/login");
      }, 250);
    },
    onError: (error) => {
      toast.error(error.message);
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
      console.error(error);
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
            <Image src={imageBg} className="p-0 m-0 rounded left-img" />
          </Col>
          <Col sm style={{ backgroundColor: "#FFFFFF" }}>
            <div className="pt-5 px-5" style={{ color: "black" }}>
              <h1 style={{ fontWeight: "bold", fontSize: "2em" }}>
                <span>Daftarkan</span>
                <span style={{ color: "#F48E28" }}> Diri</span>
                <span> Anda</span>
              </h1>
              <p className="py-2" style={{ fontSize: "1em" }}>
                Daftar segera dan nikmati produk serta pelayanan kami
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
                  required
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Nama Lengkap
                </Form.Label>
                <Form.Control
                  style={{ border: "1px #E5E5E5", backgroundColor: "#F2F2F2" }}
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  name="nama"
                  onChange={inputHelper.handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Nomor Telepon
                </Form.Label>
                <Form.Control
                  style={{ border: "1px #E5E5E5", backgroundColor: "#F2F2F2" }}
                  type="text"
                  placeholder="Masukkan nomor telepon"
                  name="no_telp"
                  onChange={inputHelper.handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Tanggal Lahir
                </Form.Label>
                <Form.Control
                  style={{ border: "1px #E5E5E5", backgroundColor: "#F2F2F2" }}
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  placeholder="Masukkan Tanggal Lahir"
                  name="tanggal_lahir"
                  onChange={inputHelper.handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label style={{ fontWeight: "bold" }}>
                  Kata Sandi
                </Form.Label>
                <Form.Control
                  type="password"
                  style={{ border: "1px #E5E5E5", backgroundColor: "#F2F2F2" }}
                  placeholder="Masukkan kata sandi"
                  name="password"
                  onChange={inputHelper.handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label style={{ fontWeight: "bold" }}>
                  Konfirmasi Kata Sandi
                </Form.Label>
                <Form.Control
                  type="password"
                  style={{ border: "1px #E5E5E5", backgroundColor: "#F2F2F2" }}
                  placeholder="Masukkan kembali kata sandi"
                  name="password_confirmation"
                  onChange={inputHelper.handleInputChange}
                  required
                />
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
              <Container className="text-center">
                <Button className="button-custom" type="submit" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Daftar"}
                </Button>
              </Container>
            </Form>
            <Container className="text-center py-3">
              <div className="px-5" style={{ color: "black" }}>
                <p style={{ fontWeight: "bold", fontSize: "0.85em" }}>
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
  );
}
