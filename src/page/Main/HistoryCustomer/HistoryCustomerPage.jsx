import {
  Button,
  Col,
  Row,
  Modal,
  Table,
  Spinner,
  Badge,
  InputGroup,
  Form,
  Image,
  Dropdown,
} from "react-bootstrap";
import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";

import { BsInbox, BsSearch } from "react-icons/bs";

import "@/page/Admin/Page/css/Admin.css";
import InputHelper from "@/page/InputHelper";
import OutlerHeader from "@/component/Admin/OutlerHeader";
import APIHistory from "@/api/APICustomer";
import APITransaksi from "@/api/APITransaksi";
import NotFound from "@/component/Admin/NotFound";
import CustomPagination from "@/component/Admin/Pagination/CustomPagination";
import Formatter from "@/assets/Formatter";
import AddEditModal from "@/component/Admin/Modal/AddEditModal";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFCetak from "./PDFCetak";
import { FaCheck, FaDownload } from "react-icons/fa";
import { useConfirm } from "@/hooks/useConfirm";

export default function HistoryCustomerPage() {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingModal, setIsLoadingModal] = useState(true);
  const [selectedNota, setSelectedNota] = useState(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showGambarModal, setShowGambarModal] = useState(false);

  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(
    searchParams.get("status") ? searchParams.get("status") : "Semua"
  );
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(null);
  const [bukti_bayar, setBuktiBayar] = useState(null);

  const { confirm, modalElement } = useConfirm();

  const handleCloseModal = () => {
    setShowModal(false);
    setIsLoadingModal(false);
  };

  const handleCloseAddEditModal = () => setShowAddEditModal(false);
  const handleShowAddEditModal = () => setShowAddEditModal(true);

  const handleCloseGambarModal = () => setShowGambarModal(false);
  const handleShowGambarModal = () => setShowGambarModal(true);

  const [formData, setFormData] = useState({
    no_nota: "",
    bukti_bayar: "",
  });

  const validationSchema = {
    no_nota: {
      required: true,
      alias: "no_nota",
    },
    bukti_bayar: {
      required: true,
      alias: "bukti_bayar",
    },
  };

  const onSubmit = async (formData) => {
    if (isLoading) return;

    const data = new FormData();
    data.append("no_nota", formData.no_nota);
    data.append("bukti_bayar", formData.bukti_bayar);
    try {
      await confirmBayar.mutateAsync(data);
      return;
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Sesuatu sedang bermasalah pada server!"
      );
    }
  };

  const confirmBayar = useMutation({
    mutationFn: (data) => APITransaksi.confirmBayar(data),
    onSuccess: async () => {
      toast.success("Upload Bukti Bayar Berhasil!");
      fetchHistoryCust(null, filter);
      handleCloseAddEditModal();
      handleCloseModal();
      setFilter("Menunggu Konfirmasi Pembayaran");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const inputHelper = new InputHelper(
    formData,
    setFormData,
    validationSchema,
    onSubmit
  );

  const handleShowModal = useCallback(async (data) => {
    setShowModal(true);
    const response = await APIHistory.getNotaPesananSelf(data);
    setSelectedNota(response);
    setBuktiBayar(data?.bukti_pembayaran);
    setIsLoadingModal(false);
  }, []);

  const fetchHistoryCust = useCallback(
    async (signal, filter) => {
      setIsLoading(true);
      try {
        const response = await APIHistory.getCustHistoryByPageSelf(
          page,
          signal,
          filter
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

    fetchHistoryCust(signal, filter);
    if (filter) {
      setSearch("");
    }
    return () => {
      abortController.abort();
    };
  }, [fetchHistoryCust, filter]);

  const fetchHistorySearch = async () => {
    if (search.trim() === "") {
      // Kalo spasi doang bakal gabisa
      return;
    }

    setIsLoading(true);
    try {
      const response = await APIHistory.searchHistoryCustSelf(search, filter);
      setHistory(response);
    } catch (error) {
      setHistory([]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelesaiTransaksi = async () => {
    const data = {
      no_nota: selectedNota?.no_nota,
    };
    const isConfirmed = await confirm(
      "Apakah anda yakin ingin menyelesaikan transaksi ini?",
      "",
      "Selesai",
      true
    );

    if (!isConfirmed) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      await APITransaksi.updateStatusSelesaiSelf(data);

      fetchHistoryCust(null, filter);
      toast.success("Transaksi Selesai!");
      handleCloseModal();
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Sesuatu sedang bermasalah pada server!"
      );
    }
  };

  return (
    <>
      <OutlerHeader
        title="Kelola Data History Customer"
        desc="Lakukan pengelolaan data History Customer Atma Bakery"
        breadcrumb="History Customer"
      />
      <section className="content px-3">
        <Row className="pb-3 gap-1 gap-lg-0 gap-md-0">
          <Col
            xs={12}
            sm={12}
            lg={6}
            md={12}
            className="m-0 mb-lg-0 mb-md-0 mb-sm-0 mb-1"
          >
            <Dropdown>
              <Dropdown.Toggle variant="secondary" disabled={isLoading}>
                {filter}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    setFilter("Semua");
                  }}
                >
                  Semua
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setFilter("Menunggu Perhitungan Ongkir");
                  }}
                >
                  Menunggu Perhitungan Ongkir
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setFilter("Menunggu Pembayaran");
                  }}
                >
                  Menunggu Pembayaran
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setFilter("Menunggu Konfirmasi Pembayaran");
                  }}
                >
                  Menunggu Konfirmasi Pembayaran
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setFilter("Menunggu Konfirmasi Pesanan");
                  }}
                >
                  Menunggu Konfirmasi Pesanan
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setFilter("Pesanan Diterima");
                  }}
                >
                  Pesanan Diterima
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setFilter("Sedang Diproses");
                  }}
                >
                  Sedang Diproses
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setFilter("Siap Pick Up");
                  }}
                >
                  Siap Pick Up
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setFilter("Siap Kirim");
                  }}
                >
                  Siap Kirim
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setFilter("Sedang Diantar Kurir");
                  }}
                >
                  Sedang Diantar Kurir
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setFilter("Sedang Diantar Ojol");
                  }}
                >
                  Sedang Diantar Ojol
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setFilter("Terkirim");
                  }}
                >
                  Terkirim
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setFilter("Selesai");
                  }}
                >
                  Selesai
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setFilter("Ditolak");
                  }}
                >
                  Ditolak
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col
            xs={12}
            sm={12}
            lg={6}
            md={12}
            className="m-0 mb-lg-0 mb-md-0 mb-sm-0 mb-1"
          >
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Cari History disini"
                name="search"
                value={search || ""}
                disabled={isLoading}
                onChange={(e) => {
                  if (e.target.value === "") {
                    if (page !== 1) {
                      setPage(1);
                    } else {
                      fetchHistoryCust(null, filter);
                    }
                  }
                  setSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && search) {
                    fetchHistorySearch();
                  }
                }}
              />
              <Button
                variant="secondary"
                disabled={isLoading}
                onClick={() => fetchHistorySearch()}
              >
                <BsSearch />
              </Button>
            </InputGroup>
          </Col>
        </Row>
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
            <p className="text-muted">
              *Pemesanan PO akan secara otomatis ditolak H-1 sebelum tanggal
              ambil, dan untuk Ready Stock akan ditolak setelah jam 12 malam
              pada hari yang sama
            </p>
            <Table responsive striped>
              <thead>
                <tr>
                  <th style={{ width: "10%" }} className="th-style">
                    Nomor Nota
                  </th>
                  <th style={{ width: "16%" }} className="th-style">
                    Tanggal Pesan
                  </th>
                  <th style={{ width: "16%" }} className="th-style">
                    Tanggal Ambil
                  </th>
                  <th style={{ width: "13%" }} className="th-style">
                    Status
                  </th>
                  <th style={{ width: "16%" }} className="th-style">
                    Total
                  </th>
                  <th style={{ width: "13%" }} className="th-style">
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
                      {history.status.includes("Terkirim") ||
                      history.status.includes("Selesai") ||
                      history.status.includes("Pesanan Diterima") ? (
                        <Badge bg="success">{history.status}</Badge>
                      ) : history.status.includes("Sedang Diproses") ? (
                        <Badge bg="warning">{history.status}</Badge>
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
                            onClick={() => {
                              setSelectedNota(history);
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
            {lastPage > 1 && !search && (
              <CustomPagination
                totalPage={lastPage}
                currentPage={page}
                onChangePage={handleChangePage}
              />
            )}
          </>
        ) : (
          <NotFound
            text={
              search || history
                ? "History Tidak Ditemukan"
                : "Belum Ada History Disini"
            }
          />
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
                  Total Poin Customer :{" "}
                  {selectedNota?.poin_user_setelah_penambahan}
                </h5>
              </>
            )}
          </Modal.Body>
          {isLoadingModal ? null : (
            <Modal.Footer>
              {selectedNota?.status.includes("Menunggu Pembayaran") && (
                <Button
                  variant="primary"
                  onClick={() => {
                    handleShowAddEditModal();
                    setFormData({
                      no_nota: selectedNota?.no_nota,
                    });
                  }}
                >
                  Bayar
                </Button>
              )}
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
              {selectedNota?.status.includes("Sedang Diantar Ojol") ||
                selectedNota?.status.includes("Sedang Diantar Kurir") ||
                (selectedNota?.status.includes("Siap Pick Up") && (
                  <Button
                    variant="success"
                    onClick={() => {
                      handleSelesaiTransaksi();
                    }}
                  >
                    <FaCheck className="mb-1" /> Selesaikan Transaksi
                  </Button>
                ))}
              {selectedNota?.status.includes("Selesai") && (
                <PDFDownloadLink
                  document={<PDFCetak selectedNota={selectedNota} />}
                  fileName={"nota-" + selectedNota?.no_nota + ".pdf"}
                  className="btn btn-primary"
                >
                  <FaDownload className="mb-1" /> Cetak Nota
                </PDFDownloadLink>
              )}
              <Button variant="secondary" onClick={handleCloseModal}>
                Tutup
              </Button>
            </Modal.Footer>
          )}
        </Modal>
        <AddEditModal
          show={showAddEditModal}
          onHide={() => {
            handleCloseAddEditModal();
            setTimeout(() => {
              setImage(null);
            }, 125);
          }}
          size="md"
          title={"Upload Bukti Pembayaran"}
          text={"Pastikan bukti pembayaran yang telah anda upload telah benar"}
          onSubmit={inputHelper.handleSubmit}
          add={confirmBayar}
          isLoadingModal={isLoading}
        >
          <Form.Group className="text-start mt-3">
            <Form.Label>Bukti Pembayaran {formData?.no_nota}</Form.Label>
            <Form.Control
              type="file"
              style={{ border: "1px solid #808080" }}
              name="bukti_bayar"
              accept="image/png, image/jpeg"
              onChange={(e) => {
                if (e.target.files[0].size > 2000000) {
                  e.target.value = null;
                  toast.error("Bukti bayar tidak boleh lebih dari 2MB!");
                  return;
                }

                setImage(e.target.files[0]);
                setFormData({
                  no_nota: selectedNota?.no_nota,
                  bukti_bayar: e.target.files[0],
                });
              }}
              disabled={confirmBayar.isPending}
              required
            />
            {image !== null && (
              <div className="image-container">
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  width="200"
                  height="200"
                  className="img-thumbnail my-2 mx-1"
                />
              </div>
            )}
          </Form.Group>
        </AddEditModal>
        <Modal show={showGambarModal} onHide={handleCloseGambarModal}>
          <Image fluid src={bukti_bayar} alt="bukti_bayar" />
        </Modal>
      </section>
      {modalElement}
    </>
  );
}
