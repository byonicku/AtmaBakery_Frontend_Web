import { useCallback, useEffect, useRef, useState } from "react";
import {
  Col,
  Container,
  Row,
  Spinner,
  Form,
  Button,
  InputGroup,
  Table,
  Image,
  Card,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Formatter from "@/assets/Formatter";
import APICart from "@/api/APICart";

import "./css/Keranjang.css";
import APIAlamat from "@/api/APIAlamat";
import { FaTrash } from "react-icons/fa";

export default function Keranjang() {
  const [isLoading, setIsLoading] = useState(false);
  const [produk, setProduk] = useState(null);
  const [alamat, setAlamat] = useState([]);
  const [selectedAlamat, setSelectedAlamat] = useState(null);
  const [selectedPengiriman, setSelectedPengiriman] = useState(null);
  const [gunakanPoin, setGunakanPoin] = useState(false);
  const [userPoin, setUserPoin] = useState(0);

  const fetchKeranjang = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await APICart.getAllCart();
      setProduk(response.data);
      setUserPoin(response.poin);
    } catch (error) {
      setProduk([]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAlamat = useCallback(async () => {
    try {
      const response = await APIAlamat.getAlamatSelf();
      setAlamat(response);
    } catch (error) {
      setAlamat([]);
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchKeranjang();
    fetchAlamat();
  }, [fetchKeranjang, fetchAlamat]);

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
      default:
        return "Hampers";
    }
  };

  function hitungPoint(totalAmount, points) {
    while (totalAmount >= 10000) {
      if (totalAmount >= 1000000) {
        points += 200;
        totalAmount -= 1000000;
      } else if (totalAmount >= 500000) {
        points += 75;
        totalAmount -= 500000;
      } else if (totalAmount >= 100000) {
        points += 15;
        totalAmount -= 100000;
      } else if (totalAmount >= 10000) {
        points += 1;
        totalAmount -= 10000;
      }
    }
    return points;
  }

  return (
    <Container>
      {isLoading ? (
        <div className="text-center">
          <Spinner
            as="span"
            className="spinner-custom"
            animation="border"
            variant="primary"
            size="lg"
            role="status"
            aria-hidden="true"
          />
          <h6 className="mt-2 mb-0">Loading...</h6>
        </div>
      ) : (
        <>
          <div className="produk-slug">
            <Link to="/produk">Produk</Link> {">"}{" "}
            <Link className="nama-produk" to=".">
              Keranjang
            </Link>
          </div>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            Ringkasan Pesanan
          </div>
          <div
            className="text-muted"
            style={{
              fontSize: "1rem",
            }}
          >
            *Produk yang anda masukan ke keranjang akan dihapus apabila tidak
            melanjutkan checkout H-1 tanggal pengambilan
          </div>
          <Row className="pb-5 pt-3">
            <Col lg={12} xl={8} className="border-keranjang">
              <Table className="table-keranjang" responsive>
                <thead>
                  <tr>
                    <th>Produk</th>
                    <th>Kuantitas</th>
                    <th>Harga</th>
                  </tr>
                </thead>
                <tbody>
                  {produk?.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <Row>
                          <Col lg={4} md={12} sm={12} className="text-left">
                            <Image
                              src={item?.produk?.gambar[0].url}
                              className="rounded-3"
                            />
                          </Col>
                          <Col
                            lg={8}
                            md={12}
                            sm={12}
                            className="text-left pl-lg-3 pt-md-3 pt-lg-0"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                            }}
                          >
                            <p
                              className="mb-0"
                              style={{
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item?.produk?.nama_produk +
                                " " +
                                ukuranConverter(
                                  item?.produk?.ukuran,
                                  item?.produk?.id_kategori
                                )}
                            </p>
                            {item?.po_date && (
                              <p
                                style={{
                                  fontSize: "0.85rem",
                                  fontWeight: "500",
                                }}
                                className="text-left"
                              >
                                Pesan untuk tanggal{" "}
                                <span style={{ color: "#F48E28" }}>
                                  {Formatter.dateFormatter(item?.po_date)}
                                </span>
                              </p>
                            )}
                            <p className="mb-0">
                              <small>
                                {kategoriConverter(item?.produk?.id_kategori)}
                              </small>
                            </p>
                            <p
                              style={{
                                fontSize: "0.85rem",
                                fontWeight: "500",
                                color: "#0BA42D",
                              }}
                            >
                              {item?.produk?.status === "PO"
                                ? "Pre Order"
                                : "Ready Stok"}
                            </p>
                          </Col>
                        </Row>
                      </td>
                      <td>
                        <InputGroup className="m-0 p-0">
                          <Button
                            variant="outline-secondary input-border-produk-plusminus"
                            onClick={() => {
                              if (item?.jumlah > 1) {
                                item.jumlah -= 1;
                              }
                            }}
                          >
                            -
                          </Button>
                          <Form.Control
                            type="number"
                            className="input-border-produk-jumlah"
                            placeholder="Masukkan Jumlah"
                            name="jumlah"
                            value={item?.jumlah}
                            // onChange={(e) => {
                            //   if (e.target.value < 1) {
                            //     setJumlah(1);
                            //   }
                            //   setJumlah(parseInt(e.target.value));
                            // }}
                            required
                            readOnly
                          />
                          <Button
                            variant="outline-secondary input-border-produk-plusminus"
                            onClick={() => {
                              if (item?.jumlah > 1) {
                                return;
                              }
                              item.jumlah += 1;
                            }}
                            // ref={btnPlus}
                            // disabled={!isLogin || isLoadingDate}
                          >
                            +
                          </Button>
                        </InputGroup>
                      </td>
                      <td>
                        {Formatter.moneyFormatter(
                          item?.produk?.harga * item?.jumlah
                        )}
                      </td>
                      <td>
                        <Button variant="danger">
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Button variant="danger custom-danger-btn w-100 my-3">
                Kosongkan Keranjang
              </Button>
            </Col>
            <Col lg={12} xl={4} md={12} className="pl-3">
              <Form onSubmit={(e) => e.preventDefault()}>
                <h3
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                  }}
                >
                  Detail Pengiriman
                </h3>
                <Card className="shadow">
                  <Card.Body>
                    <Form.Group>
                      <Form.Label
                        style={{ fontWeight: "bold", fontSize: "1rem" }}
                      >
                        Alamat
                      </Form.Label>

                      <Form.Select
                        name="alamat"
                        onChange={(e) => setSelectedAlamat(e.target.value)}
                        required
                      >
                        <option value="" disabled selected hidden>
                          {alamat?.length === 0
                            ? "Tambah Alamat Baru di Profil Anda"
                            : "Pilih Alamat"}
                        </option>
                        {alamat?.map((item, index) => (
                          <option key={index}>{item?.lokasi}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mt-3">
                      <Form.Label
                        style={{ fontWeight: "bold", fontSize: "1rem" }}
                      >
                        Pilih Pengiriman
                      </Form.Label>

                      <Form.Select
                        name="pengiriman"
                        onChange={(e) => setSelectedPengiriman(e.target.value)}
                        required
                      >
                        <option value="" disabled selected hidden>
                          Pilih Pengiriman
                        </option>
                        <option value="Kurir">Kurir</option>
                        <option value="Ojol">Ojek Online</option>
                        <option value="Ambil">Ambil di tempat</option>
                      </Form.Select>
                    </Form.Group>
                  </Card.Body>
                </Card>
                <h3
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                  }}
                  className="pt-3"
                >
                  Detail Belanja
                </h3>
                <Card className="shadow">
                  <Card.Body className="m-2">
                    <Row
                      style={{
                        borderBottom: "2px dotted #E0E0E0",
                      }}
                      className="pb-2"
                    >
                      <Col md={6} className="left-detail">
                        Gunakan Poin?
                      </Col>
                      <Col md={6} className="right-detail">
                        <Form.Check
                          type="checkbox"
                          onChange={() => setGunakanPoin(!gunakanPoin)}
                        />
                      </Col>
                    </Row>
                    <Row
                      className={
                        selectedPengiriman === "Kurir" ? "pt-2" : "py-2"
                      }
                    >
                      <Col md={6} className="left-detail">
                        Subtotal
                      </Col>
                      <Col md={6} className="right-detail">
                        {Formatter.moneyFormatter(
                          produk?.reduce(
                            (total, item) => total + item?.produk?.harga,
                            0
                          )
                        )}
                      </Col>
                    </Row>
                    {selectedPengiriman === "Kurir" && (
                      <Row className="py-2">
                        <Col md={6} className="left-detail">
                          Ongkos Kirim
                        </Col>
                        <Col md={6} className="right-detail">
                          Akan di informasikan
                        </Col>
                      </Row>
                    )}
                    {gunakanPoin && (
                      <Row
                        className="py-2"
                        style={{
                          borderBottom: "2px dotted #E0E0E0",
                        }}
                      >
                        <Col md={6} className="left-detail">
                          Potongan {userPoin} Poin
                        </Col>
                        <Col md={6} className="right-detail">
                          - {Formatter.moneyFormatter(userPoin * 100)}
                        </Col>
                      </Row>
                    )}
                    <Row
                      className="pt-2"
                      style={{
                        borderTop: !gunakanPoin ? "2px dotted #E0E0E0" : "none",
                      }}
                    >
                      <Col md={6} className="left-detail">
                        Total
                      </Col>
                      <Col md={6} className="right-detail">
                        {Formatter.moneyFormatter(
                          produk?.reduce(
                            (total, item) => total + item?.produk?.harga,
                            0
                          ) - (gunakanPoin ? userPoin * 100 : 0)
                        )}
                      </Col>
                    </Row>
                    <Row className="pt-2">
                      <Col md={6} className="left-detail text-muted">
                        Poin dari Pesanan Ini
                      </Col>
                      <Col md={6} className="right-detail text-muted">
                        {hitungPoint(
                          produk?.reduce(
                            (total, item) => total + item?.produk?.harga,
                            0
                          ),
                          0
                        )}
                      </Col>
                    </Row>
                    <Row className="pt-4">
                      <Button
                        variant="secondary"
                        type="submit"
                        className="button-checkout"
                      >
                        Checkout
                      </Button>
                    </Row>
                  </Card.Body>
                </Card>
              </Form>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}
