import {
  Button,
  Col,
  Row,
  Form,
  Table,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { useState, useEffect, useCallback, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import InputHelper from "@/page/InputHelper";
import {
  BsSearch,
  BsPlusSquare,
  BsPencilSquare,
  BsFillTrash3Fill,
  BsPrinterFill,
} from "react-icons/bs";

import "@/page/Admin/Page/css/Admin.css";

import OutlerHeader from "@/component/Admin/OutlerHeader";
import APIPembelianBahanBaku from "@/api/APIPembelianBahanBaku";
import NotFound from "@/component/Admin/NotFound";
import CustomPagination from "@/component/Admin/Pagination/CustomPagination";
import ConfirmationModal from "@/component/Admin/Modal/ConfirmationModal";
import PrintModal from "@/component/Admin/Modal/PrintModal";
import AddEditModal from "@/component/Admin/Modal/AddEditModal";
import APIBahanBaku from "@/api/APIBahanBaku";
import Formatter from "@/assets/Formatter";

export default function PembelianBahanBakuPage() {
  const [showDelModal, setShowDelModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showPrintModal, setshowPrintModal] = useState(false);
  const [selectedPembelianBahanBaku, setSelectedPembelianBahanBaku] =
    useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingModal, setIsLoadingModal] = useState(false);

  const handleCloseDelModal = () => setShowDelModal(false);
  const handleShowDelModal = () => setShowDelModal(true);

  const handleCloseAddEditModal = () => setShowAddEditModal(false);
  const handleShowAddEditModal = () => setShowAddEditModal(true);

  const handleClosePrintModal = () => setshowPrintModal(false);
  const handleShowPrintModal = () => setshowPrintModal(true);

  const [mode, setMode] = useState("add");
  const ref = useRef();

  // Fetch pembelian bahan baku lain with pagination
  const [pembelian_bahan_baku, setPembelianBahanBaku] = useState([]);
  const [bahanBakuOptions, setBahanBakuOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const startDateRef = useRef();
  const endDateRef = useRef();

  const fetchPembelianBahanBaku = useCallback(
    async (signal) => {
      setIsLoading(true);
      try {
        const response =
          await APIPembelianBahanBaku.getPembelianBahanBakuByPage(page, signal);
        setPembelianBahanBaku(response.data);
        setLastPage(response.last_page);
      } catch (error) {
        // Handle ketika data terakhir di suatu page dihapus, jadi mundur ke page sebelumnya
        // Atau bakal di set ke array kosong kalo hapus semua data di page pertama
        if (page - 1 === 0 || error.code === "ERR_NETWORK") {
          setPembelianBahanBaku([]);
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

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetchPembelianBahanBaku(signal);

    return () => {
      abortController.abort();
    };
  }, [fetchPembelianBahanBaku]);

  const [formData, setFormData] = useState({
    id_bahan_baku: "",
    stok: "",
    harga: "",
    tanggal_pembelian: "",
  });

  const validationSchema = {
    id_bahan_baku: {
      required: true,
      alias: "Bahan Baku",
    },
    stok: {
      required: true,
      alias: "Stok",
    },
    harga: {
      required: true,
      alias: "Harga",
    },
    tanggal_pembelian: {
      required: true,
      alias: "Tanggal Pembelian Bahan Baku",
    },
  };

  const handleMutationSuccess = () => {
    setIsLoading(true);
    if (!search) {
      fetchPembelianBahanBaku();
    } else {
      fetchPembelianBahanBakuSearch();
    }
    setTimeout(() => {
      setSelectedPembelianBahanBaku(null);
      setFormData({
        id_bahan_baku: "",
        stok: "",
        harga: "",
        tanggal_pembelian: "",
      });
      if (!search) setSearch(null);
    }, 125);
  };

  // Add Data
  const add = useMutation({
    mutationFn: (data) => APIPembelianBahanBaku.createPembelianBahanBaku(data),
    onSuccess: async () => {
      toast.success("Tambah Pembelian Bahan Baku berhasil!");
      handleCloseAddEditModal();
      handleMutationSuccess();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  // Edit Data
  const edit = useMutation({
    mutationFn: (data) =>
      APIPembelianBahanBaku.updatePembelianBahanBaku(
        data,
        selectedPembelianBahanBaku.id_pengadaan
      ),
    onSuccess: async () => {
      toast.success("Edit Pembelian Bahan Baku berhasil!");
      handleCloseAddEditModal();
      handleMutationSuccess();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const del = useMutation({
    mutationFn: (id) => APIPembelianBahanBaku.deletePembelianBahanBaku(id),
    onSuccess: async () => {
      toast.success("Hapus Pembelian Bahan Baku berhasil!");
      handleCloseDelModal();
      handleMutationSuccess();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = async (formData) => {
    if (isLoading) return;

    try {
      if (mode === "add") {
        await add.mutateAsync(formData);
        return;
      }

      if (mode === "edit") {
        await edit.mutateAsync(formData);
        return;
      }

      if (mode === "delete") {
        await del.mutateAsync(selectedPembelianBahanBaku.id_pengadaan);
        return;
      }
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Sesuatu sedang bermasalah pada server!"
      );
    }
  };

  const inputHelper = new InputHelper(
    formData,
    setFormData,
    validationSchema,
    onSubmit
  );

  // Search Data
  const fetchPembelianBahanBakuSearch = async () => {
    if (search.trim() === "") {
      // Kalo spasi doang bakal gabisa
      return;
    }

    setIsLoading(true);

    try {
      const response = await APIPembelianBahanBaku.searchPembelianBahanBaku(
        search.trim()
      );
      setPembelianBahanBaku(response);
    } catch (error) {
      setPembelianBahanBaku([]); // Kalo error / tidak ditemukan set pengeluaran jadi array kosong
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataBahanBaku = useCallback(async (selectedPembelianBahanBaku) => {
    try {
      setIsLoadingModal(true);
      const bahanBakuResponse = await APIBahanBaku.getAllBahanBaku();

      if (selectedPembelianBahanBaku === null) {
        setBahanBakuOptions(bahanBakuResponse);
        return;
      }

      const isFound = bahanBakuResponse.some(
        (element) =>
          element.id_bahan_baku ===
          selectedPembelianBahanBaku?.bahan_baku.id_bahan_baku
      );

      if (!isFound) {
        bahanBakuResponse.unshift({
          id_bahan_baku: selectedPembelianBahanBaku?.bahan_baku.id_bahan_baku,
          nama_bahan_baku:
            selectedPembelianBahanBaku?.bahan_baku.nama_bahan_baku,
        });
      }

      setBahanBakuOptions(bahanBakuResponse);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingModal(false);
    }
  }, []);

  return (
    <>
      <OutlerHeader
        title="Kelola Data Pembelian Bahan Baku"
        desc="Lakukan pengelolaan data pembelian bahan baku Atma Bakery"
        breadcrumb="Pembelian Bahan Baku"
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
            <Button
              variant="success"
              onClick={() => {
                handleShowAddEditModal();
                setMode("add");
                setFormData({
                  nama_bahan_baku: "",
                  stok: "",
                  satuan: "",
                });
                setSelectedPembelianBahanBaku(null);
              }}
              disabled={
                isLoading || add.isPending || edit.isPending || del.isPending
              }
              className="me-2 me-lg-1 mb-2 mb-lg-1 mb-md-2 mb-sm-2"
            >
              <BsPlusSquare className="mb-1 me-2" />
              Tambah Data
            </Button>
            <Button
              variant="secondary"
              onClick={handleShowPrintModal}
              disabled={isLoading}
              className="me-2 me-lg-1 mb-2 mb-lg-1 mb-md-2 mb-sm-2"
            >
              <BsPrinterFill className="mb-1 me-2" />
              Print Laporan
            </Button>
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
                placeholder="Cari Pembelian Bahan Baku disini"
                name="search"
                value={search || ""}
                disabled={
                  isLoading || add.isPending || edit.isPending || del.isPending
                }
                onChange={(e) => {
                  if (e.target.value === "") {
                    if (page !== 1) {
                      setPage(1);
                    } else {
                      fetchPembelianBahanBaku();
                    }
                  }
                  setSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && search) {
                    fetchPembelianBahanBakuSearch();
                  }
                }}
              />
              <Button
                variant="secondary"
                onClick={fetchPembelianBahanBakuSearch}
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
        ) : pembelian_bahan_baku?.length > 0 ? (
          <>
            <Table responsive striped>
              <thead>
                <tr>
                  <th style={{ width: "15%" }} className="th-style">
                    Nama Bahan Baku
                  </th>
                  <th style={{ width: "15%" }} className="th-style">
                    Stok
                  </th>
                  <th style={{ width: "10%" }} className="th-style">
                    Satuan
                  </th>
                  <th style={{ width: "15%" }} className="th-style">
                    Harga
                  </th>
                  <th style={{ width: "15%" }} className="th-style">
                    Tanggal Pembelian
                  </th>
                  <th style={{ width: "30%" }} className="th-style">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {pembelian_bahan_baku.map((pembelian_bahan_baku, index) => (
                  <tr key={index}>
                    <td>{pembelian_bahan_baku.bahan_baku?.nama_bahan_baku}</td>
                    <td>{pembelian_bahan_baku.stok}</td>
                    <td>{pembelian_bahan_baku.bahan_baku?.satuan}</td>
                    <td>
                      {Formatter.moneyFormatter(pembelian_bahan_baku.harga)}
                    </td>
                    <td>
                      {Formatter.dateFormatter(
                        pembelian_bahan_baku.tanggal_pembelian
                      )}
                    </td>
                    <td>
                      <Row className="gap-1 gap-lg-0 gap-md-0">
                        <Col xs={12} sm={12} md={6} lg={6}>
                          <Button
                            variant="primary"
                            className="w-100"
                            onClick={() => {
                              setSelectedPembelianBahanBaku(
                                pembelian_bahan_baku
                              );
                              setMode("edit");
                              setFormData({
                                id_bahan_baku:
                                  pembelian_bahan_baku.id_bahan_baku,
                                stok: pembelian_bahan_baku.stok,
                                harga: pembelian_bahan_baku.harga,
                                tanggal_pembelian:
                                  pembelian_bahan_baku.tanggal_pembelian,
                              });
                              handleShowAddEditModal();
                            }}
                          >
                            <BsPencilSquare className="mb-1" /> Ubah
                          </Button>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6}>
                          <Button
                            variant="danger"
                            className="custom-danger-btn w-100"
                            onClick={() => {
                              setSelectedPembelianBahanBaku(
                                pembelian_bahan_baku
                              );
                              setMode("delete");
                              handleShowDelModal();
                            }}
                          >
                            <BsFillTrash3Fill className="mb-1" /> Hapus
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
              search
                ? "Pembelian Bahan Baku Tidak Ditemukan"
                : "Belum Ada Pembelian Bahan Baku Disini"
            }
          />
        )}
        {/* ini modal modalnya */}
        <PrintModal
          show={showPrintModal}
          onHide={handleClosePrintModal}
          title="Print Laporan Penggunaan Pembelian Bahan Baku"
          text="Pilih tanggal Penggunaan Pembelian Bahan Baku"
          onSubmit={(e) => {
            e.preventDefault();
            handleClosePrintModal();
          }}
        >
          <Form.Group className="text-start mt-3">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Pilih Tanggal Awal
            </Form.Label>
            <Form.Control
              style={{ border: "1px solid #808080" }}
              type="date"
              max={new Date().toISOString().split("T")[0]}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              ref={startDateRef}
            />
          </Form.Group>
          <Form.Group className="text-start mt-3">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Pilih Tanggal Akhir
            </Form.Label>
            <Form.Control
              style={{ border: "1px solid #808080" }}
              type="date"
              min={startDate}
              max={new Date().toISOString().split("T")[0]}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              ref={endDateRef}
            />
          </Form.Group>
        </PrintModal>

        <AddEditModal
          show={showAddEditModal}
          onHide={() => {
            handleCloseAddEditModal();
            setTimeout(() => {
              setSelectedPembelianBahanBaku(null);
            }, 125);
          }}
          title={
            selectedPembelianBahanBaku
              ? "Edit Data Pembelian Bahan Baku"
              : "Tambah Data Pembelian Bahan Baku"
          }
          text={
            selectedPembelianBahanBaku
              ? "Pastikan data Pembelian Bahan Baku yang Anda ubah benar"
              : "Pastikan data Pembelian Bahan Baku yang Anda tambahkan benar"
          }
          onSubmit={inputHelper.handleSubmit}
          add={add}
          edit={edit}
          isLoadingModal={isLoadingModal}
          onEnter={async () => {
            await fetchDataBahanBaku(selectedPembelianBahanBaku);
          }}
        >
          <Form.Group className="text-start mt-3">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Nama Bahan Baku
            </Form.Label>
            <Form.Select
              style={{ border: "1px solid #808080" }}
              name="id_bahan_baku"
              value={formData?.id_bahan_baku}
              onChange={(e) => {
                inputHelper.handleInputChange(e);
              }}
              disabled={edit.isPending || add.isPending || isLoadingModal}
              required
            >
              <option value="" disabled selected hidden>
                Pilih Bahan Baku
              </option>
              {bahanBakuOptions?.map((option) => (
                <option key={option.id_bahan_baku} value={option.id_bahan_baku}>
                  {option.nama_bahan_baku}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="text-start mt-3">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Stok
            </Form.Label>
            <Form.Control
              style={{ border: "1px solid #808080" }}
              type="number"
              placeholder="Masukkan stok pembelian bahan baku"
              name="stok"
              value={formData?.stok}
              onChange={inputHelper.handleInputChange}
              disabled={edit.isPending || add.isPending || isLoadingModal}
              required
            />
          </Form.Group>
          <Form.Group className="text-start mt-3">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Harga
            </Form.Label>
            <Form.Control
              style={{ border: "1px solid #808080" }}
              type="number"
              placeholder="Masukkan harga pembelian bahan baku"
              name="harga"
              value={formData?.harga}
              onChange={inputHelper.handleInputChange}
              disabled={edit.isPending || add.isPending || isLoadingModal}
              required
            />
          </Form.Group>
          <Form.Group className="text-start mt-3">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Tanggal Pembelian Bahan Baku
            </Form.Label>
            <Form.Control
              style={{ border: "1px solid #808080" }}
              type="text"
              name="tanggal_pembelian"
              max={new Date().toISOString().split("T")[0]}
              value={formData?.tanggal_pembelian}
              onChange={inputHelper.handleInputChange}
              disabled={edit.isPending || add.isPending || isLoadingModal}
              ref={ref}
              onFocus={() => (ref.current.type = "date")}
              onBlur={() => (ref.current.type = "date")}
              placeholder="dd-mm-yyyy"
              required
            />
          </Form.Group>
        </AddEditModal>

        <ConfirmationModal
          header="Anda Yakin Ingin Menghapus Data Pembelian Bahan Baku Ini?"
          secondP="Semua data yang terkait dengan Pembelian Bahan Baku tersebut akan hilang."
          show={showDelModal}
          onCancel={() => {
            handleCloseDelModal();
            setSelectedPembelianBahanBaku(null);
          }}
          onSubmit={onSubmit}
          del={del}
        />
      </section>
    </>
  );
}
