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
import APIPengeluaran from "@/api/APIPengeluaranLain";
import NotFound from "@/component/Admin/NotFound";
import CustomPagination from "@/component/Admin/Pagination/CustomPagination";
import ConfirmationModal from "@/component/Admin/Modal/ConfirmationModal";
import PrintModal from "@/component/Admin/Modal/PrintModal";
import AddEditModal from "@/component/Admin/Modal/AddEditModal";
import Formatter from "@/assets/Formatter";

export default function PengeluaranLainPage() {
  const [showDelModal, setShowDelModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showPrintModal, setshowPrintModal] = useState(false);
  const [selectedPengeluaran, setSelectedPengeluaran] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleCloseDelModal = () => setShowDelModal(false);
  const handleShowDelModal = () => setShowDelModal(true);

  const handleCloseAddEditModal = () => setShowAddEditModal(false);
  const handleShowAddEditModal = () => setShowAddEditModal(true);

  const handleClosePrintModal = () => setshowPrintModal(false);
  const handleShowPrintModal = () => setshowPrintModal(true);

  const [mode, setMode] = useState("add");

  // Fetch pengeluaran lain with pagination
  const [pengeluaran, setPengeluaran] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const startDateRef = useRef();
  const endDateRef = useRef();

  const fetchPengeluaran = useCallback(
    async (signal) => {
      setIsLoading(true);
      try {
        const response = await APIPengeluaran.getPengeluaranByPage(
          page,
          signal
        );
        setPengeluaran(response.data);
        setLastPage(response.last_page);
      } catch (error) {
        // Handle ketika data terakhir di suatu page dihapus, jadi mundur ke page sebelumnya
        // Atau bakal di set ke array kosong kalo hapus semua data di page pertama
        if (page - 1 === 0 || error.code === "ERR_NETWORK") {
          setPengeluaran([]);
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

    fetchPengeluaran(signal);

    return () => {
      abortController.abort();
    };
  }, [fetchPengeluaran]);

  const [formData, setFormData] = useState({
    nama: "",
    other: "",
    total: "",
    tanggal_pengeluaran: "",
  });

  const validationSchema = {
    nama: {
      required: true,
      alias: "Nama Pengeluaran Lain",
    },
    total: {
      required: true,
      alias: "Total Pengeluaran Lain",
    },
    other: {
      required: formData.nama === "Other" ? true : false,
      alias: "Nama Pengeluaran Lain",
    },
    tanggal_pengeluaran: {
      required: true,
      alias: "Tanggal Pengeluaran Lain",
    },
  };

  const handleMutationSuccess = () => {
    setIsLoading(true);
    if (!search) {
      fetchPengeluaran();
    } else {
      fetchPengeluaranSearch();
    }
    setTimeout(() => {
      setSelectedPengeluaran(null);
      setFormData({
        nama: "",
        other: "",
        total: "",
        tanggal_pengeluaran: "",
      });
      if (!search) setSearch(null);
    }, 125);
  };

  // Add Data
  const add = useMutation({
    mutationFn: (data) => APIPengeluaran.createPengeluaran(data),
    onSuccess: async () => {
      toast.success("Tambah Pengeluaran berhasil!");
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
      APIPengeluaran.updatePengeluaran(
        data,
        selectedPengeluaran.id_pengeluaran
      ),
    onSuccess: async () => {
      toast.success("Edit Pengeluaran berhasil!");
      handleCloseAddEditModal();
      handleMutationSuccess();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const del = useMutation({
    mutationFn: (id) => APIPengeluaran.deletePengeluaran(id),
    onSuccess: async () => {
      toast.success("Hapus Pengeluaran berhasil!");
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
      if (formData?.nama === "Other") {
        formData.nama = formData.other;
        delete formData.other;
      }

      if (mode === "add") {
        await add.mutateAsync(formData);
        return;
      }

      if (mode === "edit") {
        await edit.mutateAsync(formData);
        return;
      }

      if (mode === "delete") {
        await del.mutateAsync(selectedPengeluaran.id_pengeluaran);
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
  const fetchPengeluaranSearch = async () => {
    if (search.trim() === "") {
      // Kalo spasi doang bakal gabisa
      return;
    }

    setIsLoading(true);

    try {
      const response = await APIPengeluaran.searchPengeluaran(search.trim());
      setPengeluaran(response);
    } catch (error) {
      setPengeluaran([]); // Kalo error / tidak ditemukan set pengeluaran jadi array kosong
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <OutlerHeader
        title="Kelola Data Pengeluaran"
        desc="Lakukan pengelolaan data pengeluaran Atma Bakery"
        breadcrumb="Pengeluaran"
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
                placeholder="Cari Pengeluaran disini"
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
                      fetchPengeluaran();
                    }
                  }
                  setSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && search) {
                    fetchPengeluaranSearch();
                  }
                }}
              />
              <Button variant="secondary" onClick={fetchPengeluaranSearch}>
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
        ) : pengeluaran?.length > 0 ? (
          <>
            <Table responsive striped>
              <thead>
                <tr>
                  <th style={{ width: "20%" }} className="th-style">
                    Nama
                  </th>
                  <th style={{ width: "20%" }} className="th-style">
                    Total
                  </th>
                  <th style={{ width: "20%" }} className="th-style">
                    Tanggal Pengeluaran
                  </th>
                  <th style={{ width: "30%" }} className="th-style">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {pengeluaran.map((pengeluaran, index) => (
                  <tr key={index}>
                    <td>{pengeluaran.nama}</td>
                    <td>{Formatter.moneyFormatter(pengeluaran.total)}</td>
                    <td>
                      {Formatter.dateFormatter(pengeluaran.tanggal_pengeluaran)}
                    </td>
                    <td>
                      <Row className="gap-1 gap-lg-0 gap-md-0">
                        <Col xs={12} sm={12} md={6} lg={6}>
                          <Button
                            variant="primary"
                            className="w-100"
                            onClick={() => {
                              setSelectedPengeluaran(pengeluaran);
                              setMode("edit");

                              let pengeluaranNama = "";

                              switch (pengeluaran.nama) {
                                case "Iuran RT":
                                  pengeluaranNama = "Iuran RT";
                                  break;
                                case "Bensin":
                                  pengeluaranNama = "Bensin";
                                  break;
                                case "Listrik":
                                  pengeluaranNama = "Listrik";
                                  break;
                                case "Gas":
                                  pengeluaranNama = "Gas";
                                  break;
                                default:
                                  pengeluaranNama = "Other";
                                  break;
                              }

                              setFormData({
                                nama: pengeluaranNama,
                                other: pengeluaran.nama,
                                total: pengeluaran.total,
                                tanggal_pengeluaran:
                                  pengeluaran.tanggal_pengeluaran,
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
                              setSelectedPengeluaran(pengeluaran);
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
                ? "Pengeluaran Tidak Ditemukan"
                : "Belum Ada Pengeluaran Disini"
            }
          />
        )}
        {/* ini modal modalnya */}
        <PrintModal
          show={showPrintModal}
          onHide={handleClosePrintModal}
          title="Print Laporan Penggunaan Pengeluaran"
          text="Pilih tanggal Penggunaan Pengeluaran"
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
              required
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
              required
            />
          </Form.Group>
        </PrintModal>

        <AddEditModal
          show={showAddEditModal}
          onHide={() => {
            handleCloseAddEditModal();
            setTimeout(() => {
              setSelectedPengeluaran(null);
            }, 125);
          }}
          title={
            selectedPengeluaran
              ? "Edit Data Pengeluaran"
              : "Tambah Data Pengeluaran"
          }
          text={
            selectedPengeluaran
              ? "Pastikan data pengeluaran yang Anda ubah benar"
              : "Pastikan data pengeluaran yang Anda tambahkan benar"
          }
          onSubmit={inputHelper.handleSubmit}
          add={add}
          edit={edit}
        >
          <Form.Group className="text-start mt-3">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Nama
            </Form.Label>
            <Form.Select
              style={{ border: "1px solid #808080" }}
              type="text"
              placeholder="Masukkan nama pengeluaran"
              name="nama"
              value={formData?.nama}
              onChange={inputHelper.handleInputChange}
              disabled={edit.isPending || add.isPending}
              required
            >
              <option value="" disabled selected hidden>
                Pilih Nama Pengeluaran
              </option>
              <option value="Iuran RT">Iuran RT</option>
              <option value="Bensin">Bensin</option>
              <option value="Listrik">Listrik</option>
              <option value="Gas">Gas</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>
          {formData.nama === "Other" && (
            <Form.Group className="text-start mt-3">
              <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                Nama Pengeluaran Lain
              </Form.Label>
              <Form.Control
                style={{ border: "1px solid #808080" }}
                type="text"
                placeholder="Masukkan nama pengeluaran lain"
                name="other"
                value={formData?.other}
                onChange={inputHelper.handleInputChange}
                disabled={edit.isPending || add.isPending}
                required
              />
            </Form.Group>
          )}
          <Form.Group className="text-start mt-3">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Total
            </Form.Label>
            <Form.Control
              style={{ border: "1px solid #808080" }}
              type="number"
              placeholder="Masukkan stok pengeluaran"
              name="total"
              value={formData?.total}
              onChange={inputHelper.handleInputChange}
              disabled={edit.isPending || add.isPending}
              required
            />
          </Form.Group>
          <Form.Group className="text-start mt-3">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Tanggal Pengeluaran
            </Form.Label>
            <Form.Control
              style={{ border: "1px solid #808080" }}
              type="date"
              name="tanggal_pengeluaran"
              max={new Date().toISOString().split("T")[0]}
              value={formData?.tanggal_pengeluaran}
              onChange={inputHelper.handleInputChange}
              required
            />
          </Form.Group>
        </AddEditModal>

        <ConfirmationModal
          header="Anda Yakin Ingin Menghapus Data Pengeluaran Ini?"
          secondP="Semua data yang terkait dengan pengeluaran tersebut akan hilang."
          show={showDelModal}
          onCancel={() => {
            handleCloseDelModal();
            setSelectedPengeluaran(null);
          }}
          onSubmit={onSubmit}
          del={del}
        />
      </section>
    </>
  );
}
