import {
    Button,
    Col,
    Row,
    Form,
    Table,
    InputGroup,
    Spinner,
  } from "react-bootstrap";
  import { useState, useEffect, useCallback } from "react";
  import { Link } from "react-router-dom";
  
  import { BsSearch, BsInbox } from "react-icons/bs";
  
    import Formatter from "@/assets/Formatter";
  
  import "@/page/Admin/Page/css/Admin.css";
  
  import OutlerHeader from "@/component/Admin/OutlerHeader";
  import APISaldo from "@/api/APISaldo";
  import NotFound from "@/component/Admin/NotFound";
  import CustomPagination from "@/component/Admin/Pagination/CustomPagination";
  import { toast } from "sonner";
  import { useConfirm } from "@/hooks/useConfirm";
  
  export default function HistoriSaldoPage() {
    const [isLoading, setIsLoading] = useState(true);
  
    const [historySaldo, setHistorySaldo] = useState([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [search, setSearch] = useState("");
    const { confirm, modalElement } = useConfirm();
    const [selectedSaldo, setSelectedSaldo] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleCloseConfirmModal = () => setShowConfirmModal(false);
    const handleShowConfirmModal = () => setShowConfirmModal(true);

    const fetchHistorySaldo = useCallback(
      async (signal) => {
        setIsLoading(true);
        try {
          const response = await APISaldo.getHistorySaldoByPage(page, signal);
          console.log(response.data);
          setHistorySaldo(response.data);
          setLastPage(response.last_page);
        } catch (error) {
          // Handle ketika data terakhir di suatu page dihapus, jadi mundur ke page sebelumnya
          // Atau bakal di set ke array kosong kalo hapus semua data di page pertama
          if (page - 1 === 0 || error.code === "ERR_NETWORK") {
            setHistorySaldo([]);
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
  
      fetchHistorySaldo(signal);
  
      return () => {
        abortController.abort();
      };
    }, [fetchHistorySaldo]);

    const handleConfirmPembayaran = async (saldo) => {
  
      const isConfirmed = await confirm(
        `Apakah anda yakin ingin mengkonfirmasi transfer saldo ini?`,
        "",
        "Konfirmasi",
        false
      );
  
      if (!isConfirmed) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await APISaldo.confirmSaldoAdmin(saldo);

        console.log(response);
        const abortController = new AbortController();
        const signal = abortController.signal;
        await fetchHistorySaldo(signal); 

        toast.success("Konfirmasi Transfer oleh Admin Berhasil!");
        handleCloseConfirmModal();
        setSelectedSaldo("");
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
          title="Konfirmasi Transfer Saldo"
          desc="Lakukan konfirmasi transfer saldo customer"
          breadcrumb="Customer"
        />
        <section className="content px-3">
          <Row className="pb-3 gap-1 gap-lg-0 gap-md-0">
            
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
          ) : historySaldo?.length > 0 ? (
            <>
              <Table responsive striped>
                <thead>
                  <tr>
                    <th style={{ width: "17%" }} className="th-style">
                      Nama User
                    </th>
                    <th style={{ width: "16%" }} className="th-style">
                      Tanggal Penarikan
                    </th>
                    <th style={{ width: "16%" }} className="th-style">
                      Nama Bank
                    </th>
                    <th style={{ width: "16%" }} className="th-style">
                      Nomor Rekening
                    </th>
                    <th style={{ width: "15%" }} className="th-style">
                      Saldo
                    </th>
                    <th style={{ width: "20%" }} className="th-style">
                      Aksi
                    </th>
                  </tr>
                </thead>
  
                <tbody>
                  {historySaldo.map((history, index) => (
                    <tr key={index}>
                      <td>{history.user.nama}</td>
                      <td>{history.tanggal}</td>
                      <td>{history.nama_bank}</td>
                      <td>{history.no_rek}</td>
                      <td>{Formatter.moneyFormatter(history.saldo)}</td>
                      {history.tanggal == null ? 
                      <td>
                        <Row className="gap-1 gap-lg-0 gap-md-0">
                          <Col xs={12} sm={12} md={11} lg={11}>
                          <Button
                            variant="danger"
                            className="custom-danger-btn w-100"
                            onClick={() => {
                              setSelectedSaldo(history.id_histori_saldo);
                              handleConfirmPembayaran(history.id_histori_saldo);
                            }}
                          >
                              <BsInbox className="mb-1" /> Konfirmasi Transfer Saldo
                            </Button>
                          </Col>
                        </Row>
                      </td>
                      :
                      <td>
                        <Button
                            variant="success"
                            className="w-100"
                            onClick={() => {
                            }}
                          >
                            Berhasil Konfirmasi Transfer Saldo
                            </Button>
                      </td>
                      }
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
                search ? "History Saldo Tidak ditemukan!" : "Belum Ada Penarikan Saldo Disini"
              }
            />
          )}
          {modalElement}
        </section>
      </>
    );
  }
  