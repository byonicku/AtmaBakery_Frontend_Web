import { useState } from "react";
import { Button, Container, Row, Form, Image, Col } from "react-bootstrap";
import { useMutation } from '@tanstack/react-query';

import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import InputHelper from "@/page/InputHelper";
import APIAuth from "@/api/APIAuth";

import "./css/Auth.css";
import imageBg from "@/assets/images/bg.png";

export default function ResetPass() {
  const navigate = useNavigate();
  const { key } = useParams();
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const email = searchParams.get("email");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
    token: key,
    email: email,
  });

  const validationSchema = {
    password: { required: true, alias: "Kata Sandi", minLength: 8 },
    password_confirmation: { required: true, alias: "Konfirmasi Kata Sandi" },
  };

  const result = useMutation({
    mutationFn: (data) => APIAuth.resetPassword(data),
    onSuccess: () => {
      toast.success("Ganti password berhasil! Anda akan diarahkan ke halaman login");
      setTimeout(() => {
        navigate("/login");
      }, 250);
    },
    onError: (error) => {
      toast.error(error?.error || error?.message);
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

            <Form className="px-5 py-2" onSubmit={inputHelper.handleSubmit}>
              <Form.Group>
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Kata Sandi Baru
                </Form.Label>
                <Form.Control
                  style={{ border: "1px #E5E5E5", backgroundColor: "#F2F2F2" }}
                  type="password"
                  placeholder="Masukkan kata sandi baru"
                  name="password"
                  onChange={inputHelper.handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mt-4 mb-4">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Konfirmasi Kata Sandi Baru
                </Form.Label>
                <Form.Control
                  style={{ border: "1px #E5E5E5", backgroundColor: "#F2F2F2" }}
                  type="password"
                  placeholder="Masukkan ulang kata sandi baru"
                  name="password_confirmation"
                  onChange={inputHelper.handleInputChange}
                />
              </Form.Group>
              <Container className="text-center">
                <Button
                  className="button-custom"
                  type="submit"
                  disabled={isLoading}
                >
                  { isLoading ? "Loading..." : "Simpan" }
                </Button>
              </Container>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
