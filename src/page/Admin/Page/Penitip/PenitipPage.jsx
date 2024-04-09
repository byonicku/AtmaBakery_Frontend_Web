import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { useState, useEffect, useCallback } from "react";
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

import OutlerHeader from "@/component/Admin/OutlerHeader";
import APIPenitip from "@/api/APIPenitip";
import NotFound from "@/component/Admin/NotFound";
import CustomPagination from "@/component/Admin/CustomPagination";

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

  // Mode untuk CRD
  // create -> "add"
  // update -> "edit"
  // delete -> "delete"
  const [mode, setMode] = useState("add");

  // Fetch penitip with pagination
  const [penitip, setPenitip] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState(null);

  const fetchPenitip = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await APIPenitip.getPenitipByPage(page);
      setPenitip(response.data);
      setLastPage(response.last_page);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  const handleChangePage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  // Pas masuk load penitip
  useEffect(() => {
    fetchPenitip();
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
      toast.error(error.message);
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
      toast.error(error.message);
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
      toast.error(error.message);
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
      console.error(error);
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
    if (search.trim() === "") { // Kalo spasi doang bakal gabisa
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
        <Row className="pb-3">
          <Col
            xs="12"
            sm="6"
            lg="6"
            md="6"
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
              className="me-2"
            >
              <BsPlusSquare className="mb-1 me-2" />
              Tambah Data
            </Button>
            <Button
              variant="secondary"
              onClick={handleShowPrintModal}
              disabled={isLoading}
            >
              <BsPrinterFill className="mb-1 me-2" />
              Print Laporan
            </Button>
          </Col>
          <Col
            xs="12"
            sm="6"
            lg="6"
            md="6"
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
                  if (e.key === "Enter") {
                    fetchPenitipSearch();
                  }
                }}
              />
              <Button variant="secondary" disabled={isLoading} onClick={() => fetchPenitipSearch()}>
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
            <Table striped>
              <thead>
                <tr>
                  <th style={{ width: "25%" }} className="th-style">
                    ID Penitip
                  </th>
                  <th style={{ width: "25%" }} className="th-style">
                    Nama
                  </th>
                  <th style={{ width: "25%" }} className="th-style">
                    Nomor Telepon
                  </th>
                  <th style={{ width: "25%" }} className="th-style">
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
                    <td className="text-start">
                      <Button
                        variant="primary"
                        style={{ width: "40%" }}
                        className="mx-2"
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
                      <Button
                        variant="danger"
                        style={{ backgroundColor: "#FF5B19", width: "40%" }}
                        className="mx-2"
                        onClick={() => {
                          setSelectedPenitip(penitip);
                          setMode("delete");
                          handleShowDelModal();
                        }}
                      >
                        <BsFillTrash3Fill className="mb-1" /> Hapus
                      </Button>
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
        <Modal
          show={showDelModal}
          onHide={() => {
            handleCloseDelModal();
            setSelectedPenitip(null);
            setMode("add");
          }}
          centered
          size="lg"
          style={{ border: "none" }}
          keyboard={false}
          backdrop="static"
        >
          <Modal.Body className="text-center p-5">
            <h3 style={{ fontWeight: "bold" }}>
              Anda Yakin Ingin Menghapus Data Penitip Ini?
            </h3>
            <p
              style={{ color: "rgb(18,19,20,70%)", fontSize: "1.15em" }}
              className="mt-3"
            >
              <p className="m-0 p-0">Tindakan ini tidak bisa dibatalkan.</p>
              <p className="m-0 p-0">
                Semua data yang terkait dengan penitip tersebut akan hilang.
              </p>
            </p>
            <Row className="py-2 pt-3">
              <Col sm>
                <Button
                  style={{ backgroundColor: "#FF5B19", border: "none" }}
                  className="mx-2 w-100 p-1"
                  onClick={() => {
                    handleCloseDelModal();
                    setSelectedPenitip(null);
                  }}
                  disabled={del.isPending}
                >
                  <h5 className="mt-2">Batal</h5>
                </Button>
              </Col>
              <Col sm>
                {/* Khusus delete panggil langsng onSubmit()*/} 
                <Button
                  style={{ backgroundColor: "#F48E28", border: "none" }}
                  className="mx-2 w-100 p-1"
                  onClick={() => onSubmit()}
                  disabled={del.isPending}
                >
                  <h5 className="mt-2">
                    {del.isPending ? "Loading..." : "Hapus"}
                  </h5>
                </Button>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>

        <Modal
          show={showPrintModal}
          onHide={handleClosePrintModal}
          centered
          style={{ border: "none" }}
          keyboard={false}
          backdrop="static"
        >
          <Form>
            <Modal.Body className="text-center p-4 m-2">
              <h5 style={{ fontWeight: "bold" }}>
                Print Laporan Bulanan Penitip
              </h5>
              <p
                style={{ color: "rgb(18,19,20,70%)", fontSize: "1em" }}
                className="mt-1"
              >
                Pilih bulan dan cetak laporan bulanan penitip
              </p>
              <Form.Group className="text-start mt-3">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Pilih Bulan
                </Form.Label>
                <Form.Control
                  style={{ border: "1px solid #808080" }}
                  type="month"
                  placeholder="Month YYYY"
                />
              </Form.Group>
              <Row className="py-2 pt-3 mt-4">
                <Col sm>
                  <Button
                    style={{ backgroundColor: "#FF5B19", border: "none" }}
                    className="w-100"
                    onClick={handleClosePrintModal}
                  >
                    Batal
                  </Button>
                </Col>
                <Col sm>
                  <Button
                    style={{ backgroundColor: "#F48E28", border: "none" }}
                    className="w-100"
                    type="submit"
                  >
                    Simpan
                  </Button>
                </Col>
              </Row>
            </Modal.Body>
          </Form>
        </Modal>

        <Modal
          show={showAddEditModal}
          centered
          style={{ border: "none" }}
          keyboard={false}
          backdrop="static"
        >
          <Form onSubmit={inputHelper.handleSubmit}>
            <Modal.Body className="text-center p-4 m-2">
              <h4 style={{ fontWeight: "bold" }}>
                {selectedPenitip ? "Edit Data Penitip" : "Tambah Data Penitip"}
              </h4>
              <p
                style={{ color: "rgb(18,19,20,70%)", fontSize: "1em" }}
                className="mt-1"
              >
                {selectedPenitip
                  ? "Pastikan data penitip yang Anda tambahkan benar"
                  : "Pastikan data penitip yang Anda ubahkan benar"}
              </p>
              <Form.Group className="text-start mt-3">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Nama
                </Form.Label>
                <Form.Control
                  style={{ border: "1px solid #808080" }}
                  type="text"
                  placeholder="Masukkan nama penitip"
                  name="nama"
                  value={formData.nama || selectedPenitip?.nama || ""}
                  onChange={inputHelper.handleInputChange}
                />
              </Form.Group>
              <Form.Group className="text-start mt-3">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Nomor Telepon
                </Form.Label>
                <Form.Control
                  style={{ border: "1px solid #808080" }}
                  type="text"
                  placeholder="Masukkan nomor telepon"
                  name="no_telp"
                  value={formData.no_telp || selectedPenitip?.no_telp || ""}
                  onChange={inputHelper.handleInputChange}
                />
              </Form.Group>
              <Row className="py-2 pt-3 mt-4">
                <Col sm>
                  <Button
                    style={{ backgroundColor: "#FF5B19", border: "none" }}
                    className="w-100"
                    onClick={() => {
                      handleCloseAddEditModal();
                      setTimeout(() => {
                        setSelectedPenitip(null);
                      }, 125);
                    }}
                    disabled={add.isPending || edit.isPending}
                  >
                    Batal
                  </Button>
                </Col>
                <Col sm>
                  <Button
                    style={{ backgroundColor: "#F48E28", border: "none" }}
                    className="w-100"
                    type="submit"
                    disabled={add.isPending || edit.isPending}
                  >
                    {add.isPending || edit.isPending ? "Loading..." : "Simpan"}
                  </Button>
                </Col>
              </Row>
            </Modal.Body>
          </Form>
        </Modal>
      </section>
    </>
  );
}
