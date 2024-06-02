import OutlerHeader from "@/component/Admin/OutlerHeader";
import { pdf } from "@react-pdf/renderer";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import LaporanPenggunaanBahanBaku from "./Laporan/LaporanPenggunaanBahanBaku";
import { FaDownload } from "react-icons/fa";
import APILaporan from "@/api/APILaporan";
import { useEffect, useState } from "react";
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
              <>
                <Card>
                  <Card.Body>
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();

                        if (bulanTahunProduk.tahun > new Date().getFullYear())
                          return toast.error(
                            "Tahun tidak boleh lebih dari tahun sekarang"
                          );

                        if (bulanTahunProduk.tahun < 2021)
                          return toast.error(
                            "Tahun tidak boleh kurang dari tahun 2021"
                          );

                        if (bulanTahunProduk.bulan > new Date().getMonth() + 1)
                          return toast.error(
                            "Bulan tidak boleh lebih dari bulan sekarang"
                          );

                        if (bulanTahunProduk.bulan && bulanTahunProduk.tahun)
                          fetchProdukPerBulan(
                            parseInt(bulanTahunProduk.bulan),
                            parseInt(bulanTahunProduk.tahun)
                          );
                        else {
                          toast.error("Pilih bulan dan tahun terlebih dahulu");
                        }
                      }}
                    >
                      <Row>
                        <Col md={12} lg={6} xl={6}>
                          <h3 className="text-bold">
                            Laporan Penjualan Bulanan Per Produk
                          </h3>
                        </Col>

                        <Col md={12} lg={2} xl={2}>
                          <Form.Select
                            onChange={(e) => {
                              setBulanTahunProduk({
                                ...bulanTahunProduk,
                                bulan: e.target.value,
                              });
                            }}
                            required
                          >
                            <option selected disabled hidden>
                              Pilih Bulan
                            </option>
                            <option value="1">Januari</option>
                            <option value="2">Februari</option>
                            <option value="3">Maret</option>
                            <option value="4">April</option>
                            <option value="5">Mei</option>
                            <option value="6">Juni</option>
                            <option value="7">Juli</option>
                            <option value="8">Agustus</option>
                            <option value="9">September</option>
                            <option value="10">Oktober</option>
                            <option value="11">November</option>
                            <option value="12">Desember</option>
                          </Form.Select>
                        </Col>
                        <Col md={12} lg={2} xl={2}>
                          <Form.Control
                            placeholder="Masukan Tahun"
                            defaultValue={new Date().getFullYear()}
                            id="tahunProduk"
                            min={2021}
                            onChange={(e) => {
                              setBulanTahunProduk({
                                ...bulanTahunProduk,
                                tahun: e.target.value,
                              });
                            }}
                            type="number"
                          ></Form.Control>
                        </Col>
                        <Col md={12} lg={2} xl={2} className="text-end">
                          <Button
                            variant="primary"
                            onClick={async () => {
                              if (
                                document.getElementById("bulanProduk").value &&
                                document.getElementById("tahunProduk").value
                              ) {
                                await fetchProdukPerBulan(
                                  parseInt(
                                    document.getElementById("bulanProduk").value
                                  ),
                                  document.getElementById("tahunProduk").value
                                );
                              }

                              await fetchProdukPerBulan();
                            }}
                            type="submit"
                          >
                            <FaDownload className="me-2" />
                            Cetak
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Body>
                    <Row>
                      <Col md={12} lg={6} xl={6}>
                        <h3 className="text-bold">
                          Laporan Penggunaan Bahan Baku
                        </h3>
                      </Col>
                      <Col md={12} lg={6} xl={6} className="text-end">
                        <Button
                          variant="primary"
                          onClick={async () => {
                            await fetchBahanBaku();
                          }}
                        >
                          <FaDownload className="me-2" />
                          Cetak
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </>
            )}
          </>
        )}
      </section>
    </>
  );
}
