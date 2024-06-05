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
import APILaporan from "@/api/APILaporan";
import Formatter from "@/assets/Formatter";
import FileSaver from "file-saver";
import { useState } from "react";
import { toast } from "sonner";
import { useRef } from "react";
import { FaDownload } from "react-icons/fa";
import LaporanPresensidanGajiKaryawan from "./Laporan/LaporanPresensidanGaji";
import LaporanPemasukanPengeluaran from "./Laporan/LaporanPemasukanPengeluaran";
import LaporanTransaksiPenitip from "./Laporan/LaporanTransaksiPenitip";
import LaporanStokBahanBaku from "./Laporan/LaporanStokBahanBaku";
import LaporanPenggunaanBahanBakuPeriod from "./Laporan/LaporanPenggunaanBahanBakuPeriod";
import LaporanPenjualanProdukPerBulan from "./Laporan/LaporanPenjualanProdukPerBulan";
import LaporanBulananKeseluruhan from "./Laporan/LaporanBulananKeseluruhan";

export default function Home() {
  const [tahunProduk, setTahunProduk] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const startDateRef = useRef();
  const endDateRef = useRef();

  const [loading, setLoading] = useState(false);
  const isMOorOwner =
    sessionStorage.getItem("role") === "OWN" ||
    sessionStorage.getItem("role") === "MO";

  const [bulanTahunProduk, setBulanTahunProduk] = useState({
    bulan: "",
    tahun: new Date().getFullYear(),
  });

  const fetchPresensidanGajiKaryawan = async (bulan, tahun) => {
    const data = {
      bulan: bulan,
      tahun: tahun,
    };
    try {
      setLoading(true);
      const response = await APILaporan.getLaporanPresensiKaryawan(data);
      response.tanggal_cetak = Formatter.formatDateToIndonesian(
        response.tanggal_cetak
      );
      generatePDFPresensidanGaji(response, bulan, tahun);
      // setBahanBaku(response);
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

  const fetchPemasukandanPengeluaran = async (bulan, tahun) => {
    const data = {
      bulan: bulan,
      tahun: tahun,
    };
    try {
      setLoading(true);
      const response = await APILaporan.getLaporanPemasukanDanPengeluaran(data);
      response.tanggal_cetak = Formatter.formatDateToIndonesian(
        response.tanggal_cetak
      );
      console.log(response);
      generatePDFPemasukandanPengeluaran(response, bulan, tahun);
      // setBahanBaku(response);
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

  const fetchTransaksiPenitip = async (bulan, tahun) => {
    const data = {
      bulan: bulan,
      tahun: tahun,
    };

    const queue = [];
    async function processQueue() {
      while (queue.length > 0) {
        const task = queue.shift();
        try {
          await task();
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error("Error generating PDF:", error);
        }
      }
    }

    try {
      setLoading(true);
      const response = await APILaporan.getLaporanTransaksiPenitip(data);
      response.tanggal_cetak = Formatter.formatDateToIndonesian(
        response.tanggal_cetak
      );

      const dataPenitip = response.data;

      // Enqueue all PDF generation tasks
      dataPenitip.forEach((detail) => {
        queue.push(() =>
          generatePDFTransaksiPenitip(
            detail,
            bulan,
            tahun,
            response.tanggal_cetak
          )
        );
      });

      await processQueue();

      // setBahanBaku(response);
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

  const fetchLaporanBulananKeseluruhan = async (tahun) => {
    const data = {
      tahun: tahun,
    };
    try {
      setLoading(true);
      const response = await APILaporan.getLaporanBulananKeseluruhan(data);
      response.tanggal_cetak = Formatter.formatDateToIndonesian(
        response.tanggal_cetak
      );
      console.log(response);
      generatePDFBulananKeseluruhan(response, tahun);
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

  const fetchLaporanPenggunaanBahanBaku = async (startDate, endDate) => {
    const data = {
      tanggal_awal: startDate,
      tanggal_akhir: endDate,
    };

    try {
      setLoading(true);
      const response = await APILaporan.getLaporanStokBahanBakuPeriode(data);
      response.tanggal_cetak = Formatter.formatDateToIndonesian(
        response.tanggal_cetak
      );
      console.log(response);
      generatePDFPenggunaanBahanBaku(
        response,
        Formatter.formatDateToIndonesian(startDate),
        Formatter.formatDateToIndonesian(endDate)
      );
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const generatePDFPresensidanGaji = async (data, bulan, tahun) => {
    const blob = await pdf(
      <LaporanPresensidanGajiKaryawan
        result={data}
        bulan={bulan}
        tahun={tahun}
      />
    ).toBlob();
    const filename =
      "Laporan Presensi dan Gaji Karyawan-" + new Date().getTime() + ".pdf";
    FileSaver.saveAs(blob, filename);
  };

  const generatePDFPemasukandanPengeluaran = async (data, bulan, tahun) => {
    const blob = await pdf(
      <LaporanPemasukanPengeluaran result={data} bulan={bulan} tahun={tahun} />
    ).toBlob();
    const filename =
      "Laporan Pemasukan dan Pengeluaran-" + new Date().getTime() + ".pdf";
    FileSaver.saveAs(blob, filename);
  };

  const generatePDFTransaksiPenitip = async (
    data,
    bulan,
    tahun,
    tanggal_cetak
  ) => {
    const blob = await pdf(
      <LaporanTransaksiPenitip
        result={data}
        bulan={bulan}
        tahun={tahun}
        tanggal_cetak={tanggal_cetak}
      />
    ).toBlob();
    const filename =
      "Laporan Transaksi Penitip " +
      data.nama +
      "-" +
      new Date().getTime() +
      ".pdf";
    FileSaver.saveAs(blob, filename);
  };

  const generatePDFBahanBaku = async (data) => {
    const blob = await pdf(<LaporanStokBahanBaku bahan_baku={data} />).toBlob();
    const filename = "Laporan Stok Bahan Baku-" + new Date().getTime() + ".pdf";
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

  const generatePDFPenggunaanBahanBaku = async (data, startDate, endDate) => {
    const blob = await pdf(
      <LaporanPenggunaanBahanBakuPeriod
        penggunaan_bahan_baku={data}
        startDate={startDate}
        endDate={endDate}
      />
    ).toBlob();
    const filename =
      "Laporan Penggunaan Bahan Baku-" + new Date().getTime() + ".pdf";
    FileSaver.saveAs(blob, filename);
  };

  const generatePDFBulananKeseluruhan = async (data, tahun) => {
    try {
      const pdfBlob = await pdf(
        <LaporanBulananKeseluruhan keseluruhan={data} tahun={tahun} />
      ).toBlob();
      const filename = `Laporan Bulanan Keseluruhan-${tahun}-${new Date().getTime()}.pdf`;

      // Save the PDF using FileSaver
      FileSaver.saveAs(pdfBlob, filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2021; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  return (
    <>
      <OutlerHeader title="Dashboard" breadcrumb="Dashboard" />
      <section className="content">
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
              <Container fluid>
                <Row>
                  <Col md={12} lg={12} xl={12}>
                    <Card>
                      <Card.Body>
                        <Row>
                          <Col md={12} lg={12} xl={12} className="mb-1">
                            <h3 className="text-bold">
                              Laporan Bulanan Keseluruhan
                            </h3>
                          </Col>
                          <Col md={12} lg={12} xl={12}>
                            <Form.Select
                              style={{ border: "1px solid #808080" }}
                              value={tahunProduk}
                              onChange={(e) => setTahunProduk(e.target.value)}
                            >
                              {generateYearOptions().map((year) => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                            </Form.Select>
                          </Col>
                        </Row>
                      </Card.Body>
                      <Card.Footer className="bg-white border-top">
                        <Button
                          variant="primary"
                          onClick={(e) => {
                            e.preventDefault();

                            if (tahunProduk > new Date().getFullYear())
                              return toast.error(
                                "Tahun tidak boleh lebih dari tahun sekarang"
                              );

                            if (tahunProduk < 2021)
                              return toast.error(
                                "Tahun tidak boleh kurang dari tahun 2021"
                              );

                            fetchLaporanBulananKeseluruhan(tahunProduk);
                          }}
                        >
                          <FaDownload className="me-2" />
                          Cetak
                        </Button>
                      </Card.Footer>
                    </Card>
                  </Col>

                  <Col md={12} lg={12} xl={12}>
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
                                type="month"
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
                                onKeyDown={(e) => e.preventDefault()}
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

                  <Col md={12} lg={12} xl={12}>
                    <Card>
                      <Card.Body>
                        <Row>
                          <Col md={12} lg={12} xl={12}>
                            <h3 className="text-bold">
                              Laporan Stok Bahan Baku
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

                  <Col md={12} lg={12} xl={12}>
                    <Card>
                      <Card.Body>
                        <Row>
                          <Col md={12} lg={12} xl={12} className="mb-1">
                            <h5 className="text-bold">
                              Laporan Penggunaan Bahan Baku
                            </h5>
                          </Col>
                          <Col md={12} lg={12} xl={12}>
                            <Form.Group className="text-start">
                              <Form.Label
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "0.9em",
                                }}
                              >
                                Pilih Tanggal Awal dan Tanggal Akhir
                              </Form.Label>
                              <Form.Control
                                style={{ border: "1px solid #808080" }}
                                type="date"
                                ref={startDateRef}
                                onChange={(e) => setStartDate(e.target.value)}
                                max={new Date().toISOString().split("T")[0]}
                                onKeyDown={(e) => e.preventDefault()}
                              />
                              <Form.Control
                                style={{
                                  border: "1px solid #808080",
                                  marginTop: "0.5em",
                                }}
                                type="date"
                                ref={endDateRef}
                                onChange={(e) => setEndDate(e.target.value)}
                                max={new Date().toISOString().split("T")[0]}
                                onKeyDown={(e) => e.preventDefault()}
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

                            if (startDate && endDate) {
                              if (startDate > endDate) {
                                toast.error(
                                  "Tanggal awal tidak boleh lebih besar dari tanggal akhir"
                                );
                              } else {
                                fetchLaporanPenggunaanBahanBaku(
                                  startDate,
                                  endDate
                                );
                              }
                            } else {
                              toast.error(
                                "Pilih tanggal awal dan tanggal akhir terlebih dahulu"
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

                  <Col md={12} lg={12} xl={12}>
                    <Card>
                      <Card.Body>
                        <Row>
                          <Col md={12} lg={12} xl={12} className="mb-1">
                            <h3 className="text-bold">
                              Laporan Presensi dan Gaji Karyawan bulanan
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
                                type="month"
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
                                onKeyDown={(e) => e.preventDefault()}
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
                              fetchPresensidanGajiKaryawan(
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

                  <Col md={12} lg={12} xl={12}>
                    <Card>
                      <Card.Body>
                        <Row>
                          <Col md={12} lg={12} xl={12} className="mb-1">
                            <h3 className="text-bold">
                              Laporan Pemasukan dan Pengeluaran
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
                                type="month"
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
                                onKeyDown={(e) => e.preventDefault()}
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
                              fetchPemasukandanPengeluaran(
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
                  <Col md={12} lg={12} xl={12}>
                    <Card>
                      <Card.Body>
                        <Row>
                          <Col md={12} lg={12} xl={12} className="mb-1">
                            <h3 className="text-bold">
                              Laporan Transaksi Penitip
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
                                type="month"
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
                                onKeyDown={(e) => e.preventDefault()}
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
                              fetchTransaksiPenitip(
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
                </Row>
              </Container>
            )}
          </>
        )}
      </section>
    </>
  );
}
