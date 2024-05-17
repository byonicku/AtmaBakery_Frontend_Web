import { useCallback, useEffect, useState } from "react";
import {
  Col,
  Container,
  Row,
  Spinner,
  Form,
  Button,
  Table,
  Image,
  Card,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Formatter from "@/assets/Formatter";
import APICart from "@/api/APICart";
import APIAlamat from "@/api/APIAlamat";
import { FaTrash } from "react-icons/fa";

import "./css/Keranjang.css";
import { useConfirm } from "@/hooks/useConfirm";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import APITransaksi from "@/api/APITransaksi";

export default function Keranjang() {
  const [isLoading, setIsLoading] = useState(false);
  const [produk, setProduk] = useState([]);
  const [alamat, setAlamat] = useState([]);
  const [selectedAlamat, setSelectedAlamat] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [poin, setPoin] = useState(0);
  const [selectedPengiriman, setSelectedPengiriman] = useState("");
  const [gunakanPoin, setGunakanPoin] = useState(false);
  const [userPoin, setUserPoin] = useState(0);
  const { confirm, modalElement } = useConfirm();

  const defaultGambar =
    "https://res.cloudinary.com/daorbrq8v/image/upload/f_auto,q_auto/v1/atma-bakery/dyc1n9feqhbetyfxe5o5";

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

  useEffect(() => {
    setSubtotal(
      produk?.reduce(
        (total, item) =>
          total +
          parseInt(item?.produk?.harga ?? item?.hampers?.harga) * item?.jumlah,
        0
      )
    );
    setTotal(
      produk?.reduce(
        (total, item) =>
          total +
          parseInt(item?.produk?.harga ?? item?.hampers?.harga) * item?.jumlah,
        0
      ) - (gunakanPoin ? userPoin * 100 : 0)
    );

    setPoin(
      hitungPoint(
        produk?.reduce(
          (total, item) =>
            total +
            parseInt(item?.produk?.harga ?? item?.hampers?.harga) *
              item?.jumlah,
          0
        ),
        0
      )
    );
  }, [gunakanPoin, produk, userPoin]);

  const ukuranConverter = (ukuran, id_kategori) => {
    const converters = {
      CK: `${ukuran} Loyang`,
      RT: "Isi 10/Box",
      MNM: "Per Liter",
      TP: "Per Bungkus",
    };
    return converters[id_kategori] || "Per Box";
  };

  const kategoriConverter = (id_kategori) => {
    const converters = {
      CK: "Cake",
      RT: "Roti",
      MNM: "Minuman",
      TP: "Titipan",
    };
    return converters[id_kategori] || "Hampers";
  };

  const hitungPoint = (totalAmount, points) => {
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
  };

  const checkout = useMutation({
    mutationFn: (data) => APITransaksi.checkoutTransaksi(data),
    onSuccess: async () => {
      toast.success("Checkout berhasil!");
      fetchKeranjang();
      sessionStorage.setItem("po_date", null);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const del = useMutation({
    mutationFn: (id) => APICart.deleteCart(id),
    onSuccess: async () => {
      toast.success("Hapus Produk dari Keranjang berhasil!");
      fetchKeranjang();

      if (!(produk.length > 1)) {
        sessionStorage.setItem("po_date", null);
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleDeleteItem = async (item) => {
    const isConfirmed = await confirm(
      "Apakah anda yakin ingin menghapus produk ini dari keranjang?",
      "",
      "Hapus",
      false
    );

    if (!isConfirmed) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      await del.mutateAsync(item.id_cart);
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Sesuatu sedang bermasalah pada server!"
      );
    }
  };

  const delAll = useMutation({
    mutationFn: () => APICart.deleteCartAll(),
    onSuccess: async () => {
      toast.success("Kosongkan Keranjang berhasil!");
      fetchKeranjang();
      sessionStorage.setItem("po_date", null);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleDeleteAllItem = async () => {
    const isConfirmed = await confirm(
      "Apakah anda yakin ingin menghapus semua produk ini dari keranjang?",
      "",
      "Hapus",
      false
    );

    if (!isConfirmed) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      await delAll.mutateAsync();
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Sesuatu sedang bermasalah pada server!"
      );
    }
  };

  const handleCheckout = async () => {
    if (!selectedPengiriman) {
      toast.error("Pilih pengiriman terlebih dahulu!");
      return;
    }

    if (selectedPengiriman === "Kurir" && !selectedAlamat) {
      toast.error("Pilih alamat terlebih dahulu!");
      return;
    }

    const isConfirmed = await confirm(
      "Apakah anda yakin ingin melakukan checkout?",
      "",
      "Ya",
      false
    );

    if (!isConfirmed) {
      setIsLoading(false);
      return;
    }

    const nama = sessionStorage.getItem("nama");
    const no_hp = sessionStorage.getItem("no_hp");

    const data = {
      nama_penerima: nama,
      no_telp_penerima: no_hp,
      lokasi: selectedAlamat.lokasi,
      tipe_delivery: selectedPengiriman,
      keterangan: selectedAlamat.keterangan,
      pengiriman: selectedPengiriman,
      gunakan_poin: gunakanPoin,
      total: subtotal,
      is_using_poin: gunakanPoin,
      status: "Menunggu Pembayaran",
    };

    if (
      sessionStorage.getItem("po_date") !== null ||
      sessionStorage.getItem("po_date") !== "null"
    ) {
      data.po_date = sessionStorage.getItem("po_date");
      data.nama_penerima = selectedAlamat.nama_lengkap;
      data.no_telp_penerima = selectedAlamat.no_hp;
    }

    try {
      setIsLoading(true);
      await checkout.mutateAsync(data);
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Sesuatu sedang bermasalah pada server!"
      );
    }
  };

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
      ) : produk?.length === 0 ? (
        <div className="text-center">
          <h2 className="mt-2 mb-0">Keranjang Kosong</h2>
          <Link to="/produk" className="error-button">
            <Button
              className="button-landing button-style mt-5"
              variant="danger"
            >
              Kembali ke Produk
            </Button>
          </Link>
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
                              src={
                                item?.produk?.gambar[0]?.url ??
                                item?.hampers?.gambar[0]?.url ??
                                defaultGambar
                              }
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
                                fontSize: "0.9rem",
                              }}
                            >
                              {(item?.produk?.nama_produk ??
                                item?.hampers?.nama_hampers) +
                                " " +
                                ukuranConverter(
                                  item?.produk?.ukuran,
                                  item?.produk?.id_kategori
                                )}
                            </p>
                            {item?.po_date && (
                              <p
                                style={{
                                  fontSize: "0.8rem",
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
                              {item?.produk?.status === "PO" ||
                              item?.status === "PO"
                                ? "Pre Order"
                                : "Ready Stok"}
                            </p>
                          </Col>
                        </Row>
                      </td>
                      <td>{item?.jumlah}</td>
                      <td>
                        {Formatter.moneyFormatter(
                          parseInt(
                            item?.produk?.harga ?? item?.hampers?.harga
                          ) * item?.jumlah
                        )}
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          className="ml-3 mr-3 custom-danger-btn"
                          onClick={() => handleDeleteItem(item)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button
                variant="danger custom-danger-btn w-100 my-2"
                onClick={handleDeleteAllItem}
                style={{
                  fontSize: "1rem",
                  fontWeight: "500",
                }}
              >
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
                    <Form.Group className={!selectedPengiriman ? "" : "mb-3"}>
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
                        <option value="" disabled hidden selected>
                          Pilih Pengiriman
                        </option>
                        <option value="Kurir">Kurir</option>
                        <option value="Ojol">Ojek Online</option>
                        <option value="Ambil">Ambil di tempat</option>
                      </Form.Select>
                    </Form.Group>
                    {selectedPengiriman === "Kurir" && (
                      <Form.Group className="my-3">
                        <Form.Label
                          style={{ fontWeight: "bold", fontSize: "1rem" }}
                        >
                          Alamat
                        </Form.Label>
                        <Form.Select
                          name="alamat"
                          disabled={alamat?.length === 0}
                          onChange={(e) => setSelectedAlamat(e.target.value)}
                          required
                        >
                          <option value="" disabled hidden selected>
                            {alamat?.length === 0
                              ? "Tambah Alamat di Profile Anda"
                              : "Pilih Alamat"}
                          </option>
                          {alamat?.map((item, index) => (
                            <option key={index}>{item?.lokasi}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    )}
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
                        {Formatter.moneyFormatter(subtotal)}
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
                          total - (gunakanPoin ? userPoin * 100 : 0)
                        )}
                      </Col>
                    </Row>
                    <Row className="pt-2">
                      <Col md={6} className="left-detail text-muted">
                        Poin dari Pesanan Ini
                      </Col>
                      <Col md={6} className="right-detail text-muted">
                        {poin}
                      </Col>
                    </Row>
                    <Row className="pt-4">
                      <Button
                        variant="secondary"
                        type="submit"
                        className="button-checkout"
                        onClick={handleCheckout}
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
      {modalElement}
    </Container>
  );
}
