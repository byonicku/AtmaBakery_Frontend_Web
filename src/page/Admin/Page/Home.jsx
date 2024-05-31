import OutlerHeader from "@/component/Admin/OutlerHeader";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Card, Col, Row, Spinner } from "react-bootstrap";
import LaporanPenggunaanBahanBaku from "./Laporan/LaporanPenggunaanBahanBaku";
import { FaDownload } from "react-icons/fa";
import APILaporan from "@/api/APILaporan";
import { useEffect, useState } from "react";
import Formatter from "@/assets/Formatter";

export default function Home() {
  const [bahan_baku_list, setBahanBakuList] = useState([]);
  const [loading, setLoading] = useState(false);
  const isMOorOwner =
    sessionStorage.getItem("role") === "OWN" ||
    sessionStorage.getItem("role") === "MO";

  const fetchBahanBaku = async () => {
    try {
      setLoading(true);
      const response = await APILaporan.getLaporanStokBahanBaku();
      response.tanggal_cetak = Formatter.formatDateToIndonesian(
        response.tanggal_cetak
      );
      setBahanBakuList(response);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isMOorOwner) {
      fetchBahanBaku();
    }
  }, [isMOorOwner]);

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
              <Card>
                <Card.Body>
                  <Row>
                    <Col md={12} lg={6} xl={6}>
                      <h3 className="text-bold">
                        Laporan Penggunaan Bahan Baku
                      </h3>
                    </Col>
                    <Col md={12} lg={6} xl={6} className="text-end">
                      <PDFDownloadLink
                        id="pdfDownloadButton"
                        document={
                          <LaporanPenggunaanBahanBaku
                            bahan_baku={bahan_baku_list}
                          />
                        }
                        fileName="Laporan Penggunaan Bahan Baku.pdf"
                        className="btn btn-primary"
                      >
                        <FaDownload className="mb-1" /> Cetak
                      </PDFDownloadLink>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}
          </>
        )}
      </section>
    </>
  );
}
