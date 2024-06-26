import {
  Button,
  Col,
  Row,
  Modal,
  Table,
  Spinner,
  Badge,
  Image,
} from "react-bootstrap";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

import { BsInbox } from "react-icons/bs";

import "@/page/Admin/Page/css/Admin.css";

import OutlerHeader from "@/component/Admin/OutlerHeader";
import APIHistory from "@/api/APICustomer";
import NotFound from "@/component/Admin/NotFound";
import CustomPagination from "@/component/Admin/Pagination/CustomPagination";
import Formatter from "@/assets/Formatter";

export default function HistoryCustomerPage() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [selectedNota, setSelectedNota] = useState(null);
  const [showGambarModal, setShowGambarModal] = useState(false);

  const handleCloseGambarModal = () => setShowGambarModal(false);
  const handleShowGambarModal = () => setShowGambarModal(true);

  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [bukti_bayar, setBuktiBayar] = useState(null);

  const handleCloseModal = () => {
    setShowModal(false);
    setIsLoadingModal(false);
  };

  const handleShowModal = useCallback(async (data) => {
    setShowModal(true);
    const response = await APIHistory.getNotaPesanan(data);
    setSelectedNota(response);
    setIsLoadingModal(false);
  }, []);

  const fetchHistoryCust = useCallback(
    async (id, signal) => {
      setIsLoading(true);
      try {
        const response = await APIHistory.getCustHistoryByPage(
          id,
          page,
          signal
        );
        setHistory(response.data);
        setLastPage(response.last_page);
      } catch (error) {
        // Handle ketika data terakhir di suatu page dihapus, jadi mundur ke page sebelumnya
        // Atau bakal di set ke array kosong kalo hapus semua data di page pertama
        if (page - 1 === 0 || error.code === "ERR_NETWORK") {
          setHistory([]);
        } else {
          setPage(page - 1);
        }
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [page]
  );

  const handleChangePage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  // Pas masuk load customer
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetchHistoryCust(id, signal);

    return () => {
      abortController.abort();
    };
  }, [fetchHistoryCust, id]);

  return (
    <>
      <OutlerHeader
        title="Kelola Data History Customer"
        desc="Lakukan pengelolaan data History Customer Atma Bakery"
        breadcrumb="History Customer"
      />
      <section className="content px-3">
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
        ) : history?.length > 0 ? (
          <>
            <Table responsive striped>
              <thead>
                <tr>
                  <th style={{ width: "10%" }} className="th-style">
                    Nomor Nota
                  </th>
                  <th style={{ width: "15%" }} className="th-style">
                    Tanggal Pesan
                  </th>
                  <th style={{ width: "15%" }} className="th-style">
                    Tanggal Ambil
                  </th>
                  <th style={{ width: "10%" }} className="th-style">
                    Tipe Delivery
                  </th>
                  <th style={{ width: "10%" }} className="th-style">
                    Status
                  </th>
                  <th style={{ width: "15%" }} className="th-style">
                    Total
                  </th>
                  <th style={{ width: "15%" }} className="th-style">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {history.map((history, index) => (
                  <tr key={index}>
                    <td>{history.no_nota}</td>
                    <td>
                      {Formatter.dateTimeFormatter(history.tanggal_pesan)}
                    </td>
                    <td>{Formatter.dateFormatter(history.tanggal_ambil)}</td>
                    <td>
                      {history.tipe_delivery == "Ojol" ? (
                        <Badge bg="success">{history.tipe_delivery}</Badge>
                      ) : history.tipe_delivery === "Kurir" ? (
                        <Badge bg="primary">{history.tipe_delivery}</Badge>
                      ) : (
                        <Badge bg="dark">{history.tipe_delivery}</Badge>
                      )}
                    </td>
                    <td>
                      {history.status.includes("Terkirim") ||
                      history.status.includes("Selesai") ||
                      history.status.includes("Pesanan Diterima") ? (
                        <Badge bg="success">{history.status}</Badge>
                      ) : history.status.includes("Sedang Diproses") ? (
                        <Badge
                          bg="orange"
                          style={{
                            backgroundColor: "orange",
                            color: "white !important",
                          }}
                        >
                          {history.status}
                        </Badge>
                      ) : history.status.includes("Siap Pick Up") ||
                        history.status.includes("Siap Kirim") ||
                        history.status.includes("Sedang Diantar Kurir") ||
                        history.status.includes("Sedang Diantar Ojol") ? (
                        <Badge bg="primary">{history.status}</Badge>
                      ) : history.status === "Ditolak" ? (
                        <Badge bg="danger">{history.status}</Badge>
                      ) : (
                        <Badge bg="secondary">{history.status}</Badge>
                      )}
                    </td>
                    <td>{Formatter.moneyFormatter(history.total)}</td>
                    <td>
                      <Row className="gap-1 gap-lg-0 gap-md-0">
                        <Col xs={12} sm={12} md={11} lg={11}>
                          <Button
                            variant="danger"
                            className="custom-danger-btn w-100"
                            disabled={isLoadingModal}
                            onClick={() => {
                              setSelectedNota(history);
                              setBuktiBayar(history.bukti_pembayaran);
                              handleShowModal(history);
                              setIsLoadingModal(true);
                            }}
                          >
                            <BsInbox className="mb-1" /> Lihat Detail
                          </Button>
                        </Col>
                      </Row>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {/* Udah pasti kayak gini untuk pagination, jangan diotak atik :V */}
            {lastPage > 1 && (
              <CustomPagination
                totalPage={lastPage}
                currentPage={page}
                onChangePage={handleChangePage}
              />
            )}
          </>
        ) : (
          <NotFound text={"Belum Ada History Disini"} />
        )}

        <Modal show={showModal} onHide={handleCloseModal} size="xl">
          <Modal.Body className="text-start p-4 m-2">
            {isLoadingModal ? (
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
                <Row>
                  <Col>
                    <h2 style={{ fontWeight: "bold" }}>Atma Bakery</h2>
                    <h5
                      style={{ color: "rgb(18,19,20,70%)", fontSize: "1.1em" }}
                      className="mt-3"
                    >
                      Jl. Babarsari No.43, Janti, Caturtunggal, Kec. Depok,
                      Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281
                    </h5>
                    <h5
                      style={{ color: "rgb(18,19,20,70%)", fontSize: "1.1em" }}
                    >
                      AtmaBakery@gmail.uajy.ac.id
                    </h5>
                    <h5
                      style={{ color: "rgb(18,19,20,70%)", fontSize: "1.1em" }}
                    >
                      012-345-6789
                    </h5>
                  </Col>
                  <Col className="text-end">
                    <h4>
                      Nota {selectedNota?.no_nota}
                      {selectedNota?.status.includes("Terkirim") ||
                      selectedNota?.status.includes("Selesai") ||
                      selectedNota?.status.includes("Pesanan Diterima") ? (
                        <Badge className="ms-3 font-size-12" bg="success">
                          {selectedNota?.status}
                        </Badge>
                      ) : selectedNota?.status.includes("Sedang Diproses") ? (
                        <Badge
                          className="ms-3 font-size-12"
                          bg="orange"
                          style={{
                            backgroundColor: "orange",
                            color: "white !important",
                          }}
                        >
                          {selectedNota?.status}
                        </Badge>
                      ) : selectedNota?.status.includes("Siap Pick Up") ||
                        selectedNota?.status.includes("Siap Kirim") ||
                        selectedNota?.status.includes("Sedang Diantar Kurir") ||
                        selectedNota?.status.includes("Sedang Diantar Ojol") ? (
                        <Badge className="ms-3 font-size-12" bg="primary">
                          {selectedNota?.status}
                        </Badge>
                      ) : selectedNota?.status === "Ditolak" ? (
                        <Badge className="ms-3 font-size-12" bg="danger">
                          {selectedNota?.status}
                        </Badge>
                      ) : (
                        <Badge className="ms-3 font-size-12" bg="secondary">
                          {selectedNota?.status}
                        </Badge>
                      )}
                    </h4>
                    <h5
                      style={{ color: "rgb(18,19,20,70%)", fontSize: "1.1em" }}
                      className="mt-3"
                    >
                      Tanggal Pesan :{" "}
                      {Formatter.dateTimeFormatter(selectedNota?.tanggal_pesan)}
                    </h5>
                    <h5
                      style={{ color: "rgb(18,19,20,70%)", fontSize: "1.1em" }}
                    >
                      Lunas Pada :{" "}
                      {Formatter.dateTimeFormatter(selectedNota?.tanggal_lunas)}
                    </h5>
                    <h5
                      style={{ color: "rgb(18,19,20,70%)", fontSize: "1.1em" }}
                    >
                      Tanggal Ambil :{" "}
                      {Formatter.dateFormatter(selectedNota?.tanggal_ambil)}
                    </h5>
                  </Col>
                </Row>

                <hr style={{ border: "1px solid" }} />

                <Row>
                  <Col>
                    <h4 style={{ fontWeight: "bold" }}>Customer : </h4>
                    <h5
                      style={{
                        color: "rgb(18,19,20,70%)",
                        fontSize: "1.07em",
                        fontWeight: "600",
                      }}
                    >
                      {selectedNota?.nama}
                    </h5>
                    <h5
                      style={{ color: "rgb(18,19,20,70%)", fontSize: "1.07em" }}
                    >
                      {selectedNota?.email}
                    </h5>
                    <h5
                      style={{ color: "rgb(18,19,20,70%)", fontSize: "1.07em" }}
                    >
                      {selectedNota?.no_telp}
                    </h5>
                  </Col>
                  <Col className="text-end">
                    <h4>
                      Tipe Delivery
                      {selectedNota?.tipe_delivery == "Ojol" ? (
                        <Badge className="ms-2 font-size-12" bg="success">
                          {selectedNota?.tipe_delivery}
                        </Badge>
                      ) : selectedNota?.tipe_delivery === "Kurir" ? (
                        <Badge className="ms-2 font-size-12" bg="primary">
                          {selectedNota?.tipe_delivery}
                        </Badge>
                      ) : (
                        <Badge className="ms-2 font-size-12" bg="dark">
                          {selectedNota?.tipe_delivery}
                        </Badge>
                      )}
                    </h4>
                    {selectedNota?.tipe_delivery == "Ambil" ? null : (
                      <>
                        <h5
                          style={{
                            color: "rgb(18,19,20,70%)",
                            fontSize: "1.05em",
                          }}
                          className="mt-2"
                        >
                          {selectedNota?.lokasi}
                        </h5>
                        <h5
                          style={{
                            color: "rgb(18,19,20,70%)",
                            fontSize: "1.05em",
                          }}
                        >
                          {selectedNota?.keterangan}
                        </h5>
                      </>
                    )}
                  </Col>
                </Row>
                <h5 className="mt-3" style={{ fontWeight: "bold" }}>
                  Ringkasan Pesanan
                </h5>
                <Table
                  responsive
                  className="text-start align-middle table-nowrap"
                >
                  <thead>
                    <tr>
                      <th style={{ width: "5%" }} className="th-style">
                        No
                      </th>
                      <th style={{ width: "50%" }} className="th-style">
                        Produk
                      </th>
                      <th style={{ width: "20%" }} className="th-style">
                        Jumlah
                      </th>
                      <th style={{ width: "30%" }} className="th-style">
                        Sub Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedNota?.produk?.map(function (detail, idx) {
                      return (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>
                            {detail.id_kategori === "CK"
                              ? detail.nama_produk +
                                " " +
                                detail.ukuran +
                                " Loyang"
                              : detail.nama_produk}{" "}
                          </td>
                          <td>{detail.jumlah}</td>
                          <td>
                            {Formatter.moneyFormatter(
                              detail.jumlah * detail.harga_saat_beli
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {selectedNota?.tipe_delivery === "Kurir" ? (
                      <tr>
                        <td colSpan={3} className="text-end">
                          Ongkos Kirim (rad. {selectedNota?.radius} km) :
                        </td>
                        <td>
                          {Formatter.moneyFormatter(selectedNota?.ongkir)}
                        </td>
                      </tr>
                    ) : null}
                    <tr>
                      <td className="text-end" colSpan={3}>
                        Potongan Poin {selectedNota?.penggunaan_poin} poin :
                      </td>
                      <td>
                        -{" "}
                        {Formatter.moneyFormatter(
                          selectedNota?.penggunaan_poin * 100
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-end" colSpan={3}>
                        Total :
                      </td>
                      <td>{Formatter.moneyFormatter(selectedNota?.total)}</td>
                    </tr>
                  </tbody>
                </Table>
                <h5
                  style={{ color: "rgb(18,19,20,70%)", fontSize: "1.1em" }}
                  className="mt-1"
                >
                  Poin dari pesanan ini : {selectedNota?.penambahan_poin}
                </h5>
                <h5
                  style={{ color: "rgb(18,19,20,70%)", fontSize: "1.1em" }}
                  className="mt-1"
                >
                  Poin User Setelah Penambahan :{" "}
                  {selectedNota?.poin_user_setelah_penambahan}
                </h5>
              </>
            )}
          </Modal.Body>
          {isLoadingModal ? null : (
            <Modal.Footer>
              {bukti_bayar && (
                <Button
                  variant="primary"
                  onClick={() => {
                    handleShowGambarModal();
                  }}
                >
                  Lihat Bukti Bayar
                </Button>
              )}
              <Button variant="secondary" onClick={handleCloseModal}>
                Tutup
              </Button>
            </Modal.Footer>
          )}
        </Modal>
        <Modal show={showGambarModal} onHide={handleCloseGambarModal}>
          <Image src={bukti_bayar} alt="bukti_bayar" />
        </Modal>
      </section>
    </>
  );
}
