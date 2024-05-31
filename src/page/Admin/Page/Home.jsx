import OutlerHeader from "@/component/Admin/OutlerHeader";
import { pdf } from "@react-pdf/renderer";
import { Button, Card, Col, Row, Spinner } from "react-bootstrap";
import LaporanPenggunaanBahanBaku from "./Laporan/LaporanPenggunaanBahanBaku";
import { FaDownload } from "react-icons/fa";
import APILaporan from "@/api/APILaporan";
import { useEffect, useState } from "react";
import Formatter from "@/assets/Formatter";
import FileSaver from "file-saver";
import PDFPreview from "@/page/Main/HistoryCustomer/PDFPreview";

export default function Home() {
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
      generatePDFBahanBaku(response);
      // setBahanBaku(response);
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

  // const [bahan_baku, setBahanBaku] = useState([]);

  // useEffect(() => {
  //   if (isMOorOwner) {
  //     fetchBahanBaku();
  //   }
  // }, [isMOorOwner]);

  return (
    <>
      <OutlerHeader title="Dashboard" breadcrumb="Dashboard" />
      <section className="content">
        {/* <PDFPreview>
          <LaporanPenggunaanBahanBaku bahan_baku={bahan_baku} />
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
            )}
          </>
        )}
      </section>
    </>
  );
}
