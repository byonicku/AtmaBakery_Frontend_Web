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
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactImageGallery from "react-image-gallery";
import Formatter from "@/assets/Formatter";
import APITransaksi from "@/api/APITransaksi";
import { useMutation } from "@tanstack/react-query";
import APICart from "@/api/APICart";
import { toast } from "sonner";

export default function ProdukDetail() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDate, setIsLoadingDate] = useState(false);
  const [produk, setProduk] = useState(null);
  const isLogin = sessionStorage.getItem("role") === "CUST" ? true : false;
  const isAlreadyPO =
    sessionStorage.getItem("po_date") !== "null" &&
    sessionStorage.getItem("po_date") !== null &&
    sessionStorage.getItem("po_date") !== ""
      ? true
      : false;

  const { id } = useParams();

  const [limit, setLimit] = useState(10);
  const [tanggal, setTanggal] = useState("");
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

  const activeButtonPOKeranjang = useRef(null);
  const refReady = useRef(null);
  const refPO = useRef(null);
  const refDate = useRef(null);
  const btnPlus = useRef(null);
  const btnMinus = useRef(null);

  const navigate = useNavigate();

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

        if (response?.stok > 0) {
          setLimit(0);
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

        setTanggal(tanggal);
        setLimit(response.data.remaining);
        setJumlah(1);
      } catch (error) {
        setLimit(0);
        console.error(error);
      } finally {
        setIsLoadingDate(false);
      }
    },
    [id]
  );

  // Add Data
  const add = useMutation({
    mutationFn: (data) => APICart.createCart(data),
    onSuccess: async () => {
      toast.success("Tambah Produk ke keranjang berhasil!");
      if (!isAlreadyPO) {
        sessionStorage.setItem("po_date", tanggal);
      }

      resetField();
      navigate("/keranjang");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleAddKerajang = async () => {
    if (
      (tanggal === "" || tanggal === null || tanggal === undefined) &&
      pilihan === "PO" &&
      produk?.stok === 0
    ) {
      toast.error("Tanggal tidak boleh kosong!");
      return;
    }

    if (jumlah === 0) {
      toast.error("Jumlah tidak boleh 0!");
      return;
    }

    if (jumlah > produk.stok && pilihan === "READY") {
      toast.error("Jumlah melebihi stok produk!");
      return;
    }

    if (jumlah > produk.limit && pilihan === "PO") {
      toast.error("Jumlah melebihi limit produk!");
      return;
    }

    if (
      jumlah > produk.stok &&
      pilihan === "READY" &&
      produk?.status === "PO"
    ) {
      toast.error("Jumlah melebihi stok produk!");
      return;
    }

    if (limit === 0 && pilihan === "PO") {
      toast.error("Limit produk sudah habis pada hari tersebut!");
      return;
    }

    const data = {
      id_produk: id,
      jumlah: jumlah,
      status: pilihan,
    };

    if (pilihan === "PO" || isAlreadyPO) {
      data.po_date = tanggal;
    }

    await add.mutateAsync(data);
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetchProduk(signal);

    return () => {
      abortController.abort();
    };
  }, [fetchProduk]);

  const resetField = () => {
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

      if (produk?.status === "READY") {
        refPO.current.disabled = true;
        refDate.current.disabled = true;
        setPilihan("READY");
      } else {
        refPO.current.disabled = false;
      }

      if (produk?.status === "PO" && produk?.stok > 0) {
        refPO.current.disabled = false;
        refReady.current.disabled = false;
        activeButtonPOKeranjang.current.disabled = true;
        refDate.current.disabled = false;
        btnMinus.current.disabled = true;
        btnPlus.current.disabled = true;
        setPilihan("PO");
      } else if (produk?.status === "PO") {
        refReady.current.disabled = true;
        activeButtonPOKeranjang.current.disabled = true;
        btnMinus.current.disabled = true;
        btnPlus.current.disabled = true;
        setPilihan("PO");
      } else {
        refReady.current.disabled = false;
      }

      if (isAlreadyPO) {
        const date = sessionStorage.getItem("po_date");
        refDate.current.value = date;
        getCountTransaksi(date);
        refDate.current.disabled = true;
      }
    }
  }, [produk, getCountTransaksi, isAlreadyPO, isLogin]);

  const namaProdukConverter = (kategori, ukuran, nama) => {
    if (kategori === "CK") {
      return nama + " " + ukuran + " Loyang";
    }

    return nama;
  };

  const checkMinimium = () => {
    return (
      (produk?.stok === 0 && produk?.status === "READY") ||
      (limit === 0 && produk?.status === "PO")
    );
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
                  value={tanggal}
                  placeholder="Masukkan Tanggal Pesan"
                  name="tanggal"
                  onChange={(e) => {
                    if (e.target.value === "") {
                      resetField();
                      return;
                    }

                    if (isLogin) {
                      activeButtonPOKeranjang.current.disabled = false;
                      btnMinus.current.disabled = false;
                      btnPlus.current.disabled = false;
                    }

                    setTanggal(e.target.value);
                    getCountTransaksi(e.target.value);
                  }}
                  disabled={
                    isLoadingDate ||
                    isAlreadyPO ||
                    add.isPending ||
                    checkMinimium()
                  }
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
                      if (add.isPending) {
                        return;
                      }

                      if (produk.limit > 0 && produk.stok === 0) {
                        resetField();
                        return;
                      }

                      refPO.current.classList.remove("active");
                      refReady.current.classList.add("active");
                      refDate.current.disabled = true;
                      refDate.current.value = "";

                      if (!isLogin) {
                        return;
                      }

                      btnMinus.current.disabled = false;
                      btnPlus.current.disabled = false;
                      if (produk.stok > 0) {
                        setJumlah(1);
                        activeButtonPOKeranjang.current.disabled = false;
                      }
                      setPilihan("READY");
                    }}
                    ref={refReady}
                  >
                    Ready Stok
                  </Button>
                  <Button
                    variant="outline-danger input-border-produk-readypo"
                    onClick={() => {
                      if (add.isPending) {
                        return;
                      }

                      if (produk.stok > 0 && produk.limit === 0) {
                        resetField();
                        return;
                      }

                      refReady.current.classList.remove("active");
                      refPO.current.classList.add("active");
                      refDate.current.disabled = false;
                      refDate.current.value = "";

                      if (!isLogin) {
                        return;
                      }

                      resetField();
                      setPilihan("PO");
                    }}
                    ref={refPO}
                  >
                    Pre Order
                  </Button>
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
                    disabled={!isLogin || isLoadingDate || add.isPending}
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
                        (jumlah === produk?.stok && pilihan === "READY") ||
                        jumlah === limit ||
                        !isLogin
                      ) {
                        console.log("masuk");
                        return;
                      }
                      setJumlah(jumlah + 1);
                    }}
                    ref={btnPlus}
                    disabled={
                      !isLogin ||
                      isLoadingDate ||
                      add.isPending ||
                      limit === jumlah ||
                      (jumlah === produk?.stok && pilihan === "READY")
                    }
                  >
                    +
                  </Button>
                </InputGroup>
              </Form.Group>

              <Row className="mt-3">
                <Col md={12}>
                  <Form.Label
                    className="form-label-font"
                    style={{
                      color: "#BE1008",
                      fontSize: "0.9rem",
                    }}
                  >
                    {produk?.limit > 0 && pilihan === "PO"
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

              <Row className="mt-4">
                <Col>
                  <Button
                    variant="outline-secondary button-tambahkeranjang w-100"
                    disabled={!isLogin || isLoadingDate || add.isPending}
                    ref={activeButtonPOKeranjang}
                    onClick={handleAddKerajang}
                  >
                    + Keranjang
                  </Button>
                </Col>
              </Row>
              {!isLogin && (
                <Row
                  className="mt-1 text-center"
                  style={{
                    fontSize: "0.9rem",
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

              {produk?.status === "PO" ||
                (produk?.stok === 0 && checkMinimium() && (
                  <Row
                    className="mt-1 text-center"
                    style={{
                      fontSize: "0.9rem",
                      color: "#BE1008",
                    }}
                  >
                    <Col>
                      <p>
                        Produk ini tidak tersedia, silahkan pilih produk lain
                        atau tanggal lain
                      </p>
                    </Col>
                  </Row>
                ))}
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}
