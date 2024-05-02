import {
    Button,
    Col,
    Row,
    Modal,
    Table,
    Spinner,
    Badge,
  } from "react-bootstrap";
  import { useState, useEffect, useCallback, useRef  } from "react";
  import { useParams } from "react-router-dom";
  
  import {
    BsInbox,
  } from "react-icons/bs";
  
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
  
    const ref = useRef();
  
    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [search, setSearch] = useState(null);
    const [showModal , setShowModal] = useState(false);
  
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const fetchHistoryCust = useCallback(async (id) => {
      setIsLoading(true);
      try {
        const response = await APIHistory.getCustHistoryByPage(id, page);
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
    }, [page]);
  
    const handleChangePage = useCallback((newPage) => {
      setPage(newPage);
    }, []);
  
    // Pas masuk load customer
    useEffect(() => {
      fetchHistoryCust(id);
    }, [fetchHistoryCust]);
  
    return (
      <>
        <OutlerHeader
          title="Kelola Data History Customer"
          desc="Lakukan pengelolaan data History Customer Atma Bakery"
          breadcrumb="History_Customer"
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
                      <td >{history.no_nota}</td>
                      <td>{history.tanggal_pesan}</td>
                      <td>{history.tanggal_ambil}</td>
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
                                setSelectedNota(history)
                                setSelectedHistory(history.detail_transaksi);
                                console.log(history.detail_transaksi);
                                handleShowModal();
                              }
                                
                              }
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

          <Modal
            show={showModal}
            onHide={handleCloseModal}
          >
            <Modal.Body className="text-center p-4 m-2">
              <h5 style={{ fontWeight: "bold" }}>Detail Transaksi {selectedNota?.no_nota}</h5>
              <p
                style={{ color: "rgb(18,19,20,70%)", fontSize: "1em" }}
                className="mt-1"
              >
                Tipe Delivery : {selectedNota?.tipe_delivery}
              </p>
              
              <Table responsive striped className="text-start">
                <thead>
                  <tr>
                    <th style={{ width: "20%" }} className="th-style">
                      Produk
                    </th>
                    <th style={{ width: "15%" }} className="th-style">
                      Jumlah
                    </th>
                    <th style={{ width: "20%" }} className="th-style">
                      Total
                    </th>
                  </tr>
                </thead>
                  <tbody>
                    { selectedHistory.map(function(
                      detail,idx
                    ) {
                      return(
                        <tr key={idx}>
                          <td>ini nanti nama produk/hampers </td>
                          <td>{detail.jumlah}</td>
                          <td>
                            {/* {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format()} */}
                             ini nanti subtotal
                        </td>
                        </tr>
                      );
                    }
                  
                  )}
                      
                  </tbody>
              </Table>
            </Modal.Body>
            
          </Modal>
        </section>
      </>
    );
  }
  