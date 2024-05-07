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
import APIPenitip from "@/api/APIPenitip";
import NotFound from "@/component/Admin/NotFound";
import CustomPagination from "@/component/Admin/Pagination/CustomPagination";
import ConfirmationModal from "@/component/Admin/Modal/ConfirmationModal";
import PrintModal from "@/component/Admin/Modal/PrintModal";
import AddEditModal from "@/component/Admin/Modal/AddEditModal";

export default function PenitipPage() {
  const [showDelModal, setShowDelModal] = useState(false);
  const [showPrintModal, setshowPrintModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPenitip, setSelectedPenitip] = useState(null);

  const handleCloseDelModal = () => setShowDelModal(false);
  const handleShowDelModal = () => setShowDelModal(true);

  const handleCloseAddEditModal = () => setShowAddEditModal(false);
  const handleShowAddEditModal = () => setShowAddEditModal(true);

  const handleClosePrintModal = () => setshowPrintModal(false);
  const handleShowPrintModal = () => setshowPrintModal(true);
  const ref = useRef();

  // Mode untuk CRD
  // create -> "add"
  // update -> "edit"
  // delete -> "delete"
  const [mode, setMode] = useState("add");

  // Fetch penitip with pagination
  const [penitip, setPenitip] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchPenitip = useCallback(
    async (signal) => {
      setIsLoading(true);
      try {
        const response = await APIPenitip.getPenitipByPage(page, signal);
        setPenitip(response.data);
        setLastPage(response.last_page);
      } catch (error) {
        // Handle ketika data terakhir di suatu page dihapus, jadi mundur ke page sebelumnya
        // Atau bakal di set ke array kosong kalo hapus semua data di page pertama
        if (page - 1 === 0 || error.code === "ERR_NETWORK") {
          setPenitip([]);
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

  // Pas masuk load penitip
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetchPenitip(signal);

    return () => {
      abortController.abort();
    };
  }, [fetchPenitip]);

  // CRUD Penitip
  const [formData, setFormData] = useState({
    nama: "",
    no_telp: "",
  });

  // Untuk validasi front-end (sebisa mungkin samain dengan backend ya)
  const validationSchema = {
    nama: {
      required: true,
      alias: "Nama Penitip",
    },
    no_telp: {
      required: true,
      alias: "Nomor Telepon",
      minLength: 10,
      maxLength: 13,
      pattern: /^(?:\+?08)(?:\d{2,3})?[ -]?\d{3,4}[ -]?\d{4}$/,
    },
  };

  // Wajib dipanggil abis mutation / query
  const handleMutationSuccess = () => {
    setIsLoading(true);
    fetchPenitip();
    setTimeout(() => {
      setSelectedPenitip(null);
      setFormData({
        nama: "",
        no_telp: "",
      });
      setSearch(null);
    }, 125);
  };

  // Add Data
  const add = useMutation({
    mutationFn: (data) => APIPenitip.createPenitip(data),
    onSuccess: async () => {
      toast.success("Tambah Penitip berhasil!");
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
      APIPenitip.updatePenitip(data, selectedPenitip.id_penitip),
    onSuccess: async () => {
      toast.success("Edit Penitip berhasil!");
      handleCloseAddEditModal();
      handleMutationSuccess();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  // Delete Data
  const del = useMutation({
    mutationFn: (id) => APIPenitip.deletePenitip(id),
    onSuccess: async () => {
      toast.success("Hapus Penitip berhasil!");
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
        await del.mutateAsync(selectedPenitip.id_penitip);
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
  const fetchPenitipSearch = async () => {
    if (search.trim() === "") {
      // Kalo spasi doang bakal gabisa
      return;
    }

    setIsLoading(true);

    try {
      const response = await APIPenitip.searchPenitip(search.trim());
      setPenitip(response);
    } catch (error) {
      setPenitip([]); // Kalo error / tidak ditemukan set penitip jadi array kosong
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <OutlerHeader
        title="Kelola Data Pentip"
        desc="Lakukan pengelolaan data penitip Atma Bakery"
        breadcrumb="Penitip"
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
                  nama: "",
                  no_telp: "",
                });
              }}
              disabled={isLoading}
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
                placeholder="Cari Penitip disini"
                name="search"
                value={search || ""}
                disabled={isLoading}
                onChange={(e) => {
                  if (e.target.value === "") {
                    if (page !== 1) {
                      setPage(1);
                    } else {
                      fetchPenitip();
                    }
                  }
                  setSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && search) {
                    fetchPenitipSearch();
                  }
                }}
              />
              <Button
                variant="secondary"
                disabled={isLoading}
                onClick={fetchPenitipSearch}
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
        ) : penitip?.length > 0 ? (
          <>
            <Table responsive striped>
              <thead>
                <tr>
                  <th style={{ width: "20%" }} className="th-style">
                    ID Penitip
                  </th>
                  <th style={{ width: "25%" }} className="th-style">
                    Nama
                  </th>
                  <th style={{ width: "25%" }} className="th-style">
                    Nomor Telepon
                  </th>
                  <th style={{ width: "30%" }} className="th-style">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {penitip.map((penitip, index) => (
                  <tr key={index}>
                    <td>{penitip.id_penitip}</td>
                    <td>{penitip.nama}</td>
                    <td>{penitip.no_telp}</td>
                    <td>
                      <Row className="gap-1 gap-lg-0 gap-md-0">
                        <Col xs={12} sm={12} md={6} lg={6}>
                          <Button
                            variant="primary"
                            className="w-100"
                            onClick={() => {
                              setSelectedPenitip(penitip);
                              setMode("edit");
                              setFormData({
                                nama: penitip.nama,
                                no_telp: penitip.no_telp,
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
                              setSelectedPenitip(penitip);
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
              search ? "Penitip Tidak Ditemukan" : "Belum Ada Penitip Disini"
            }
          />
        )}

        {/* 
          Modal - Modal dibawah
          Notable note : 
          jangan lupa setMode("add") atau setMode("edit") atau setMode("delete") ketika mau nampilin modal (set nya di button atas ye)
          dan keluar modal di setMode("add")

          add / edit / del .isPending itu ketika query sedang berjalan, mirip dengan isLoading tapi bawaan react querynya
        */}
        <PrintModal
          show={showPrintModal}
          onHide={handleClosePrintModal}
          title="Print Laporan Bulanan Penitip"
          text="Pilih bulan dan cetak laporan bulanan penitip"
          onSubmit={() => {}} // Nanti diisi
        >
          <Form.Group className="text-start mt-3">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Pilih Bulan
            </Form.Label>
            <Form.Control
              style={{ border: "1px solid #808080" }}
              ref={ref}
              type="text"
              onFocus={() => (ref.current.type = "month")}
              onBlur={() => (ref.current.type = "month")}
              placeholder="Month YYYY"
            />
          </Form.Group>
        </PrintModal>

        <AddEditModal
          show={showAddEditModal}
          onHide={() => {
            handleCloseAddEditModal();
            setTimeout(() => {
              setSelectedPenitip(null);
            }, 125);
          }}
          size="md"
          title={selectedPenitip ? "Edit Data Penitip" : "Tambah Data Penitip"}
          text={
            selectedPenitip
              ? "Pastikan data penitip yang Anda ubahkan benar"
              : "Pastikan data penitip yang Anda tambahkan benar"
          }
          onSubmit={inputHelper.handleSubmit}
          add={add}
          edit={edit}
          isLoadingModal={isLoading}
        >
          <Form.Group className="text-start mt-3">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Nama
            </Form.Label>
            <Form.Control
              style={{ border: "1px solid #808080" }}
              type="text"
              placeholder="Masukkan nama penitip"
              name="nama"
              value={formData.nama}
              onChange={inputHelper.handleInputChange}
              disabled={edit.isPending || add.isPending}
              required
            />
          </Form.Group>
          <Form.Group className="text-start mt-3">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Nomor Telepon
            </Form.Label>
            <Form.Control
              style={{ border: "1px solid #808080" }}
              type="number"
              placeholder="Masukkan nomor telepon"
              name="no_telp"
              value={formData.no_telp}
              onChange={inputHelper.handleInputChange}
              disabled={edit.isPending || add.isPending}
              required
            />
          </Form.Group>
        </AddEditModal>

        <ConfirmationModal
          header="Anda Yakin Ingin Menghapus Data Penitip Ini?"
          secondP="Semua data yang terkait dengan penitip tersebut akan hilang."
          show={showDelModal}
          onCancel={() => {
            handleCloseDelModal();
            setSelectedPenitip(null);
          }}
          onSubmit={onSubmit}
          del={del}
        />
      </section>
    </>
  );
}
