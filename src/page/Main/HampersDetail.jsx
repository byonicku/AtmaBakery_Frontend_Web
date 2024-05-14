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
import APIHampers from "@/api/APIHampers";

export default function HampersDetail() {
  const [isLoading, setIsLoading] = useState(false);
  const [hampers, setHampers] = useState(null);
  const { id } = useParams();

  const [tanggal, setTanggal] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [pilihan, setPilihan] = useState("READY");
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

  const refReady = useRef(null);
  const refPO = useRef(null);

  const fetchHampers = useCallback(
    async (signal) => {
      setIsLoading(true);
      try {
        const response = await APIHampers.showHampers(id, signal);

        setHampers(response);
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
        setHampers([]);
        setDetailHampers([]);
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

  return (
    <Container>
      {isLoading ? (
        <div className="text-center">
          <Spinner
            as="span"
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
                        {item?.produk?.id_kategori === "CK"
                          ? item?.produk?.nama_produk +
                            " " +
                            item?.produk?.ukuran +
                            " Loyang"
                          : item?.produk?.nama_produk}
                      </li>
                    ))}
                  </ul>
                </Col>
              </Row>

              <Form.Group className="mt-1">
                <Form.Label className="form-label-font">
                  Pesan Untuk Tanggal
                </Form.Label>
                <Form.Control
                  className="input-border"
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  placeholder="Masukkan Tanggal Lahir"
                  name="tanggal"
                  onChange={(e) => setTanggal(e.target.value)}
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
                      refReady.current.classList.remove("active");
                      refPO.current.classList.add("active");
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
                      if (jumlah === 10) {
                        return;
                      }
                      setJumlah(jumlah + 1);
                    }}
                  >
                    +
                  </Button>
                </InputGroup>
              </Form.Group>
              <Row className="mt-4">
                <Col>
                  <Button variant="outline-secondary button-bayar w-100">
                    Bayar
                  </Button>
                </Col>
                <Col>
                  <Button variant="outline-secondary button-tambahkeranjang w-100">
                    + Keranjang
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}
