import { useEffect, useState } from "react";
import { Container, Row, Image, Col, Spinner } from "react-bootstrap";

import { useParams, Link } from "react-router-dom";

import notVerified from "@/assets/images/notVerified.png";
import verified from "@/assets/images/verified.png";
import invalid from "@/assets/images/invalid.png";
import APIAuth from "@/api/APIAuth";

import "./css/Auth.css";
import imageBg from "@/assets/images/bg.png";
import { toast } from "sonner";
import Header from "@/component/Auth/Header";

export default function Verify() {
  const { key } = useParams();
  const [isLoadingVerify, setIsLoadingVerify] = useState(true);
  const [status, setStatus] = useState(-1);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const data = { token: key };
        const response = await APIAuth.verifyEmailToken(data);
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
  }, [key]);

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
              <Image src={imageBg} className="p-0 m-0 rounded left-img" />
            </Col>

            <Col
              style={{ backgroundColor: "#FFFFFF" }}
              className={
                isLoadingVerify
                  ? "d-flex align-items-center justify-content-center py-5 px-5 loading"
                  : "loading py-5 px-5"
              }
            >
              <div className="text-center" style={{ color: "black" }}>
                {isLoadingVerify ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      variant="primary"
                      size="lg"
                      role="status"
                      aria-hidden="true"
                    />
                    <h6 className="mt-2 mb-0">Loading...</h6>
                  </>
                ) : status == 1 ? (
                  <>
                    <Image
                      src={verified}
                      style={{ width: "45%", height: "45%" }}
                      className="mt-3"
                    />
                    <h1 style={{ fontWeight: "bold", fontSize: "2em" }}>
                      <span style={{ color: "#F48E28" }}>Berhasil</span>
                      <span> Verifikasi Akun</span>
                    </h1>
                    <div className="py-2" style={{ fontSize: "1.25em" }}>
                      <p className="mb-1">
                        Akun Anda Telah berhasil diverifikasi
                      </p>
                    </div>

                    <div style={{ color: "black" }}>
                      <p style={{ fontWeight: "bold", fontSize: "1em" }}>
                        <span>Anda sudah dapat mengakses akun Anda!</span>
                        <span>
                          {" "}
                          <Link to="/login" style={{ textDecoration: "none" }}>
                            Masuk ke Akun
                          </Link>
                        </span>
                      </p>
                    </div>
                  </>
                ) : status == 0 ? (
                  <>
                    <Image
                      src={invalid}
                      style={{ width: "45%", height: "45%" }}
                      className="mt-3"
                    />
                    <h1 style={{ fontWeight: "bold", fontSize: "2em" }}>
                      <span style={{ color: "#F48E28" }}>Peringatan</span>
                      <span> Akun Telah Terverifikasi</span>
                    </h1>
                    <div className="py-2" style={{ fontSize: "1.25em" }}>
                      <p className="mb-1">
                        Akun Anda Telah terverifikasi sebelumnya
                      </p>
                    </div>

                    <Container className="text-center">
                      <div style={{ color: "black" }}>
                        <p style={{ fontWeight: "bold", fontSize: "1em" }}>
                          <span>Anda sudah dapat mengakses akun Anda!</span>
                          <span>
                            {" "}
                            <Link
                              to="/login"
                              style={{ textDecoration: "none" }}
                            >
                              Masuk ke Akun
                            </Link>
                          </span>
                        </p>
                      </div>
                    </Container>
                  </>
                ) : (
                  <>
                    <Image
                      src={notVerified}
                      style={{ width: "45%", height: "45%" }}
                      className="mt-3"
                    />
                    <h1 style={{ fontWeight: "bold", fontSize: "2em" }}>
                      <span style={{ color: "#FF5B19" }}>Gagal</span>
                      <span> Verifikasi Akun</span>
                    </h1>
                    <div className="py-2" style={{ fontSize: "1.25em" }}>
                      <p className="mb-1">Akun Anda Gagal terverifikasi</p>
                      <p className="mt-0 pt-0">
                        Token tidak sah atau kadaluarsa
                      </p>
                    </div>

                    <Container className="text-center">
                      <div style={{ color: "black" }}>
                        <p style={{ fontWeight: "bold", fontSize: "1em" }}>
                          <span>Kembali ke halaman login!</span>
                          <span>
                            {" "}
                            <Link
                              to="/login"
                              style={{ textDecoration: "none" }}
                            >
                              Masuk ke Akun
                            </Link>
                          </span>
                        </p>
                      </div>
                    </Container>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
