import { Row, Col, Container, Image, Card } from "react-bootstrap";
import { MdOutlinePlayCircleFilled } from "react-icons/md";

import owner from "@/assets/OwnerPoto.svg";
import produk from "@/assets/list_produk.svg";

import shop_cart from "@/assets/shopping-cart.svg";
import hoop_house from "@/assets/hoop-house.svg";
import time from "@/assets/time-fast.svg";
import bicycle from "@/assets/bicycle-basket.svg";
import moment_1 from "@/assets/moment-1.svg";
import moment_2 from "@/assets/moment-2.svg";

export default function TentangKami() {
  return (
    <Container>
      <Row className="mt-0 mt-md-3 mt-lg-0 mb-1 mb-lg-3 mb-md-3">
        <Col xl={5} lg={5} md={12} sm={12}>
          <div
            className="ellipse-container button-style"
            onClick={() => window.open("https://www.youtube.com")}
          >
            <span className="ellipse-text">Tonton Video</span>

            <MdOutlinePlayCircleFilled className="btn-circleLanding ms-4" />
          </div>
          <h1 className="main-title mt-5">
            Sentuhan <br />
            <span style={{ color: "#F48E28" }}>Manis</span> untuk <br />
            <span style={{ color: "#F48E28" }}>Hari-Hari</span> Anda
          </h1>
          <div className="text-desc-own mt-3">
            Margareth Alexandra Winata pemilik Atma Bakery adalah seorang
            visioner yang menggabungkan keahlian kuliner dengan dedikasi untuk
            menciptakan pengalaman berharga melalui rasa setiap produk
            kue-kuenya
          </div>
          {/* {errorMessage && <div className="error-message">{errorMessage}</div>} */}
        </Col>
        <Col xl={7} lg={7} md={12} sm={12}>
          <Image src={owner} className="foto-owner" />
          <div className="rectangle-container">
            <div className="rectangleLanding-2" />
            <div className="rectangleLanding-3" />
          </div>
        </Col>
      </Row>
      <div className="bg-beda" />
      <Row className="mt-4 mt-lg-2 mt-md-0 mb-0 mb-md-2">
        <Col xl={5} lg={12} md={12} sm={12}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
            }}
            className="mt-0 mt-lg-3 mt-md-3 pt-0 pt-lg-4 pt-md-0"
          >
            <span style={{ color: "#FF5B19" }}>Produk Pertama</span> Kali Hadir{" "}
            <br />
            Sejak<span style={{ color: "#FF5B19" }}>
              {" "}
              Hari Pertama
            </span> Atma <br />
            Bakery Berdiri <span style={{ color: "#FF5B19" }}> Tahun 2022</span>
          </h1>
          <div className="text-desc-own my-4">
            Sejak awal berdirinya tahun 2022 Atma Bakery telah menawarkan empat
            produk klasik yang menjadi ciri khasnya. Lapis Legit, Lapis
            Surabaya, Spikoe, dan Mandarin telah menjadi pilihan utama sejak
            hari pertama, mencerminkan dedikasi bakery dalam menciptakan kue-kue
            berkualitas tinggi yang selalu memukau pelanggan.
          </div>
          <div className="text-desc-own my-4">
            Lapis Legit memiliki tekstur lembut dan lapisan rempah yang kaya.
            Lapis Surabaya kombinasi kue cokelat dan kuning yang lembut. Spikoe
            dengan konsistensi sempurna dan rasa lembut. Mandarin, kue manis
            dengan sentuhan citrus segar. Keempatnya mencerminkan kualitas
            tinggi dari Atma Bakery.
          </div>
        </Col>
        <Col xl={7} lg={12} md={12} sm={12} className="pt-0 pt-lg-0 pt-md-2">
          <Image src={produk} className="produk-admin" />
        </Col>
      </Row>

      <Row className="mb-0 mb-lg-4 mb-md-3">
        <Col xl={6} lg={6} md={12} sm={12} className="pt-1 pt-lg-3 pt-md-2">
          <Row className="pt-0 pt-lg-4 mt-lg-3 mx-auto">
            <Col xl={6} lg={6} md={6} sm={12} className="mb-3">
              <Card className="card-histori rounded-5">
                <Card.Body>
                  <Row className="d-flex justify-content-center">
                    <Image src={bicycle} className="card-histori-icon" />

                    <Card.Text className="text-center card-judul-histori">
                      2022
                    </Card.Text>

                    <Card.Text className="text-center card-font-histori">
                      Berkeliling menjual kue-kue kami dengan menggunakan sepeda
                    </Card.Text>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col xl={6} lg={6} md={6} sm={12} className="mb-3">
              <Card className="card-histori rounded-5">
                <Card.Body>
                  <Row className="d-flex justify-content-center">
                    <Image src={time} className="card-histori-icon" />

                    <Card.Text className="text-center card-judul-histori">
                      2023
                    </Card.Text>

                    <Card.Text className="text-center card-font-histori">
                      Berikan perubahan teknologi pesan kue dimana saja, kapan
                      saja
                    </Card.Text>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="pt-0 mt-0 mx-auto">
            <Col xl={6} lg={6} md={6} sm={12} className="mb-3">
              <Card className="card-histori rounded-5">
                <Card.Body>
                  <Row className="d-flex justify-content-center">
                    <Image src={shop_cart} className="card-histori-icon" />

                    <Card.Text className="text-center card-judul-histori">
                      2024
                    </Card.Text>

                    <Card.Text className="text-center card-font-histori">
                      Bertambah produk kue-kue, minuman, dan camilan manis
                    </Card.Text>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col xl={6} lg={6} md={6} sm={12} className="mb-3">
              <Card className="card-histori rounded-5">
                <Card.Body>
                  <Row className="d-flex justify-content-center">
                    <Image src={hoop_house} className="card-histori-icon" />

                    <Card.Text className="text-center card-judul-histori">
                      Mendatang
                    </Card.Text>

                    <Card.Text className="text-center card-font-histori">
                      Berorientasi kedepan dengan perancangan cabang baru
                    </Card.Text>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col
          xl={6}
          lg={6}
          md={12}
          sm={12}
          className="ps-lg-4 ps-md-4 pt-0 pt-lg-4 pt-md-5"
        >
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
            }}
            className="mt-0 mt-md-2 pt-0 pt-lg-3 pt-md-3 text-lg-right text-sm-left"
          >
            Rintisan <span style={{ color: "#FF5B19" }}>Atma Bakery</span>
            <br />
            Mulai<span style={{ color: "#FF5B19" }}> Tahun Pendirian</span>{" "}
            Hingga
            <br />
            Sekarang<span style={{ color: "#FF5B19" }}> Membawa Perubahan</span>
          </h1>
          <div className="text-desc-own my-3 text-lg-right text-sm-left">
            Rintisan Atma Bakery telah berubah dengan gemilang sejak awal
            berdirinya. Petualangan ini dimulai dengan menjajakan kue-kue lezat
            menggunakan sepeda pada tahun 2022, kemudian menghadirkan keajaiban
            teknologi pesan kue di mana saja pada tahun 2023, serta menambahkan
            sentuhan manis dengan memperluas koleksi kue, minuman, dan camilan
            pada tahun 2024. Kini, Bakery ini tengah bersemangat merancang
            cabang baru untuk memperluas kehadirannya di masa depan.
          </div>
        </Col>
      </Row>
      <div className="bg-beda-bawah" />
      <Row className="mb-sm-5 mt-sm-3 mb-5 pb-5 pb-lg-0">
        <Col xl={5} lg={12} md={12} sm={12} xs={12}>
          <h1
            style={{
              fontSize: "1.7rem",
              fontWeight: "bold",
              textAlign: "center",
            }}
            className="mt-0 mt-md-2 pt-0 pt-lg-3 pt-md-3 pb-0 pb-lg-3 pb-md-3"
          >
            Momen <span style={{ color: "#FF5B19" }}>Pertama</span> Kami
          </h1>
          <Image src={moment_1} className="foto-momen-1" />
        </Col>
        <Col xl={7} lg={12} md={12} sm={12} xs={12} className="text-sm-center">
          <Image src={moment_2} className="foto-momen-2" />
          <div
            className="text-desc-own my-2"
            style={{ textAlign: "left", marginBottom: "0" }}
          >
            Dari sentuhan tradisional hingga inovasi modern, toko kue kami
            adalah perjalanan rasa yang melintasi masa, menghadirkan cita rasa
            yang timeless dalam setiap gigitannya.
          </div>
        </Col>
      </Row>
    </Container>
  );
}
