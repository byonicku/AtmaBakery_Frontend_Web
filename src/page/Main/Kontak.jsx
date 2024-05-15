import { Row, Col, Container, Image } from "react-bootstrap";
import {
  BiSolidPhoneCall,
  BiLogoWhatsapp,
  BiSolidEnvelope,
  BiSolidMap,
} from "react-icons/bi";
import bakery from "@/assets/bakery.svg";

export default function Kontak() {
  return (
    <Container>
      <Row className="text-center pb-4 pb-lg-0" id="produk">
        <h5
          style={{
            color: "#F48E28",
          }}
          className="pb-0 mb-0"
        >
          Kontak
        </h5>
        <h1
          style={{ fontWeight: 600, fontSize: "1.85rem" }}
          className="pt-0 pb-3"
        >
          Hubungi Kami
        </h1>
        <h5
          style={{
            color: "#717171",
            fontSize: "1.1rem",
          }}
          className="pb-0 mb-0"
        >
          Hubungi kami lebih lanjut jika terdapat pertanyaan, kami senang
          membantu
        </h5>
      </Row>
      <Container
        style={{
          boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.2)",
        }}
        className="rounded-3"
      >
        <Row className="mt-0 mt-md-3 mt-lg-5">
          <Col
            xl={5}
            lg={5}
            md={12}
            sm={12}
            xs={12}
            style={{
              background: "#EFAB68",
            }}
            className="p-4 rounded-3"
          >
            <Row>
              <h1
                style={{
                  color: "#FFFFFF",
                  fontSize: "1.25rem",
                  fontWeight: "700",
                }}
              >
                Informasi Kontak
              </h1>

              <p
                style={{
                  color: "#FFFFFF",
                  fontSize: "0.9rem",
                }}
              >
                Masukkan anda sangat berarti bagi kami!
              </p>
              <Image src={bakery} />
            </Row>
          </Col>

          <Col
            xl={7}
            lg={7}
            md={12}
            sm={12}
            xs={12}
            className="p-4 p-lg-4 p-md-4  px-lg-5 px-md-3"
          >
            <Row>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                }}
                className="pt-0 pt-lg-2 pt-md-2 pb-0 pb-lg-1 pb-md-1"
              >
                Atma Bakery
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                }}
              >
                Mempersiapkan produk terbaik untuk Anda
              </p>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                }}
                className="pt-0 pt-lg-3 pt-md-3 pb-0 pb-lg-1 pb-md-1"
              >
                Waktu Operasional
              </h3>

              <p
                style={{
                  fontSize: "0.9rem",
                }}
              >
                <Row>
                  <Col xl={3} lg={3} md={3} sm={12} xs={12}>
                    Senin - Jumat
                  </Col>
                  <Col>: 09.00 - 22.00 WIB</Col>
                </Row>
                <Row className="mt-2">
                  <Col xl={3} lg={3} md={3} sm={12} xs={12}>
                    Minggu
                  </Col>
                  <Col>: 13.00 - 22.00 WIB</Col>
                </Row>
              </p>
              <Row className="pt-1">
                <Col>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                    }}
                    className="pt-0 pt-lg-3 pt-md-3 pb-0 pb-lg-1 pb-md-1"
                  >
                    Nomor Telepon
                  </h3>
                  <p
                    style={{
                      fontSize: "0.9rem",
                    }}
                  >
                    <span className="pe-1 pe-lg-3 pe-md-3">
                      <BiSolidPhoneCall />
                    </span>
                    (0274) 487711
                  </p>
                  <p
                    style={{
                      fontSize: "0.9rem",
                    }}
                  >
                    <span className="pe-1 pe-lg-3 pe-md-3">
                      <BiLogoWhatsapp />
                    </span>
                    0274 487711
                  </p>
                </Col>
                <Col>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                    }}
                    className="pt-0 pt-lg-3 pt-md-3 pb-0 pb-lg-1 pb-md-1"
                  >
                    Alamat Email
                  </h3>
                  <p
                    style={{
                      fontSize: "0.9rem",
                    }}
                  >
                    <span className="pe-1 pe-lg-3 pe-md-3">
                      <BiSolidEnvelope />
                    </span>
                    AtmaBakery@gmail.com
                  </p>
                </Col>
              </Row>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                }}
                className="pt-0 pt-lg-3 pt-md-3 pb-0 pb-lg-1 pb-md-1"
              >
                Alamat Toko
              </h3>
              <Row>
                <Col
                  sm={12}
                  xs={12}
                  style={{
                    fontSize: "0.9rem",
                  }}
                >
                  <BiSolidMap className="mb-1 me-2" /> Pusat Toko
                </Col>
                <Col>
                  <p
                    style={{
                      fontSize: "0.9rem",
                    }}
                    className="pt-0 mt-0 ml-4"
                  >
                    Jl. Babarsari No.43, Janti, Caturtunggal, Kec. Depok,
                    Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281
                  </p>
                </Col>
              </Row>
            </Row>
          </Col>
        </Row>
      </Container>

      <Row
        className="text-center pt-5 pt-lg-3 mt-0 mt-md-3 mt-lg-5 pb-0"
        id="produk"
      >
        <h5
          style={{
            color: "#F48E28",
          }}
          className="pb-0 mb-0"
        >
          Lokasi
        </h5>
        <h1
          style={{ fontWeight: 600, fontSize: "1.85rem" }}
          className="pt-0 pb-3"
        >
          Kunjungi Toko Kami
        </h1>
        <h5
          style={{
            color: "#717171",
            fontSize: "1.1rem",
          }}
          className="pb-0 mb-0"
        >
          Kunjungi toko kami melalui peta, kami akan menyambut kedangan Anda
        </h5>
      </Row>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15812.392512673185!2d110.4161291!3d-7.7794195!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59f1fb2f2b45%3A0x20986e2fe9c79cdd!2sUniversitas%20Atma%20Jaya%20Yogyakarta%20-%20Kampus%203%20Gedung%20Bonaventura%20Babarsari!5e0!3m2!1sid!2sid!4v1715764549192!5m2!1sid!2sid"
        style={{
          width: "100%",
          height: "30rem",
          border: "0",
        }}
        className="allowFullScreen mt-2 mt-lg-5 mt-md-3 mb-2 mb-lg-5 mb-md-3"
      />
    </Container>
  );
}
