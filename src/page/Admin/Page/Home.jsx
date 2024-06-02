import OutlerHeader from "@/component/Admin/OutlerHeader";
import { pdf } from "@react-pdf/renderer";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import LaporanPenggunaanBahanBaku from "./Laporan/LaporanPenggunaanBahanBaku";
import { FaDownload } from "react-icons/fa";
import APILaporan from "@/api/APILaporan";
import { useEffect, useState, useRef } from "react";
import Formatter from "@/assets/Formatter";
import FileSaver from "file-saver";
import PDFPreview from "@/page/Main/HistoryCustomer/PDFPreview";
import LaporanPenjualanProdukPerBulan from "./Laporan/LaporanPenjualanProdukPerBulan";
import { toast } from "sonner";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const isMOorOwner =
    sessionStorage.getItem("role") === "OWN" ||
    sessionStorage.getItem("role") === "MO";
  const refProduk = useRef(null);

  const [bulanTahunProduk, setBulanTahunProduk] = useState({
    bulan: "",
    tahun: new Date().getFullYear(),
  });

  const fetchBahanBaku = async () => {
    try {
      setLoading(true);
      const response = await APILaporan.getLaporanStokBahanBaku();
      response.tanggal_cetak = Formatter.formatDateToIndonesian(
        response.tanggal_cetak
      );
      generatePDFBahanBaku(response);
      // setBahanBaku(response);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const fetchProdukPerBulan = async (bulan, tahun) => {
    const data = {
      bulan: bulan,
      tahun: tahun,
    };

    try {
      setLoading(true);
      const response = await APILaporan.getLaporanBulananPerProduk(data);
      response.tanggal_cetak = Formatter.formatDateToIndonesian(
        response.tanggal_cetak
      );

      // setProduk(response);
      generatePDFProduk(response, bulan, tahun);
      setBulanTahunProduk({
        bulan: "",
        tahun: new Date().getFullYear(),
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const generatePDFBahanBaku = async (data) => {
    const blob = await pdf(
      <LaporanPenggunaanBahanBaku bahan_baku={data} />
    ).toBlob();
    const filename =
      "Laporan Penggunaan Bahan Baku-" + new Date().getTime() + ".pdf";
    FileSaver.saveAs(blob, filename);
  };

  const generatePDFProduk = async (data, bulan, tahun) => {
    const blob = await pdf(
      <LaporanPenjualanProdukPerBulan
        produk={data}
        bulan={bulan}
        tahun={tahun}
      />
    ).toBlob();
    const filename =
      "Laporan Penjualan Bulanan Per Produk-" + new Date().getTime() + ".pdf";
    FileSaver.saveAs(blob, filename);
  };

  // const [produk, setProduk] = useState([]);

  // useEffect(() => {
  //   if (isMOorOwner) {
  //     fetchProdukPerBulan(5, 2024);
  //   }
  // }, [isMOorOwner]);

  return (
    <>
      <OutlerHeader title="Dashboard" breadcrumb="Dashboard" />
      <section className="content">
        {/* <PDFPreview>
          <LaporanPenjualanProdukPerBulan
            produk={produk}
            bulan={"5"}
            tahun={"2024"}
          />
        </PDFPreview> */}
        {isMOorOwner && (
          <>
            {loading ? (
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
              <Container fluid className="content-row">
                <Row>
                  <Col md={12} lg={6} xl={6}>
                    <Card>
                      <Card.Body>
                        <Row>
                          <Col md={12} lg={12} xl={12} className="mb-1">
                            <h3 className="text-bold">
                              Laporan Penjualan Bulanan Per Produk
                            </h3>
                          </Col>

                          <Col md={12} lg={12} xl={12}>
                            <Form.Group className="text-start">
                              <Form.Label
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "1em",
                                }}
                              >
                                Pilih Bulan dan Tahun
                              </Form.Label>
                              <Form.Control
                                style={{ border: "1px solid #808080" }}
                                ref={refProduk}
                                type="text"
                                onFocus={() =>
                                  (refProduk.current.type = "month")
                                }
                                onBlur={() =>
                                  (refProduk.current.type = "month")
                                }
                                placeholder="Month YYYY"
                                onChange={(e) => {
                                  const date = new Date(e.target.value);
                                  setBulanTahunProduk({
                                    ...bulanTahunProduk,
                                    bulan: date.getMonth() + 1,
                                    tahun: date.getFullYear(),
                                  });
                                }}
                                min={"2021-01"}
                                max={
                                  new Date().getFullYear() +
                                  "-" +
                                  (new Date().getMonth() + 1)
                                    .toString()
                                    .padStart(2, "0")
                                }
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Card.Body>
                      <Card.Footer className="bg-white border-top">
                        <Button
                          variant="primary"
                          onClick={(e) => {
                            e.preventDefault();

                            if (
                              bulanTahunProduk.tahun > new Date().getFullYear()
                            )
                              return toast.error(
                                "Tahun tidak boleh lebih dari tahun sekarang"
                              );

                            if (bulanTahunProduk.tahun < 2021)
                              return toast.error(
                                "Tahun tidak boleh kurang dari tahun 2021"
                              );

                            if (
                              bulanTahunProduk.bulan >
                              new Date().getMonth() + 1
                            )
                              return toast.error(
                                "Bulan tidak boleh lebih dari bulan sekarang"
                              );

                            if (
                              bulanTahunProduk.bulan &&
                              bulanTahunProduk.tahun
                            )
                              fetchProdukPerBulan(
                                parseInt(bulanTahunProduk.bulan),
                                parseInt(bulanTahunProduk.tahun)
                              );
                            else {
                              toast.error(
                                "Pilih bulan dan tahun terlebih dahulu"
                              );
                            }
                          }}
                        >
                          <FaDownload className="me-2" />
                          Cetak
                        </Button>
                      </Card.Footer>
                    </Card>
                  </Col>

                  <Col md={12} lg={6} xl={6}>
                    <Card>
                      <Card.Body>
                        <Row>
                          <Col md={12} lg={12} xl={12}>
                            <h3 className="text-bold">
                              Laporan Penggunaan Bahan Baku
                            </h3>
                          </Col>
                        </Row>
                      </Card.Body>
                      <Card.Footer className="bg-white border-top">
                        <Button
                          variant="primary"
                          onClick={(e) => {
                            e.preventDefault();
                            fetchBahanBaku();
                          }}
                        >
                          <FaDownload className="me-2" />
                          Cetak
                        </Button>
                      </Card.Footer>
                    </Card>
                  </Col>
                </Row>
              </Container>
            )}
          </>
        )}
      </section>
    </>
  );
}
