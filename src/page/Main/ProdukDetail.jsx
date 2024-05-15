import APIProduk from "@/api/APIProduk";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Col,
  Container,
  Row,
  Spinner,
  Form,
  Button,
  InputGroup,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import ReactImageGallery from "react-image-gallery";
import Formatter from "@/assets/Formatter";
import APITransaksi from "@/api/APITransaksi";

export default function ProdukDetail() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDate, setIsLoadingDate] = useState(false);
  const [produk, setProduk] = useState(null);
  const isLogin = sessionStorage.getItem("role") === "CUST" ? true : false;
  const { id } = useParams();

  const [limit, setLimit] = useState(10);
  const [tanggal, setTanggal] = useState(null);
  const [pilihan, setPilihan] = useState("READY");
  const [jumlah, setJumlah] = useState(1);

  const [gambar, setGambar] = useState([
    {
      original:
        "https://res.cloudinary.com/daorbrq8v/image/upload/f_auto,q_auto/v1/atma-bakery/dyc1n9feqhbetyfxe5o5",
      thumbnail:
        "https://res.cloudinary.com/daorbrq8v/image/upload/f_auto,q_auto/v1/atma-bakery/dyc1n9feqhbetyfxe5o5",
    },
  ]);

  const activeButtonPOBeliSekarang = useRef(null);
  const activeButtonPOKeranjang = useRef(null);
  const refReady = useRef(null);
  const refPO = useRef(null);
  const refDate = useRef(null);
  const btnPlus = useRef(null);
  const btnMinus = useRef(null);

  const fetchProduk = useCallback(
    async (signal) => {
      setIsLoading(true);
      try {
        const response = await APIProduk.showProduk(id, signal);

        setProduk(response);

        if (response?.gambar?.length > 0) {
          setGambar(
            response.gambar.map((item) => ({
              original: item.url,
              thumbnail: item.url,
            }))
          );
        }
      } catch (error) {
        setProduk(null);

        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [id]
  );

  const getCountTransaksi = useCallback(
    async (tanggal) => {
      setIsLoadingDate(true);
      try {
        const data = {
          id_produk: id,
          po_date: tanggal,
        };

        const response = await APITransaksi.countTransaksi(data);

        setLimit(response.data);
      } catch (error) {
        setLimit(0);
        console.error(error);
      } finally {
        setIsLoadingDate(false);
      }
    },
    [id]
  );

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetchProduk(signal);

    return () => {
      abortController.abort();
    };
  }, [fetchProduk]);

  const resetField = () => {
    activeButtonPOBeliSekarang.current.disabled = true;
    activeButtonPOKeranjang.current.disabled = true;
    btnMinus.current.disabled = true;
    btnPlus.current.disabled = true;
    setTanggal(null);
    setJumlah(1);
  };

  useEffect(() => {
    if (produk) {
      if (produk.status === "READY") {
        refPO.current?.classList.remove("active");
        refReady.current?.classList.add("active");
      } else {
        refReady.current?.classList.remove("active");
        refPO.current?.classList.add("active");
      }

      if (produk.stok > 0) {
        refPO.current.disabled = true;
        refDate.current.disabled = true;
      } else {
        refPO.current.disabled = false;
      }

      if (produk.limit > 0) {
        refReady.current.disabled = true;
        activeButtonPOBeliSekarang.current.disabled = true;
        activeButtonPOKeranjang.current.disabled = true;
        btnMinus.current.disabled = true;
        btnPlus.current.disabled = true;
      } else {
        refReady.current.disabled = false;
      }
    }
  }, [produk]);

  const namaProdukConverter = (kategori, ukuran, nama) => {
    if (kategori === "CK") {
      return nama + " " + ukuran + " Loyang";
    }

    return nama;
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
      ) : produk === null ? (
        <div className="text-center">
          <h2 className="mt-2 mb-0">Produk Tidak Ditemukan</h2>
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
              {namaProdukConverter(
                produk?.id_kategori,
                produk?.ukuran,
                produk?.nama_produk
              )}
            </Link>
          </div>
          <Row className="pb-5">
            <Col md={6}>
              <ReactImageGallery
                thumbnailPosition="bottom"
                items={gambar}
                showFullscreenButton={false}
                showPlayButton={false}
                slideDuration={500}
                slideInterval={5000}
                autoPlay={true}
                showNav={false}
                infinite
                loading="eager"
              />
            </Col>
            <Col md={6}>
              <h3 className="produk-judul pt-3 pt-md-0 pt-lg-0">
                {namaProdukConverter(
                  produk?.id_kategori,
                  produk?.ukuran,
                  produk?.nama_produk
                )}
              </h3>

              <h4 className="my-2">
                <span
                  style={{
                    color: "#BE1008",
                  }}
                >
                  Rp{" "}
                </span>{" "}
                {Formatter.moneyFormatter(produk?.harga).substring(3)}
              </h4>

              <p
                style={{
                  fontSize: "1.1rem",
                  textAlign: "justify",
                }}
              >
                {produk?.deskripsi}
              </p>

              <Form.Group className="mt-3">
                <Form.Label className="form-label-font">
                  Pesan Untuk Tanggal (Khusus PO)
                </Form.Label>
                <Form.Control
                  className="input-border-produk-tanggal"
                  type="date"
                  min={
                    new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                  }
                  placeholder="Masukkan Tanggal Lahir"
                  name="tanggal"
                  onChange={(e) => {
                    if (e.target.value === "") {
                      resetField();
                      return;
                    }

                    activeButtonPOBeliSekarang.current.disabled = false;
                    activeButtonPOKeranjang.current.disabled = false;
                    btnMinus.current.disabled = false;
                    btnPlus.current.disabled = false;
                    setTanggal(e.target.value);
                    getCountTransaksi(e.target.value);
                  }}
                  disabled={isLoadingDate}
                  ref={refDate}
                  required
                />
              </Form.Group>

              <Row className="mt-3">
                <Col md={12}>
                  <Form.Label className="form-label-font">
                    Pilihan Produk
                  </Form.Label>
                </Col>
                <Col md={12}>
                  <Button
                    variant={
                      "outline-danger input-border-produk-readypo active me-2"
                    }
                    onClick={() => {
                      if (produk.limit > 0) {
                        resetField();
                        return;
                      }
                      refPO.current.classList.remove("active");
                      refReady.current.classList.add("active");
                      refDate.current.disabled = true;
                      refDate.current.value = "";
                      resetField();
                      setPilihan("READY");
                    }}
                    ref={refReady}
                  >
                    Ready Stok
                  </Button>
                  <Button
                    variant="outline-danger input-border-produk-readypo"
                    onClick={() => {
                      if (produk.stok > 0) {
                        resetField();
                        return;
                      }
                      refReady.current.classList.remove("active");
                      refPO.current.classList.add("active");
                      refDate.current.disabled = false;
                      refDate.current.value = "";
                      resetField();
                      setPilihan("PO");
                    }}
                    ref={refPO}
                  >
                    Pre Order
                  </Button>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col md={12}>
                  <Form.Label
                    className="form-label-font"
                    style={{
                      color: "#BE1008",
                      fontSize: "0.9rem",
                    }}
                  >
                    {produk?.limit > 0
                      ? tanggal === "" ||
                        tanggal === null ||
                        tanggal === undefined
                        ? "Silahkan Pilih Tanggal Terlebih Dahulu"
                        : isLoadingDate
                        ? "Loading..."
                        : "Limit Produk Sisa " + limit
                      : "Stok Produk Sisa " + produk?.stok}
                  </Form.Label>
                </Col>
              </Row>

              <Form.Group className="mt-2">
                <Form.Label className="form-label-font">
                  Masukkan Jumlah
                </Form.Label>
                <InputGroup>
                  <Button
                    variant="outline-secondary input-border-produk-plusminus"
                    onClick={() => {
                      if (jumlah > 1 || !isLogin) {
                        setJumlah(jumlah - 1);
                      }
                    }}
                    ref={btnMinus}
                    disabled={!isLogin || isLoadingDate}
                  >
                    -
                  </Button>
                  <Form.Control
                    type="number"
                    className="input-border-produk-jumlah"
                    placeholder="Masukkan Jumlah"
                    name="jumlah"
                    value={jumlah}
                    onChange={(e) => {
                      if (e.target.value < 1) {
                        setJumlah(1);
                      }
                      setJumlah(parseInt(e.target.value));
                    }}
                    required
                    readOnly
                  />
                  <Button
                    variant="outline-secondary input-border-produk-plusminus"
                    onClick={() => {
                      if (
                        jumlah === produk.stok ||
                        jumlah === produk.limit ||
                        !isLogin
                      ) {
                        return;
                      }
                      setJumlah(jumlah + 1);
                    }}
                    ref={btnPlus}
                    disabled={!isLogin || isLoadingDate}
                  >
                    +
                  </Button>
                </InputGroup>
              </Form.Group>
              <Row className="mt-4">
                <Col>
                  <Button
                    variant="outline-secondary button-bayar w-100"
                    disabled={!isLogin || isLoadingDate}
                    ref={activeButtonPOBeliSekarang}
                  >
                    Beli Sekarang
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="outline-secondary button-tambahkeranjang w-100"
                    disabled={!isLogin || isLoadingDate}
                    ref={activeButtonPOKeranjang}
                  >
                    + Keranjang
                  </Button>
                </Col>
              </Row>
              {!isLogin && (
                <Row
                  className="mt-1 text-center"
                  style={{
                    fontSize: "1.2rem",
                    color: "#BE1008",
                  }}
                >
                  <Col>
                    <p>
                      Silahkan Login sebagai Customer terlebih dahulu untuk
                      melakukan pembelian
                    </p>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}
