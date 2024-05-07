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
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import InputHelper from "@/page/InputHelper";
import {
  BsSearch,
  BsPlusSquare,
  BsPencilSquare,
  BsFillTrash3Fill,
  BsCash,
  // BsPrinterFill,
} from "react-icons/bs";

import "@/page/Admin/Page/css/Admin.css";

import OutlerHeader from "@/component/Admin/OutlerHeader";
import APIKaryawan from "@/api/APIKaryawan";
import NotFound from "@/component/Admin/NotFound";
import CustomPagination from "@/component/Admin/Pagination/CustomPagination";
import ConfrmationModal from "@/component/Admin/Modal/ConfirmationModal";
import PrintModal from "@/component/Admin/Modal/PrintModal";
import AddEditModal from "@/component/Admin/Modal/AddEditModal";
import { FaArrowCircleLeft } from "react-icons/fa";

export default function KaryawanPage() {
  const [userRole, setUserRole] = useState("");
  const [showDelModal, setShowDelModal] = useState(false);
  const [showPrintModal, setshowPrintModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingModal, setIsLoadingModal] = useState(true);
  const [karyawanOptions, setKaryawanOptions] = useState([]);
  const [selectedKaryawan, setSelectedKaryawan] = useState(null);
  const [selectedIdKaryawan, setSelectedIdKaryawan] = useState(null);

  const handleCloseDelModal = () => setShowDelModal(false);
  const handleShowDelModal = () => setShowDelModal(true);

  const handleCloseAddEditModal = () => setShowAddEditModal(false);
  const handleShowAddEditModal = () => setShowAddEditModal(true);

  const handleClosePrintModal = () => setshowPrintModal(false);
  // const handleShowPrintModal = () => setshowPrintModal(true);

  const handleCloseRestoreModal = () => setShowRestoreModal(false);
  const handleShowRestoreModal = () => setShowRestoreModal(true);

  // Mode untuk CRD
  // create -> "add"
  // update -> "edit"
  // delete -> "delete"
  const [mode, setMode] = useState("add");

  // Fetch karyawan with pagination
  const [karyawan, setKaryawan] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const role = sessionStorage.getItem("role") || "";
    setUserRole(role);
  }, []);

  const fetchKaryawan = useCallback(
    async (signal) => {
      setIsLoading(true);
      try {
        const response = await APIKaryawan.getKaryawanByPage(page, signal);
        setKaryawan(response.data);
        setLastPage(response.last_page);
      } catch (error) {
        // Handle ketika data terakhir di suatu page dihapus, jadi mundur ke page sebelumnya
        // Atau bakal di set ke array kosong kalo hapus semua data di page pertama
        if (page - 1 === 0 || error.code === "ERR_NETWORK") {
          setKaryawan([]);
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

  const fetchTrashedKaryawan = useCallback(async () => {
    setIsLoadingModal(true);
    try {
      const response = await APIKaryawan.getAllTrashedKaryawan();
      setKaryawanOptions(response);
    } catch (error) {
      setKaryawanOptions([]);
      console.error(error);
    } finally {
      setIsLoadingModal(false);
    }
  }, []);

  const handleChangePage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  // Pas masuk load karyawan
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetchKaryawan(signal);

    return () => {
      abortController.abort();
    };
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

  const restore = useMutation({
    mutationFn: (id) => APIKaryawan.restoreKaryawan(id),
    onSuccess: async () => {
      toast.success("Restore Karyawan berhasil!");
      handleCloseRestoreModal();
      handleMutationSuccess();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  function validate() {
    if (mode === "add" || mode === "edit") {
      if (parseFloat(formData?.gaji) < 0) {
        toast.error("Gaji tidak boleh negatif!");
        return 0;
      }

      if (parseFloat(formData?.bonus) < 0) {
        toast.error("Bonus tidak boleh negatif!");
        return 0;
      }
    }

    if (mode === "restore") {
      if (!selectedIdKaryawan) {
        toast.error("Karyawan tidak ditemukan!");
        return 0;
      }
    }

    return 1;
  }

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
        await del.mutateAsync(selectedKaryawan.id_karyawan);
        return;
      }

      if (mode === "restore") {
        await restore.mutateAsync(selectedIdKaryawan);
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
            {userRole === "MO" && (
              <>
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
                <Button
                  variant="primary"
                  onClick={() => {
                    handleShowRestoreModal();
                    setMode("restore");
                    setSelectedIdKaryawan(null);
                  }}
                  disabled={
                    isLoading ||
                    add.isPending ||
                    edit.isPending ||
                    del.isPending
                  }
                  className="me-2 me-lg-1 mb-2 mb-lg-1 mb-md-2 mb-sm-2"
                >
                  <FaArrowCircleLeft className="mb-1 me-2" />
                  Restore Data
                </Button>
              </>
            )}
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
                  if (e.key === "Enter" && search) {
                    fetchKaryawanSearch();
                  }
                }}
              />
              <Button
                variant="secondary"
                disabled={isLoading}
                onClick={fetchKaryawanSearch}
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
                        {userRole === "MO" && (
                          <>
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
                          </>
                        )}
                        {userRole === "OWN" && (
                          <Col xs={12} sm={12} md={12} lg={12}>
                            <Button
                              variant="success"
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
                              <BsCash className="mb-1" /> Ubah Gaji / Bonus
                            </Button>
                          </Col>
                        )}
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
        <PrintModal
          show={showPrintModal}
          onHide={handleClosePrintModal}
          title="Print Data Karyawan"
          text="Pastikan data karyawan yang Anda print benar"
          onSubmit={onSubmit}
        ></PrintModal>

        <AddEditModal
          show={showAddEditModal}
          onHide={() => {
            handleCloseAddEditModal();
            setTimeout(() => {
              setSelectedKaryawan(null);
            }, 125);
          }}
          title={
            userRole === "MO" && selectedKaryawan
              ? "Edit Data Karyawan"
              : userRole === "OWN" && selectedKaryawan
              ? "Edit Data Gaji atau Bonus Karyawan"
              : "Tambah Data Karyawan"
          }
          text={
            userRole === "MO" && selectedKaryawan
              ? "Pastikan data karyawan yang Anda ubah benar"
              : userRole === "OWN" && selectedKaryawan
              ? "Pastikan data gaji atau bonus karyawan yang Anda ubah benar"
              : "Pastikan data karyawan yang Anda tambah benar"
          }
          onSubmit={inputHelper.handleSubmit}
          add={add}
          edit={edit}
          isLoadingModal={isLoading}
          validate={validate}
        >
          {userRole === "MO" && (
            <>
              <Form.Group className="text-start mt-3">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Nama
                </Form.Label>
                <Form.Control
                  style={{ border: "1px solid #808080" }}
                  type="text"
                  placeholder="Masukkan nama karyawan"
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
              <Form.Group className="text-start mt-3">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Email
                </Form.Label>
                <Form.Control
                  style={{ border: "1px solid #808080" }}
                  type="email"
                  placeholder="Masukkan email"
                  name="email"
                  value={formData.email}
                  onChange={inputHelper.handleInputChange}
                  disabled={edit.isPending || add.isPending}
                  required
                />
              </Form.Group>
            </>
          )}
          {userRole === "OWN" && (
            <>
              <Form.Group className="text-start mt-3">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Gaji
                </Form.Label>
                <Form.Control
                  style={{ border: "1px solid #808080" }}
                  type="number"
                  placeholder="Masukkan gaji"
                  name="gaji"
                  value={formData.gaji}
                  onChange={inputHelper.handleInputChange}
                  disabled={edit.isPending || add.isPending}
                  required
                />
              </Form.Group>
              <Form.Group className="text-start mt-3">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Bonus
                </Form.Label>
                <Form.Control
                  style={{ border: "1px solid #808080" }}
                  type="number"
                  placeholder="Masukkan bonus"
                  name="bonus"
                  value={formData.bonus}
                  onChange={inputHelper.handleInputChange}
                  disabled={edit.isPending || add.isPending}
                  required
                />
              </Form.Group>
            </>
          )}
        </AddEditModal>

        <AddEditModal
          show={showRestoreModal}
          onHide={() => {
            handleCloseRestoreModal();
            setTimeout(() => {
              setSelectedIdKaryawan(null);
            }, 125);
          }}
          title="Restore Data Karyawan"
          text="Pastikan data karyawan yang Anda restore benar"
          onEnter={async () => {
            await fetchTrashedKaryawan();
          }}
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          add={restore}
          isLoadingModal={isLoadingModal}
          validate={validate}
        >
          <Form.Group className="text-start mt-3" controlId="formNamaBahanBaku">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Nama Bahan Baku
            </Form.Label>
            <Form.Select
              style={{ border: "1px solid #808080" }}
              name="id_bahan_baku"
              onChange={(e) => {
                setSelectedIdKaryawan(e.target.value);
              }}
              disabled={
                restore.isPending ||
                isLoadingModal ||
                karyawanOptions?.length === 0
              }
              required
            >
              <option value="" disabled selected hidden>
                {isLoadingModal
                  ? "Loading..."
                  : karyawanOptions?.length > 0
                  ? "Pilih Karyawan yang akan direstore"
                  : "Tidak ada data karyawan yang bisa direstore"}
              </option>
              {karyawanOptions?.map((option) => (
                <option key={option.id_karyawan} value={option.id_karyawan}>
                  {option.nama}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </AddEditModal>

        <ConfrmationModal
          header="Anda Yakin Ingin Menghapus Data Karyawan Ini?"
          secondP="Semua data yang terkait dengan karyawan tersebut akan hilang."
          show={showDelModal}
          onCancel={() => {
            handleCloseDelModal();
            setSelectedKaryawan(null);
          }}
          onSubmit={onSubmit}
          del={del}
        />
      </section>
    </>
  );
}
