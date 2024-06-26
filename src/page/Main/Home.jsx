import {
  Row,
  Col,
  Button,
  Container,
  Image,
  Card,
  Form,
} from "react-bootstrap";
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
import gambar_kue from "@/assets/gambar_kue.svg";
import produk_awal from "@/assets/produk_awal.svg";

import CardProduk from "@/component/Main/CardProduk";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";

import APIProduk from "@/api/APIProduk";
import Formatter from "@/assets/Formatter";
import CardProdukSkeleton from "@/component/Main/CardProdukSkeleton";

export default function Home() {
  // const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  const [produk, setProduk] = useState([]);

  const fetchProduk = useCallback(async (signal) => {
    setIsLoading(true);
    try {
      const response = await APIProduk.getAllProduk(signal);
      const remove = response.filter((item) => item.ukuran !== "1/2");
      const reverse = remove.reverse();
      const slice = reverse.slice(0, 6);
      setProduk(slice);
    } catch (error) {
      setProduk([]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Pas masuk load produk
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetchProduk(signal);

    return () => {
      abortController.abort();
    };
  }, [fetchProduk]);

  const ukuranConverter = (ukuran, id_kategori) => {
    switch (id_kategori) {
      case "CK":
        return ukuran + " Loyang";
      case "RT":
        return "Isi 10/Box";
      case "MNM":
        return "Per Liter";
      case "TP":
        return "Per Bungkus";
      default:
        return "Per Box";
    }
  };

  const kategoriConverter = (id_kategori) => {
    switch (id_kategori) {
      case "CK":
        return "Cake";
      case "RT":
        return "Roti";
      case "MNM":
        return "Minuman";
      case "TP":
        return "Titipan";
    }
  };

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
          <Row className="mt-5 text-center text-lg-left">
            <Col xl={6} lg={12} md={12} sm={12} className="mb-3 mb-md-3">
              <Button
                className="button-landing button-style"
                variant="danger"
                onClick={() => navigate("/tentang")}
              >
                Baca Selanjutnya
              </Button>
            </Col>
            <Col xl={6} lg={12} md={12} sm={12} className="mb-3 mb-md-3">
              <Button
                className="button-landing-border button-style"
                variant="outline-light"
                onClick={() => navigate("/produk")}
              >
                Pesan Sekarang
              </Button>
            </Col>
          </Row>
        </Col>
        <Col xl={6} lg={6} md={12} sm={12}>
          <Image src={produk_awal} className="produk-awal" />
          <div className="rectangleLanding" />
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

      <Row className="text-center pt-3 pb-0" id="produk">
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
        <Row className="pt-5 mx-auto">
          {isLoading ? (
            <CardProdukSkeleton amount={6} />
          ) : (
            produk.map((item, index) => (
              <Col key={index} xl={4} lg={4} md={6} sm={12} className="mb-3">
                <CardProduk
                  id={item.id_produk}
                  image={item?.gambar[0]?.url}
                  nama={item.nama_produk}
                  ukuran={ukuranConverter(item.ukuran, item.id_kategori)}
                  harga={Formatter.moneyFormatter(item.harga).substring(3)}
                  kategori={kategoriConverter(item.id_kategori)}
                />
              </Col>
            ))
          )}
        </Row>
      </Row>

      <Row className="d-flex justify-content-center pb-3">
        <div
          className="ellipse-container-lihat-selanjutnya"
          style={{
            cursor: "pointer",
          }}
          onClick={() => navigate("/produk")}
        >
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
        <Row className="pt-5 mx-auto">
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
          <Col xl={4} lg={4} md={12} sm={12} className="mb-3">
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
        <Row className="pt-5">
          <Col xl={4} lg={4} md={6} sm={12} className="mb-3">
            <Row>
              <Col xl={12}>
                <Image
                  src={laptop}
                  className="ps-sm-0 my-sm-1 my-3 ps-5 ps-lg-3 p-0"
                  style={{
                    height: "12rem",
                    aspectRatio: "4/3",
                    objectFit: "cover",
                  }}
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
            <Row className="flex-lg-column flex-column-reverse">
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
                  className="ps-sm-0 my-sm-1 my-3 ps-5 ps-lg-3 p-0"
                  style={{
                    height: "14rem",
                  }}
                />
              </Col>
            </Row>
          </Col>
          <Col xl={4} lg={4} md={12} sm={12} className="mb-3">
            <Row>
              <Col xl={12}>
                <Image
                  src={paket}
                  className="ps-sm-0 my-sm-1 my-3 ps-5 ps-lg-3 p-2 ms-1"
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

      <Row className="mb-5 mx-2">
        <Card
          className="card-info-font rounded-5"
          style={{
            backgroundColor: "#818181",
          }}
        >
          <Card.Body className="p-0">
            <Row>
              <Col
                xl={6}
                lg={6}
                md={12}
                sm={12}
                className="gambar-mobile-container"
              >
                <Image
                  src={gambar_kue}
                  style={{
                    width: "100%",
                    objectFit: "cover",
                    height: "100%",
                    aspectRatio: "4/3",
                    marginTop: "-3.5rem",
                  }}
                />
              </Col>
              <Col xl={6} lg={6} md={12} sm={12}>
                <Container className="container-layanan">
                  <p
                    className="mb-1 text-lg-left text-center"
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                      color: "white",
                    }}
                  >
                    Berikan Kata Akan Produk Kami
                  </p>
                  <p
                    className="text-lg-left text-center"
                    style={{
                      fontWeight: 500,
                      color: "white",
                    }}
                  >
                    Kirimkan testimonimu akan produk-produk kami. Mengenai citra
                    rasa, pelayanan, dan sebagainya. Kami senang menerima
                    masukkan Anda!
                  </p>

                  <Form.Control
                    as="textarea"
                    id="komentar"
                    placeholder="Komentar Anda"
                    style={{
                      height: "5rem",
                      resize: "none",
                    }}
                  />
                  <div className="text-center text-lg-left">
                    <Button
                      className="button-landing button-style mt-3"
                      variant="danger"
                      onClick={() => {
                        toast.success("Komentar Terkirim!");
                        document.getElementById("komentar").value = "";
                      }}
                    >
                      Kirim
                    </Button>
                  </div>
                </Container>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
}
