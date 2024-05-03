import {
  Button,
  Col,
  Row,
  Modal,
  Table,
  Spinner,
  Badge,
} from "react-bootstrap";
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";

import { BsInbox } from "react-icons/bs";

import "@/page/Admin/Page/css/Admin.css";

import OutlerHeader from "@/component/Admin/OutlerHeader";
import APIHistory from "@/api/APICustomer";
import NotFound from "@/component/Admin/NotFound";
import CustomPagination from "@/component/Admin/Pagination/CustomPagination";

export default function HistoryCustomerPage() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHistory, setSelectedHistory] = useState([]);
  const [selectedNota, setSelectedNota] = useState(null);
  const [selectedNota1, setSelectedNota1] = useState(null);
  const [hargaOngkir, setOngkir] = useState(null);

  const ref = useRef();

  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = useCallback( 
    async(data) =>{
    const response = await APIHistory.getNotaPesanan(data);
    console.log(response);
    setSelectedNota1(response);
    setShowModal(true);
  },
  []
);

  const fetchHistoryCust = useCallback(
    async (id) => {
      setIsLoading(true);
      try {
        const response = await APIHistory.getCustHistoryByPage(id, page);
        setHistory(response);
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
    fetchHistoryCust(id);
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
                    <td>{history.tanggal_pesan}</td>
                    <td>{history.tanggal_ambil}</td>
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
                      {history.status == "Terkirim" ? (
                        <Badge bg="success">{history.status}</Badge>
                      ) : history.status === "Dibatalkan" ? (
                        <Badge bg="danger">{history.status}</Badge>
                      ) : (
                        <Badge bg="secondary">{history.status}</Badge>
                      )}
                    </td>
                    <td>
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(history.total)}
                    </td>
                    <td>
                      <Row className="gap-1 gap-lg-0 gap-md-0">
                        <Col xs={12} sm={12} md={11} lg={11}>
                          <Button
                            variant="danger"
                            className="custom-danger-btn w-100"
                            onClick={() => {
                              setSelectedNota(history);
                              setSelectedHistory(history.detail_transaksi);
                              if(history.radius <= 5){
                                setOngkir(10000);
                              } else if (history.radius <= 10) {
                                setOngkir(15000);
                              } else if (history.radius <= 15) {
                                setOngkir(20000);
                              } else {
                                setOngkir(25000);
                              }
                              handleShowModal(history);
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
              search ? "History Tidak Ditemukan" : "Belum Ada History Disini"
            }
          />
        )}

        <Modal show={showModal} onHide={handleCloseModal} size="xl">
          <Modal.Body className="text-start p-4 m-2">
            <Row>
              <Col>
                <h2 style={{ fontWeight: "bold" }}>Atma Kitchen</h2>
                <h5
                  style={{ color: "rgb(18,19,20,70%)", fontSize: "1.1em" }}
                  className="mt-3"
                >
                  Jl. Centralpark No. 10 Yogyakarta
                </h5>
                <h5
                  style={{ color: "rgb(18,19,20,70%)", fontSize: "1.1em" }}
                >
                  AtmaKitchen@gmail.uajy.ac.id
                </h5>
                <h5
                  style={{ color: "rgb(18,19,20,70%)", fontSize: "1.1em" }}
                >
                  012-345-6789
                </h5>
              </Col>
              <Col className="text-end">
                <h4 >Nota {selectedNota1?.no_nota} 
                  {selectedNota1?.status == "Terkirim" ? (
                        <Badge className="ms-3 font-size-12" bg="success">{selectedNota1?.status}</Badge>
                      ) : selectedNota1?.status === "Dibatalkan" ? (
                        <Badge className="ms-3 font-size-12" bg="danger">{selectedNota1?.status}</Badge>
                      ) : (
                        <Badge className="ms-3 font-size-12" bg="secondary">{selectedNota1?.status}</Badge>
                      )}
                </h4>
                <h5
                  style={{ color: "rgb(18,19,20,70%)", fontSize: "1.1em" }}
                  className="mt-3"
                >
                  Tanggal Pesan : {selectedNota1?.tanggal_pesan}
                </h5>
                <h5
                  style={{ color: "rgb(18,19,20,70%)", fontSize: "1.1em" }}
                >
                  Lunas Pada : {selectedNota1?.tanggal_lunas}
                </h5>
                <h5
                  style={{ color: "rgb(18,19,20,70%)", fontSize: "1.1em" }}
                >
                  Tanggal Ambil : {selectedNota1?.tanggal_ambil}
                </h5>
              </Col>
            </Row>

            <hr style={{ border:"1px solid" }}/>

            <Row>
              <Col>
                <h4 style={{ fontWeight: "bold" }}>Customer : </h4>
                <h5
                  style={{ color: "rgb(18,19,20,70%)", fontSize: "1.07em", fontWeight:"600"}}
                >
                  {selectedNota1?.nama}
                </h5>
                <h5
                  style={{ color: "rgb(18,19,20,70%)", fontSize: "1.07em" }}
                >
                  {selectedNota1?.email}
                </h5>
                <h5
                  style={{ color: "rgb(18,19,20,70%)", fontSize: "1.07em" }}
                >
                  {selectedNota1?.no_telp}
                </h5>
              </Col>
              <Col className="text-end">
                <h4 >Tipe Delivery
                    {selectedNota1?.tipe_delivery == "Ojol" ? (
                        <Badge className="ms-2 font-size-12" bg="success">{selectedNota1?.tipe_delivery}</Badge>
                      ) : selectedNota1?.tipe_delivery === "Kurir" ? (
                        <Badge className="ms-2 font-size-12" bg="primary">{selectedNota1?.tipe_delivery}</Badge>
                      ) : (
                        <Badge className="ms-2 font-size-12" bg="dark">{selectedNota1?.tipe_delivery}</Badge>
                      )}
                </h4>
                {selectedNota1?.tipe_delivery == "Ambil" ? (
                  null
                ) : (
                  <>
                    <h5
                      style={{ color: "rgb(18,19,20,70%)", fontSize: "1.05em" }}
                      className="mt-2"
                    >
                      {selectedNota1?.lokasi}
                    </h5>
                    <h5
                      style={{ color: "rgb(18,19,20,70%)", fontSize: "1.05em" }}
                    >
                      {selectedNota1?.keterangan}
                    </h5>
                  </>
                ) }
                
              </Col>
            </Row>
            <h5 className="mt-3" style={{ fontWeight:"bold" }}>Ringkasan Pesanan</h5>
            <Table responsive className="text-start align-middle table-nowrap">
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
                {selectedHistory.map(function (detail, idx) {
                  return (
                    <tr key={idx}>
                      <td>{idx+1}</td>
                      <td>{detail.nama_produk} </td>
                      <td>{detail.jumlah}</td>
                      <td>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(detail.jumlah * detail.harga_saat_beli)}
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
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(hargaOngkir)}
                  </td>
                </tr>
                ) : null}
                <tr>
                  <td className="text-end" colSpan={3}>
                    Potongan Poin {selectedNota1?.penggunaan_poin} poin : 
                  </td>
                  <td>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(selectedNota1?.penggunaan_poin * 100)}
                  </td>
                </tr>
                <tr>
                  <td className="text-end" colSpan={3}>
                    Total : 
                  </td>
                  <td>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(selectedNota?.total)}
                  </td>
                </tr> 
              </tbody>
            </Table>
              <h5
                style={{ color: "rgb(18,19,20,70%)", fontSize: "1.1em" }}
                className="mt-1"
              >
                Poin dari pesanan ini : {selectedNota1?.penambahan_poin}
              </h5>
              <h5
                style={{ color: "rgb(18,19,20,70%)", fontSize: "1.1em" }}
                className="mt-1"
              >
                Total Poin Customer : {selectedNota1?.poin_user_setelah_penambahan}
              </h5>
          </Modal.Body>
        </Modal>
      </section>
    </>
  );
}
