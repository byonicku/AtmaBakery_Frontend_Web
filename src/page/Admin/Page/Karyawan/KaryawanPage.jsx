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
  // BsPrinterFill,
} from "react-icons/bs";

import "@/page/Admin/Page/css/Admin.css";

import OutlerHeader from "@/component/Admin/OutlerHeader";
import APIKaryawan from "@/api/APIKaryawan";
import NotFound from "@/component/Admin/NotFound";
import CustomPagination from "@/component/Admin/CustomPagination";

export default function KaryawanPage() {
  const [showDelModal, setShowDelModal] = useState(false);
  const [showPrintModal, setshowPrintModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedKaryawan, setSelectedKaryawan] = useState(null);

  const handleCloseDelModal = () => setShowDelModal(false);
  const handleShowDelModal = () => setShowDelModal(true);

  const handleCloseAddEditModal = () => setShowAddEditModal(false);
  const handleShowAddEditModal = () => setShowAddEditModal(true);

  const handleClosePrintModal = () => setshowPrintModal(false);
  // const handleShowPrintModal = () => setshowPrintModal(true);

  // Mode untuk CRD
  // create -> "add"
  // update -> "edit"
  // delete -> "delete"
  const [mode, setMode] = useState("add");

  // Fetch karyawan with pagination
  const [karyawan, setKaryawan] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState(null);

  const fetchKaryawan = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await APIKaryawan.getKaryawanByPage(page);
      setKaryawan(response.data);
      setLastPage(response.last_page);
    } catch (error) {
      // Handle ketika data terakhir di suatu page dihapus, jadi mundur ke page sebelumnya
      // Atau bakal di set ke array kosong kalo hapus semua data di page pertama
      if (page - 1 === 0 && error.response.status === 404) {
        setKaryawan([]);
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

  // Pas masuk load karyawan
  useEffect(() => {
    fetchKaryawan();
  }, [fetchKaryawan]);

  // CRUD Karyawan
  const [formData, setFormData] = useState({
    nama: "",
    no_telp: "",
    email: "",
    hire_date: new Date().toISOString().split("T")[0],
    gaji: 0,
    bonus: 0,
  });

  // Untuk validasi front-end (sebisa mungkin samain dengan backend ya)
  const validationSchema = {
    nama: {
      required: true,
      alias: "Nama Karyawan",
    },
    no_telp: {
      required: true,
      alias: "Nomor Telepon",
      minLength: 10,
      maxLength: 13,
      pattern: /^(?:\+?08)(?:\d{2,3})?[ -]?\d{3,4}[ -]?\d{4}$/,
    },
    email: {
      required: true,
      alias: "Nama Email",
      email: true,
    },
  };

  // Wajib dipanggil abis mutation / query
  const handleMutationSuccess = () => {
    setIsLoading(true);
    fetchKaryawan();
    setTimeout(() => {
      setSelectedKaryawan(null);
      setFormData({
        nama: "",
        no_telp: "",
        email: "",
        hire_date: new Date().toISOString().split("T")[0],
        gaji: 0,
        bonus: 0,
      });
      setSearch(null);
    }, 125);
  };

  // Add Data
  const add = useMutation({
    mutationFn: (data) => APIKaryawan.createKaryawan(data),
    onSuccess: async () => {
      toast.success("Tambah Karyawan berhasil!");
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
      APIKaryawan.updateKaryawan(data, selectedKaryawan.id_karyawan),
    onSuccess: async () => {
      toast.success("Edit Karyawan berhasil!");
      handleCloseAddEditModal();
      handleMutationSuccess();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  // Delete Data
  const del = useMutation({
    mutationFn: (id) => APIKaryawan.deleteKaryawan(id),
    onSuccess: async () => {
      toast.success("Hapus Karyawan berhasil!");
      handleCloseDelModal();
      handleMutationSuccess();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = async (formData) => {
    if (isLoading) return;

    if (parseFloat(formData?.gaji) < 0) {
      toast.error("Gaji tidak boleh negatif!");
      return;
    }

    if (parseFloat(formData?.bonus) < 0) {
      toast.error("Bonus tidak boleh negatif!");
      return;
    }

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
        await del.mutateAsync(selectedKaryawan.id_karyawan);
        return;
      }
    } catch (error) {
      toast.error(
        error.data.message ||
          error.message ||
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
  const fetchKaryawanSearch = async () => {
    if (search.trim() === "") {
      // Kalo spasi doang bakal gabisa
      return;
    }

    setIsLoading(true);

    try {
      const response = await APIKaryawan.searchKaryawan(search.trim());
      setKaryawan(response);
    } catch (error) {
      setKaryawan([]); // Kalo error / tidak ditemukan set karyawan jadi array kosong
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <OutlerHeader
        title="Kelola Data Karyawan"
        desc="Lakukan pengelolaan data karyawan Atma Bakery"
        breadcrumb="Karyawan"
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
                  email: "",
                  hire_date: new Date().toISOString().split("T")[0],
                  gaji: 0,
                  bonus: 0,
                });
              }}
              disabled={isLoading}
              className="me-2 me-lg-1 mb-2 mb-lg-1 mb-md-2 mb-sm-2"
            >
              <BsPlusSquare className="mb-1 me-2" />
              Tambah Data
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
                placeholder="Cari Karyawan disini"
                name="search"
                value={search || ""}
                disabled={isLoading}
                onChange={(e) => {
                  if (e.target.value === "") {
                    if (page !== 1) {
                      setPage(1);
                    } else {
                      fetchKaryawan();
                    }
                  }
                  setSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchKaryawanSearch();
                  }
                }}
              />
              <Button
                variant="secondary"
                disabled={isLoading}
                onClick={() => fetchKaryawanSearch()}
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
        ) : karyawan?.length > 0 ? (
          <>
            <Table responsive striped>
              <thead>
                <tr>
                  <th style={{ width: "14%" }} className="th-style">
                    Nama
                  </th>
                  <th style={{ width: "14%" }} className="th-style">
                    Nomor Telepon
                  </th>
                  <th style={{ width: "14%" }} className="th-style">
                    Email
                  </th>
                  <th style={{ width: "14%" }} className="th-style">
                    Gaji
                  </th>
                  <th style={{ width: "14%" }} className="th-style">
                    Bonus
                  </th>
                  <th style={{ width: "30%" }} className="th-style">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {karyawan.map((karyawan, index) => (
                  <tr key={index}>
                    <td>{karyawan.nama}</td>
                    <td>{karyawan.no_telp}</td>
                    <td>{karyawan.email}</td>
                    <td>
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(karyawan.gaji)}
                    </td>
                    <td>
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(karyawan.bonus)}
                    </td>
                    <td>
                      <Row className="gap-1 gap-lg-0 gap-md-1">
                        <Col xs={12} sm={12} md={12} lg={6}>
                          <Button
                            variant="primary"
                            className="w-100"
                            onClick={() => {
                              setSelectedKaryawan(karyawan);
                              setMode("edit");
                              setFormData({
                                nama: karyawan.nama,
                                no_telp: karyawan.no_telp,
                                email: karyawan.email,
                                hire_date: karyawan.hire_date,
                                gaji: karyawan.gaji,
                                bonus: karyawan.bonus,
                              });
                              handleShowAddEditModal();
                            }}
                          >
                            <BsPencilSquare className="mb-1" /> Ubah
                          </Button>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={6}>
                          <Button
                            variant="danger"
                            className="custom-danger-btn w-100"
                            onClick={() => {
                              setSelectedKaryawan(karyawan);
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
              search ? "Karyawan Tidak Ditemukan" : "Belum Ada Karyawan Disini"
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
            setSelectedKaryawan(null);
            setMode("add");
          }}
          centered
          size="lg"
          keyboard={false}
          backdrop="static"
        >
          <Modal.Body className="text-center p-5">
            <h3 style={{ fontWeight: "bold" }}>
              Anda Yakin Ingin Menghapus Data Karyawan Ini?
            </h3>
            <p
              style={{ color: "rgb(18,19,20,70%)", fontSize: "1.15em" }}
              className="mt-3"
            >
              <p className="m-0 p-0">Tindakan ini tidak bisa dibatalkan.</p>
              <p className="m-0 p-0">
                Semua data yang terkait dengan karyawan tersebut akan hilang.
              </p>
            </p>
            <Row className="pt-3 gap-2 gap-lg-0 gap-md-0">
              <Col xs={12} sm={12} md={6} lg={6}>
                <Button
                  variant="danger"
                  className="custom-agree-btn w-100 p-1"
                  onClick={() => onSubmit()}
                  disabled={del.isPending}
                >
                  <h5 className="mt-2">
                    {del.isPending ? "Loading..." : "Hapus"}
                  </h5>
                </Button>
              </Col>
              <Col xs={12} sm={12} md={6} lg={6}>
                <Button
                  variant="danger"
                  className="custom-danger-btn w-100 p-1"
                  onClick={() => {
                    handleCloseDelModal();
                    setSelectedKaryawan(null);
                  }}
                  disabled={del.isPending}
                >
                  <h5 className="mt-2">Batal</h5>
                </Button>
                {/* Khusus delete panggil langsng onSubmit()*/}
              </Col>
            </Row>
          </Modal.Body>
        </Modal>

        <Modal
          show={showPrintModal}
          onHide={handleClosePrintModal}
          centered
          keyboard={false}
          backdrop="static"
        >
          <Form>
            <Modal.Body className="text-center p-4 m-2">
              <Row className="pt-3 gap-2 gap-lg-0 gap-md-0">
                <Col xs={12} sm={12} md={6} lg={6}>
                  <Button
                    variant="danger"
                    className="custom-agree-btn w-100"
                    type="submit"
                  >
                    Simpan
                  </Button>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6}>
                  <Button
                    variant="danger"
                    className="custom-danger-btn w-100"
                    onClick={handleClosePrintModal}
                  >
                    Batal
                  </Button>
                </Col>
              </Row>
            </Modal.Body>
          </Form>
        </Modal>

        <Modal
          show={showAddEditModal}
          centered
          keyboard={false}
          backdrop="static"
        >
          <Form onSubmit={inputHelper.handleSubmit}>
            <Modal.Body className="text-center p-4 m-2">
              <h4 style={{ fontWeight: "bold" }}>
                {selectedKaryawan
                  ? "Edit Data Karyawan"
                  : "Tambah Data Karyawan"}
              </h4>
              <p
                style={{ color: "rgb(18,19,20,70%)", fontSize: "1em" }}
                className="mt-1"
              >
                {selectedKaryawan
                  ? "Pastikan data karyawan yang Anda tambahkan benar"
                  : "Pastikan data karyawan yang Anda ubahkan benar"}
              </p>
              <Form.Group className="text-start mt-3">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Nama
                </Form.Label>
                <Form.Control
                  style={{ border: "1px solid #808080" }}
                  type="text"
                  placeholder="Masukkan nama karyawan"
                  name="nama"
                  value={formData.nama || selectedKaryawan?.nama || ""}
                  onChange={inputHelper.handleInputChange}
                  disabled={edit.isPending || add.isPending}
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
                  value={formData.no_telp || selectedKaryawan?.no_telp || ""}
                  onChange={inputHelper.handleInputChange}
                  disabled={edit.isPending || add.isPending}
                />
              </Form.Group>
              <Form.Group className="text-start mt-3">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Email
                </Form.Label>
                <Form.Control
                  style={{ border: "1px solid #808080" }}
                  type="email"
                  placeholder="Masukkan email"
                  name="email"
                  value={formData.email || selectedKaryawan?.karyawan || ""}
                  onChange={inputHelper.handleInputChange}
                  disabled={edit.isPending || add.isPending}
                />
              </Form.Group>
              <Row className="pt-3 gap-2 gap-lg-0 gap-md-0">
                <Col xs={12} sm={12} md={6} lg={6}>
                  <Button
                    variant="danger"
                    className="custom-agree-btn w-100"
                    type="submit"
                    disabled={add.isPending || edit.isPending}
                  >
                    {add.isPending || edit.isPending ? "Loading..." : "Simpan"}
                  </Button>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6}>
                  <Button
                    variant="danger"
                    className="custom-danger-btn w-100"
                    onClick={() => {
                      handleCloseAddEditModal();
                      setTimeout(() => {
                        setSelectedKaryawan(null);
                      }, 125);
                    }}
                    disabled={add.isPending || edit.isPending}
                  >
                    Batal
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
