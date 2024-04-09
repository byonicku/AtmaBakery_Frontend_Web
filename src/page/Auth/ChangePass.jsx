import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Row,
  Form,
  Image,
  Col,
  Spinner,
} from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";

import {
  useParams,
  useSearchParams,
  Link,
} from "react-router-dom";
import { toast } from "sonner";

import notVerified from "@/assets/images/notVerified.png";
import verified from "@/assets/images/verified.png";
import InputHelper from "@/page/InputHelper";
import APIAuth from "@/api/APIAuth";

import "./css/Auth.css";
import imageBg from "@/assets/images/bg.png";

export default function ResetPass() {
  const { key } = useParams();
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const email = searchParams.get("email");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVerify, setIsLoadingVerify] = useState(true);
  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
    token: key,
    email: email,
  });
  const [status, setStatus] = useState(0);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const data = { token: key, email: email };
        const response = await APIAuth.verifyPasswordToken(data);
        console.log(response);
        setStatus(response.state);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingVerify(false);
      }
    };
    fetchToken();
  }, [key, email]);

  const validationSchema = {
    password: { required: true, alias: "Kata Sandi", minLength: 8 },
    password_confirmation: { required: true, alias: "Konfirmasi Kata Sandi" },
  };

  const result = useMutation({
    mutationFn: (data) => APIAuth.resetPassword(data),
    onSuccess: () => {
      toast.success(
        "Ganti password berhasil!"
      );
      setStatus(0);
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
          <Col
            sm
            className="remove p-0 m-0"
            style={{ backgroundColor: "#FFEDDB" }}
          >
            <Image src={imageBg} className="p-0 m-0 rounded left-img" />
          </Col>

          <Col
            sm
            style={{ backgroundColor: "#FFFFFF" }}
            className={
              isLoadingVerify
                ? "d-flex align-items-center justify-content-center loading"
                : "loading"
            }
          >
            {isLoadingVerify ? (
              <div className="text-center">
                <Spinner
                  as="span"
                  animation="border"
                  variant="primary"
                  size="lg"
                  role="status"
                  aria-hidden="true"
                />
                <h6 className="mt-2 mb-0">Loading...</h6>
              </div>
            ) : status === 1 ? (
              <>
                <div className="pt-5 px-5" style={{ color: "black" }}>
                  <h1 style={{ fontWeight: "bold", fontSize: "2em" }}>
                    <span style={{ color: "#F48E28" }}>Kata Sandi</span>
                    <span> Baru Anda</span>
                  </h1>
                  <p className="py-2" style={{ fontSize: "1em" }}>
                    Mohon masukkan kata sandi baru Anda dan harap simpan dengan
                    baik data tersebut. Setelah berhasil masuk ke akun kembali
                    dengan kata sandi baru!
                  </p>
                </div>

                <Form className="px-5 py-2" onSubmit={inputHelper.handleSubmit}>
                  <Form.Group>
                    <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                      Kata Sandi Baru
                    </Form.Label>
                    <Form.Control
                      style={{
                        border: "1px #E5E5E5",
                        backgroundColor: "#F2F2F2",
                      }}
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
                      style={{
                        border: "1px #E5E5E5",
                        backgroundColor: "#F2F2F2",
                      }}
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
                      {isLoading ? "Loading..." : "Simpan"}
                    </Button>
                  </Container>
                </Form>
              </>
            ) : status === 0 ? (
              <Col sm style={{ backgroundColor: "#FFFFFF" }}>
                <div
                  className="pt-5 px-5 text-center"
                  style={{ color: "black" }}
                >
                  <Image
                    src={verified}
                    style={{ width: "45%", height: "45%" }}
                    className="mt-3"
                  />
                  <h1 style={{ fontWeight: "bold", fontSize: "2em" }}>
                    <span style={{ color: "#F48E28" }}>Berhasil</span>
                    <span> Ubah Kata Sandi</span>
                  </h1>
                </div>
                <Container className="text-center">
                  <div className="px-5" style={{ color: "black" }}>
                    <p style={{ fontWeight: "bold", fontSize: "0.85em" }}>
                      <span>Masuk kembali dengan kata sandi terbaru!</span>
                      <span>
                        {" "}
                        <Link to="/login" style={{ textDecoration: "none" }}>
                          Masuk ke Akun
                        </Link>
                      </span>
                    </p>
                  </div>
                </Container>
              </Col>
            ) : (
              <Col sm style={{ backgroundColor: "#FFFFFF" }}>
                <div
                  className="pt-5 px-5 text-center"
                  style={{ color: "black" }}
                >
                  <Image
                    src={notVerified}
                    style={{ width: "45%", height: "45%" }}
                    className="mt-3"
                  />
                  <h1 style={{ fontWeight: "bold", fontSize: "2em" }}>
                    <span style={{ color: "#F48E28" }}>Gagal</span>
                    <span> Untuk Verifikasi</span>
                  </h1>
                  <div className="py-2" style={{ fontSize: "1em" }}>
                    <p className="mb-1">
                      Tidak dapat melakukan penggantian password
                    </p>
                    <p className="mt-0 pt-0">Token tidak sah atau kadaluarsa</p>
                  </div>
                </div>
                <Container className="text-center">
                  <div className="px-5" style={{ color: "black" }}>
                    <p style={{ fontWeight: "bold", fontSize: "0.85em" }}>
                      <span>Masuk kembali ke akun?</span>
                      <span>
                        {" "}
                        <Link to="/login" style={{ textDecoration: "none" }}>
                          Masuk ke Akun
                        </Link>
                      </span>
                    </p>
                  </div>
                </Container>
              </Col>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
