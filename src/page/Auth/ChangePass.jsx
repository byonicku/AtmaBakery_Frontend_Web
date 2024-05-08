import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Row,
  Form,
  Image,
  Col,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";

import { useParams, useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";

import InputHelper from "@/page/InputHelper";
import APIAuth from "@/api/APIAuth";

import "./css/Auth.css";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import Header from "@/component/Auth/Header";

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
  const [status, setStatus] = useState(-1);
  const [eyeToggle1, setEyeToggle1] = useState(true);
  const [eyeToggle2, setEyeToggle2] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const data = { token: key, email: email };
        const response = await APIAuth.verifyPasswordToken(data);
        setStatus(response.state);
      } catch (error) {
        console.error(error);
        toast.error(
          error?.data?.message ||
            error?.message ||
            "Sesuatu sedang bermasalah pada server!"
        );
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
      toast.success("Ganti password berhasil! Silahkan login kembali!");
      setStatus(0);
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
          <Row className="no-gutters rounded h-auto">
            <Col
              className="remove p-0 m-0"
              style={{ backgroundColor: "#FFEDDB" }}
            >
              <Image
                src="https://res.cloudinary.com/daorbrq8v/image/upload/f_auto,q_auto/v1/atma-bakery/mg1vcigtrnlhkajqc545"
                className="p-0 m-0 rounded left-img"
              />
            </Col>

            <Col
              style={{ backgroundColor: "#FFFFFF" }}
              className={
                isLoadingVerify
                  ? "d-flex align-items-center justify-content-center px-5 py-5 loading"
                  : "loading px-5 py-5"
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
              ) : status == 1 ? (
                <>
                  <div style={{ color: "black" }}>
                    <h1 style={{ fontWeight: "bold", fontSize: "2em" }}>
                      <span style={{ color: "#F48E28" }}>Kata Sandi</span>
                      <span> Baru Anda</span>
                    </h1>
                    <p className="py-1" style={{ fontSize: "1em" }}>
                      Mohon masukkan kata sandi baru Anda dan harap simpan
                      dengan baik data tersebut. Setelah berhasil masuk ke akun
                      kembali dengan kata sandi baru!
                    </p>
                  </div>

                  <Form onSubmit={inputHelper.handleSubmit}>
                    <Form.Group>
                      <Form.Label
                        style={{ fontWeight: "bold", fontSize: "1em" }}
                      >
                        Kata Sandi Baru
                      </Form.Label>
                      <InputGroup>
                        <Form.Control
                          style={{
                            border: "1px #E5E5E5",
                            backgroundColor: "#F2F2F2",
                          }}
                          type={eyeToggle1 ? "password" : "text"}
                          placeholder="Masukkan kata sandi baru"
                          name="password"
                          onChange={inputHelper.handleInputChange}
                          disabled={result.isPending}
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
                    <Form.Group className="mt-4 mb-4">
                      <Form.Label
                        style={{ fontWeight: "bold", fontSize: "1em" }}
                      >
                        Konfirmasi Kata Sandi Baru
                      </Form.Label>
                      <InputGroup>
                        <Form.Control
                          style={{
                            border: "1px #E5E5E5",
                            backgroundColor: "#F2F2F2",
                          }}
                          type={eyeToggle2 ? "password" : "text"}
                          placeholder="Masukkan ulang kata sandi baru"
                          name="password_confirmation"
                          onChange={inputHelper.handleInputChange}
                          disabled={result.isPending}
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
              ) : status == 0 ? (
                <div className="text-center" style={{ color: "black" }}>
                  <Image
                    src="https://res.cloudinary.com/daorbrq8v/image/upload/f_auto,q_auto/v1/atma-bakery/ykrflyipbmac9qmgzsdf"
                    style={{ width: "45%", height: "45%" }}
                    className="mt-3"
                  />
                  <h1 style={{ fontWeight: "bold", fontSize: "2em" }}>
                    <span style={{ color: "#F48E28" }}>Berhasil</span>
                    <span> Ubah Kata Sandi</span>
                  </h1>

                  <div style={{ color: "black" }}>
                    <p style={{ fontWeight: "bold", fontSize: "1em" }}>
                      <span>Masuk kembali dengan kata sandi terbaru!</span>
                      <span>
                        {" "}
                        <Link to="/login" style={{ textDecoration: "none" }}>
                          Masuk ke Akun
                        </Link>
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center" style={{ color: "black" }}>
                  <Image
                    src="https://res.cloudinary.com/daorbrq8v/image/upload/f_auto,q_auto/v1/atma-bakery/mdiw9berqgsq0pnqktir"
                    style={{ width: "45%", height: "45%" }}
                    className="mt-3"
                  />
                  <h1 style={{ fontWeight: "bold", fontSize: "2em" }}>
                    <span style={{ color: "#F48E28" }}>Gagal</span>
                    <span> Untuk Verifikasi</span>
                  </h1>
                  <div className="py-2" style={{ fontSize: "1.25em" }}>
                    <p className="mb-1">
                      Tidak dapat melakukan penggantian password
                    </p>
                    <p className="mt-0 pt-0">Token tidak sah atau kadaluarsa</p>
                  </div>

                  <div style={{ color: "black" }}>
                    <p style={{ fontWeight: "bold", fontSize: "1em" }}>
                      <span>Masuk kembali ke akun?</span>
                      <span>
                        {" "}
                        <Link to="/login" style={{ textDecoration: "none" }}>
                          Masuk ke Akun
                        </Link>
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
