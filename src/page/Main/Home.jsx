import { Row, Col, Button, Container, Image, Card } from "react-bootstrap";
import { MdArrowRight, MdOutlinePlayCircleFilled } from "react-icons/md";
import Abstrak from "@/assets/Abstrak.svg";
import jam from "@/assets/jam.svg";
import lokasi from "@/assets/lokasi.svg";
import telepon from "@/assets/telepon.svg";
import cultery from "@/assets/cultery.svg";
import sendokgarpu from "@/assets/sendokgarpu.svg";
import mobil from "@/assets/mobil.svg";
import laptop from "@/assets/laptop.svg";
import paket from "@/assets/paket.svg";
import roti from "@/assets/roti.svg";

import CardProduk from "@/component/Main/CardProduk";

// import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  // const [errorMessage, setErrorMessage] = useState("");

  const handleClickCoding2 = () => {
    toast.error("Fitur Belum Tersedia!");
  };

  const produk = [
    {
      image: "https://via.placeholder.com/150",
      nama: "Kue Kering",
      ukuran: "1/2 Kg",
      harga: "50.000",
      kategori: "Kue Kering",
    },
    {
      image: "https://via.placeholder.com/150",
      nama: "Kue Basah",
      ukuran: "1/2 Kg",
      harga: "50.000",
      kategori: "Kue Basah",
    },
    {
      image: "https://via.placeholder.com/150",
      nama: "Kue Tart",
      ukuran: "1/2 Kg",
      harga: "50.000",
      kategori: "Kue Tart",
    },
    {
      image: "https://via.placeholder.com/150",
      nama: "Kue Bolu",
      ukuran: "1/2 Kg",
      harga: "50.000",
      kategori: "Kue Bolu",
    },
    {
      image: "https://via.placeholder.com/150",
      nama: "Kue Brownies",
      ukuran: "1/2 Kg",
      harga: "50.000",
      kategori: "Kue Brownies",
    },
    {
      image: "https://via.placeholder.com/150",
      nama: "Kue Lainnya",
      ukuran: "1/2 Kg",
      harga: "50.000",
      kategori: "Kue Lainnya",
    },
  ];

  return (
    <Container>
      <Row className="mb-3">
        <Col xl={6} lg={6} md={12} sm={12}>
          <div
            className="ellipse-container button-style"
            onClick={() => window.open("https://www.youtube.com")}
          >
            <span className="ellipse-text">Tonton Video</span>

            <MdOutlinePlayCircleFilled className="btn-circleLanding ms-4" />
          </div>
          <h1 className="main-title mt-5">
            Nikmati <br />
            <span style={{ color: "#F48E28" }}>Kelezatan</span> Yang <br />
            Tak <span style={{ color: "#F48E28" }}>Terlupakan</span>
          </h1>
          <Image src={Abstrak} className="abstrak" />
          <div className="text-desc mt-5">
            Kue-kue ini dibuat dengan teliti menggunakan bahan-bahan berkualitas
            pilihan. Proses pembuatannya menggabungkan keahlian tangan dan
            perhatian mendetail untuk menciptakan produk akhir yang istimewa
          </div>
          {/* {errorMessage && <div className="error-message">{errorMessage}</div>} */}
          <Row className="mt-5">
            <Col xl={6} lg={12} md={12} sm={12} className="mb-3 mb-md-3">
              <Button
                className="button-landing button-style"
                variant="danger"
                block
                onClick={handleClickCoding2}
              >
                Baca Selanjutnya
              </Button>
            </Col>
            <Col xl={6} lg={12} md={12} sm={12} className="mb-3 mb-md-3">
              <Button
                className="button-landing-border button-style"
                variant="outline-light"
                block
                onClick={handleClickCoding2}
              >
                Pesan Sekarang
              </Button>
            </Col>
          </Row>
        </Col>
        <Col xl={6} lg={6} md={12} sm={12}>
          <div className="rectangleLanding"></div>
        </Col>
      </Row>
      <Row className="mx-1 py-5">
        <Card className="card-info-font rounded-4">
          <Row>
            <Col
              xl={4}
              lg={4}
              md={4}
              sm={12}
              className="text-center border-desktop"
            >
              <Image src={jam} className="py-3" />
              <p className="mb-1">Hari Ini 09:00 - 21:00 WIB</p>
              <p
                style={{
                  fontWeight: 500,
                }}
              >
                Waktu Operasional
              </p>
            </Col>
            <Col
              xl={4}
              lg={4}
              md={4}
              sm={12}
              className="text-center border-desktop"
            >
              <Image src={lokasi} className="py-3" />
              <p className="mb-1">Sleman, Daerah Istimewa Yogyakarta</p>
              <p
                style={{
                  fontWeight: 500,
                }}
              >
                Lokasi Kami
              </p>
            </Col>
            <Col xl={4} lg={4} md={4} sm={12} className="text-center">
              <Image src={telepon} className="py-3" />
              <p className="mb-1">(0274) 487711</p>
              <p
                style={{
                  fontWeight: 500,
                }}
              >
                Telepon
              </p>
            </Col>
          </Row>
        </Card>
      </Row>
      <Row className="text-center pt-3 pb-0">
        <h5
          style={{
            color: "#F48E28",
          }}
          className="pb-0 mb-0"
        >
          Produk
        </h5>
        <h1 style={{ fontWeight: 600, fontSize: "1.85rem" }} className="pt-0">
          Favorit Sepanjang Masa
        </h1>
        <Row className="py-3 mx-auto">
          {produk.map((item, index) => (
            <Col key={index} xl={4} lg={4} md={6} sm={12} className="mb-3">
              <CardProduk
                image={item.image}
                nama={item.nama}
                ukuran={item.ukuran}
                harga={item.harga}
                kategori={item.kategori}
              />
            </Col>
          ))}
        </Row>
      </Row>

      <Row className="d-flex justify-content-center pb-3">
        <div className="ellipse-container-lihat-selanjutnya">
          <span className="ellipse-text-lihat-selanjutnya">
            Lihat Selengkapnya
          </span>
          <MdArrowRight className="btn-circleLanding ms-4" />
        </div>
      </Row>

      <Row className="text-center py-5">
        <h5
          style={{
            color: "#F48E28",
          }}
          className="pb-0 mb-0"
        >
          Layanan
        </h5>
        <h1 style={{ fontWeight: 600, fontSize: "1.85rem" }} className="pt-0">
          Kenapa Harus Memilih Produk Kami?
        </h1>
        <Row className="py-3 mx-auto">
          <Col xl={4} lg={4} md={6} sm={12} className="mb-3">
            <Card className="card-layanan rounded-5">
              <Card.Body>
                <Row className="d-flex justify-content-center">
                  <Image src={cultery} className="my-5 card-layanan-icon" />

                  <Card.Text className="text-center card-judul-layanan mb-2">
                    Mengutamakan Kualitas
                  </Card.Text>

                  <Card.Text className="text-center card-font-layanan mb-4">
                    Setiap bahan yang digunakan produk kami memperhatikan
                    kualitas demi kualitas untuk mencapai citra rasa terbaik
                  </Card.Text>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={4} lg={4} md={6} sm={12} className="mb-3">
            <Card className="card-layanan rounded-5">
              <Card.Body>
                <Row className="d-flex justify-content-center">
                  <Image src={sendokgarpu} className="my-5 card-layanan-icon" />

                  <Card.Text
                    className="text-center card-judul-layanan mb-2"
                    style={{
                      fontStyle: "italic",
                    }}
                  >
                    Bake from Heart
                  </Card.Text>

                  <Card.Text className="text-center card-font-layanan mb-4">
                    Terpercaya dalam pembuatan setiap produk setiap olahan dan
                    proses ditangani oleh ahlinya. Produk kami{" "}
                    <span
                      style={{
                        fontWeight: "bold",
                        fontStyle: "italic",
                      }}
                    >
                      “Bake from Heart”
                    </span>
                  </Card.Text>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={4} lg={4} md={6} sm={12} className="mb-3">
            <Card className="card-layanan rounded-5">
              <Card.Body>
                <Row className="d-flex justify-content-center">
                  <Image src={mobil} className="my-5 card-layanan-icon" />

                  <Card.Text className="text-center card-judul-layanan mb-2">
                    Pengiriman Cepat
                  </Card.Text>

                  <Card.Text className="text-center card-font-layanan mb-4">
                    Pengiriman atau pengambilan pada toko kami dilakukan dengan
                    cepat dan aman untuk sampai ke pelanggan
                  </Card.Text>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Row>

      <Row className="text-center mt-3 mb-5">
        <h5
          style={{
            color: "#F48E28",
          }}
          className="pb-0 mb-0"
        >
          Alur Pemesanan Produk
        </h5>
        <h1 style={{ fontWeight: 600, fontSize: "1.85rem" }} className="pt-0">
          Pesanan Ditangani dengan Profesional
        </h1>
        <Row className="pt-3">
          <Col xl={4} lg={4} md={6} sm={12} className="mb-3">
            <Row>
              <Col xl={12}>
                <Image
                  src={laptop}
                  className="ps-sm-0 my-sm-1 my-3 ps-5 ps-lg-3"
                />
              </Col>
              <Col xl={12}>
                <p className="text-sm-center text-lg-left card-judul-layanan mb-2">
                  PILIH PRODUK
                </p>

                <p className="text-sm-center text-lg-left card-font-layanan mb-4">
                  Pelanggan memilih produk yang akan dipesan dan mengecek
                  ketersediaan produk. Pelanggan dengan pemesanan Pre Order
                  dapat melakukan penyesuaian dengan tanggal yang diinginkan
                  (h-2)
                </p>
              </Col>
            </Row>
          </Col>
          <Col xl={4} lg={4} md={6} sm={12} className="mb-3">
            <Row className="flex-lg-column flex-sm-column-reverse">
              <Col xl={12}>
                <p className="text-center card-judul-layanan mb-2">
                  PEMROSESAN
                </p>

                <p className="text-center card-font-layanan mb-4">
                  Produk yang dipilih akan diproses dengan memperhatikan setiap
                  kualitas dari bahan baku yang akan digunakan dalam pembuatan
                </p>
              </Col>
              <Col xl={12}>
                <Image
                  src={roti}
                  className="ps-sm-0 my-sm-1 my-3 ps-5 ps-lg-3"
                />
              </Col>
            </Row>
          </Col>
          <Col xl={4} lg={4} md={6} sm={12} className="mb-3">
            <Row>
              <Col xl={12}>
                <Image
                  src={paket}
                  className="ps-sm-0 my-sm-1 my-3 ps-5 ps-lg-3"
                  style={{
                    height: "15rem",
                  }}
                />
              </Col>

              <Col xl={12}>
                <p className="text-sm-center text-lg-right card-judul-layanan mb-2">
                  PENGIRIMAN
                </p>

                <p className="text-sm-center text-lg-right card-font-layanan mb-4">
                  Produk dapat memilih pengiriman terpecaya dengan kurir kami,
                  secara mandiri, maupun mengunjungi toko kami untuk pengambilan
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Row>
    </Container>
  );
}
