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
import APIHampers from "@/api/APIHampers";
import APITransaksi from "@/api/APITransaksi";
import { useMutation } from "@tanstack/react-query";
import APICart from "@/api/APICart";
import { toast } from "sonner";

export default function HampersDetail() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDate, setIsLoadingDate] = useState(false);
  const [hampers, setHampers] = useState(null);
  const { id } = useParams();
  const isLogin = sessionStorage.getItem("role") === "CUST" ? true : false;
  const isAlreadyPO =
    sessionStorage.getItem("po_date") !== "null" &&
    sessionStorage.getItem("po_date") !== null &&
    sessionStorage.getItem("po_date") !== ""
      ? true
      : false;

  const [minLimitOrStok, setMinLimitOrStok] = useState(null);
  const [limit, setLimit] = useState([]);
  const [tanggal, setTanggal] = useState("");
  const [pilihan, setPilihan] = useState("PO");
  const [jumlah, setJumlah] = useState(1);

  const [detail_hampers, setDetailHampers] = useState([]);

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

  const fetchHampers = useCallback(
    async (signal) => {
      setIsLoading(true);
      try {
        const response = await APIHampers.showHampers(id, signal);

        setHampers(response);
        setPilihan(response?.status);
        setDetailHampers(response?.detail_hampers);
        if (response.gambar?.length > 0) {
          setGambar(
            response.gambar.map((item) => ({
              original: item.url,
              thumbnail: item.url,
            }))
          );
        }
      } catch (error) {
        setHampers(null);
        setDetailHampers(null);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetchHampers(signal);

    return () => {
      abortController.abort();
    };
  }, [fetchHampers]);

  const getCountTransaksi = useCallback(
    async (tanggal) => {
      setIsLoadingDate(true);
      try {
        const data = {
          id_hampers: id,
          po_date: tanggal,
        };

        const response = await APITransaksi.countTransaksiWithHampers(data);

        setTanggal(tanggal);
        setLimit(response.data);
        setJumlah(1);
        setMinLimitOrStok(response.min);
      } catch (error) {
        setLimit([]);
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
      if (!isAlreadyPO && hampers.status === "PO") {
        sessionStorage.setItem("po_date", tanggal);
      }

      resetField();
      navigate("/keranjang");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const multiplyJumlah = useCallback((detailHampers, jumlah) => {
    return detailHampers.map((item) => item?.jumlah * jumlah);
  }, []);

  const getLimitOrStok = useCallback((limits) => {
    return limits.map((item) =>
      item?.stok > 0 ? item?.stok : item?.remaining
    );
  }, []);

  const checkLimits = useCallback(
    (detailHampersMult, detailHampersLimitOrStok) => {
      return !detailHampersLimitOrStok.some(
        (item, index) => item < detailHampersMult[index]
      );
    },
    []
  );

  const handleAddKerajang = useCallback(async () => {
    if ((tanggal === "" || !tanggal) && pilihan === "PO") {
      toast.error("Tanggal tidak boleh kosong!");
      return;
    }

    if (jumlah === 0) {
      toast.error("Jumlah tidak boleh 0!");
      return;
    }

    if (limit.some((data) => jumlah > data?.stok) && pilihan === "READY") {
      toast.error("Jumlah melebihi stok produk!");
      return;
    }

    if (limit.some((data) => jumlah > data?.remaining) && pilihan === "PO") {
      toast.error("Jumlah melebihi limit produk!");
      return;
    }

    if (
      !checkLimits(
        multiplyJumlah(detail_hampers, jumlah),
        getLimitOrStok(limit)
      ) &&
      pilihan === "PO"
    ) {
      toast.error("Jumlah melebihi limit produk!");
      return;
    }

    const data = { id_hampers: id, jumlah, status: pilihan };
    if (pilihan === "PO" || isAlreadyPO) {
      data.po_date = tanggal;
    }

    await add.mutateAsync(data);
  }, [
    add,
    checkLimits,
    detail_hampers,
    getLimitOrStok,
    id,
    isAlreadyPO,
    jumlah,
    limit,
    multiplyJumlah,
    pilihan,
    tanggal,
  ]);

  const resetField = () => {
    activeButtonPOKeranjang.current.disabled = true;
    btnMinus.current.disabled = true;
    btnPlus.current.disabled = true;
    setTanggal(null);
    setLimit([]);
    setJumlah(1);
  };

  useEffect(() => {
    if (hampers) {
      if (hampers.status === "READY") {
        refPO.current?.classList.remove("active");
        refPO.current.disabled = true;
        refReady.current?.classList.add("active");
        refDate.current.disabled = true;
        getCountTransaksi(
          isAlreadyPO
            ? sessionStorage.getItem("po_date")
            : new Date().toISOString().split("T")[0]
        );
        setPilihan("READY");
      } else {
        refReady.current?.classList.remove("active");
        refReady.current.disabled = true;
        refPO.current?.classList.add("active");
        activeButtonPOKeranjang.current.disabled = true;
        btnMinus.current.disabled = true;
        btnPlus.current.disabled = true;
        setPilihan("PO");
      }

      if (isAlreadyPO) {
        const date = sessionStorage.getItem("po_date");
        refDate.current.value = date;
        getCountTransaksi(date);
        refDate.current.disabled = true;
      }
    }
  }, [hampers, isAlreadyPO, getCountTransaksi]);

  const mapLimitToString = useCallback((limit) => {
    return limit.map((data) =>
      data?.stok > 0
        ? `${data?.nama_produk} dengan stok ${data?.stok}`
        : `${namaProdukConverter(
            data?.id_kategori,
            data?.ukuran,
            data?.nama_produk
          )} dengan limit ${data?.remaining}`
    );
  }, []);

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
      ) : hampers === null ? (
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
              {hampers?.nama_hampers}
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
                {hampers?.nama_hampers}
              </h3>

              <h4 className="my-2">
                <span
                  style={{
                    color: "#BE1008",
                  }}
                >
                  Rp{" "}
                </span>{" "}
                {Formatter.moneyFormatter(hampers?.harga).substring(3)}
              </h4>

              <p
                style={{
                  fontSize: "1.1rem",
                  textAlign: "justify",
                }}
              >
                {hampers?.deskripsi}
              </p>

              <Row className="mt-3">
                <h1
                  className="pl-2"
                  style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                  }}
                >
                  Produk dalam Hampers ini :
                </h1>
                <Col>
                  <ul>
                    {detail_hampers?.map((item, index) => (
                      <li
                        key={index}
                        style={{
                          fontSize: "1rem",
                          fontWeight: "400",
                          listStyleType: "circle",
                        }}
                      >
                        {(item?.produk?.id_kategori === "CK"
                          ? item?.produk?.nama_produk +
                            " " +
                            item?.produk?.ukuran +
                            " Loyang"
                          : item?.produk?.nama_produk) +
                          " x " +
                          item?.jumlah}
                      </li>
                    ))}
                  </ul>
                </Col>
              </Row>

              <Form.Group className="mt-1">
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
                    hampers?.status === "READY"
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
                      refPO.current.classList.remove("active");
                      refReady.current.classList.add("active");
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

                      if (limit.some((data) => data?.stok > 0)) {
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

              <Form.Group className="mt-3">
                <Form.Label className="form-label-font">
                  Masukkan Jumlah
                </Form.Label>
                <InputGroup>
                  <Button
                    variant="outline-secondary input-border-produk-plusminus"
                    onClick={() => {
                      if (jumlah > 1) {
                        setJumlah(jumlah - 1);
                      }
                    }}
                    ref={btnMinus}
                    disabled={
                      !isLogin ||
                      isLoadingDate ||
                      add.isPending ||
                      minLimitOrStok === 0 ||
                      !checkLimits(
                        multiplyJumlah(detail_hampers, jumlah),
                        getLimitOrStok(limit)
                      )
                    }
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
                      if (jumlah === minLimitOrStok) {
                        return;
                      }

                      if (
                        checkLimits(
                          multiplyJumlah(detail_hampers, jumlah + 1),
                          getLimitOrStok(limit)
                        )
                      ) {
                        setJumlah(jumlah + 1);
                      }
                    }}
                    ref={btnPlus}
                    disabled={
                      !isLogin ||
                      isLoadingDate ||
                      add.isPending ||
                      minLimitOrStok === 0 ||
                      !checkLimits(
                        multiplyJumlah(detail_hampers, jumlah + 1),
                        getLimitOrStok(limit)
                      )
                    }
                  >
                    +
                  </Button>
                </InputGroup>
              </Form.Group>
              <Row className="mt-3">
                <Col md={12}>
                  {!tanggal && pilihan === "PO" && (
                    <p
                      className="m-0"
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        color: "#BE1008",
                      }}
                    >
                      Silahkan Pilih Tanggal Terlebih Dahulu
                    </p>
                  )}
                  {limit.length > 0 && (
                    <p
                      className="m-0"
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: "600",
                      }}
                    >
                      {pilihan === "PO"
                        ? "Limit / Stok pembelian pada hari tersebut : "
                        : "Stok tersedia :"}
                    </p>
                  )}

                  <ul
                    className="form-label-font"
                    style={{
                      color: "#BE1008",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                    }}
                  >
                    {pilihan === "PO"
                      ? tanggal === "" ||
                        tanggal === null ||
                        tanggal === undefined
                        ? []
                        : isLoadingDate
                        ? []
                        : mapLimitToString(limit).map((item, index) => (
                            <li key={index} style={{ fontSize: "0.9rem" }}>
                              {item}
                            </li>
                          ))
                      : isLoadingDate
                      ? []
                      : mapLimitToString(limit).map((item, index) => (
                          <li key={index} style={{ fontSize: "0.9rem" }}>
                            {item}
                          </li>
                        ))}
                  </ul>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col>
                  <Button
                    variant="outline-secondary button-tambahkeranjang w-100"
                    disabled={
                      !isLogin ||
                      isLoadingDate ||
                      add.isPending ||
                      minLimitOrStok === 0 ||
                      !checkLimits(
                        multiplyJumlah(detail_hampers, jumlah),
                        getLimitOrStok(limit)
                      )
                    }
                    onClick={handleAddKerajang}
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

              {(minLimitOrStok === 0 ||
                !checkLimits(
                  multiplyJumlah(detail_hampers, jumlah),
                  getLimitOrStok(limit)
                )) &&
                !isLoadingDate &&
                tanggal && (
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
                )}
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}
