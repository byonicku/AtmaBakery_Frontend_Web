import {
  Button,
  Col,
  Row,
  Table,
  Spinner,
  InputGroup,
  Form,
} from "react-bootstrap";
import { useState, useEffect, useCallback } from "react";

import {
  BsFillTrash3Fill,
  BsPencilSquare,
  BsPlusSquare,
  BsSearch,
} from "react-icons/bs";

import "@/page/Admin/Page/css/Admin.css";

import InputHelper from "@/page/InputHelper";
import OutlerHeader from "@/component/Admin/OutlerHeader";
import NotFound from "@/component/Admin/NotFound";
import CustomPagination from "@/component/Admin/Pagination/CustomPagination";
import APIAlamat from "@/api/APIAlamat";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import ConfrmationModal from "@/component/Admin/Modal/ConfirmationModal";
import AddEditModal from "@/component/Admin/Modal/AddEditModal";

export default function AlamatPemesananPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlamat, setSelectedAlamat] = useState(null);
  const [mode, setMode] = useState(null);

  const [alamat, setAlamat] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDelModal, setDelShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleDelCloseModal = () => setDelShowModal(false);
  const handleDelShowModal = () => setDelShowModal(true);

  const fetchAlamat = useCallback(
    async (signal) => {
      setIsLoading(true);
      try {
        const response = await APIAlamat.getAlamatSelfByPage(page, signal);
        setAlamat(response.data);
        setLastPage(response.last_page);
      } catch (error) {
        // Handle ketika data terakhir di suatu page dihapus, jadi mundur ke page sebelumnya
        // Atau bakal di set ke array kosong kalo hapus semua data di page pertama
        if (page - 1 === 0 || error.code === "ERR_NETWORK") {
          setAlamat([]);
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

    fetchAlamat(signal);

    return () => {
      abortController.abort();
    };
  }, [fetchAlamat]);

  const fetchAlamatSearch = async () => {
    if (search.trim() === "") {
      return;
    }

    setIsLoading(true);
    try {
      const response = await APIAlamat.searchAlamatSelf(search);
      setAlamat(response);
    } catch (error) {
      setAlamat([]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Wajib dipanggil abis mutation / query
  const handleMutationSuccess = () => {
    setIsLoading(true);
    fetchAlamat();
    setTimeout(() => {
      setSelectedAlamat(null);
      setFormData({
        nama_lengkap: "",
        no_telp: "",
        lokasi: "",
        keterangan: "",
      });
      setSearch(null);
    }, 125);
  };

  const [formData, setFormData] = useState({
    nama_lengkap: "",
    no_telp: "",
    lokasi: "",
    keterangan: "",
  });

  const validationSchema = {
    nama_lengkap: {
      required: true,
      alias: "Nama Lengkap",
    },
    no_telp: {
      required: true,
      alias: "Nomor Telepon",
      minLength: 10,
      maxLength: 13,
      pattern: /^(?:\+?08)(?:\d{2,3})?[ -]?\d{3,4}[ -]?\d{4}$/,
    },
    lokasi: {
      required: true,
      alias: "Alamat",
    },
    keterangan: {
      required: false,
      alias: "Keterangan",
    },
  };

  // Add Data
  const add = useMutation({
    mutationFn: (data) => APIAlamat.createAlamatSelf(data),
    onSuccess: async () => {
      toast.success("Tambah Alamat berhasil!");
      handleCloseModal();
      handleMutationSuccess();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  // Edit Data
  const edit = useMutation({
    mutationFn: (data) =>
      APIAlamat.updateAlamatSelf(data, selectedAlamat.id_alamat),
    onSuccess: async () => {
      toast.success("Edit Alamat berhasil!");
      handleCloseModal();
      handleMutationSuccess();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  // Delete Data
  const del = useMutation({
    mutationFn: (id) => APIAlamat.deleteAlamat(id),
    onSuccess: async () => {
      toast.success("Hapus Alamat berhasil!");
      handleDelCloseModal();
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
        await del.mutateAsync(selectedAlamat.id_alamat);
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

  return (
    <>
      <OutlerHeader
        title="Kelola Data Alamat Customer"
        desc="Lakukan pengelolaan data alamat Atma Bakery"
        breadcrumb="Alamat Customer"
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
                setMode("add");
                setFormData({
                  nama_lengkap: "",
                  no_telp: "",
                  lokasi: "",
                  keterangan: "",
                });
                handleShowModal();
              }}
            >
              <BsPlusSquare className="mb-1 me-2" /> Tambah Alamat
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
                placeholder="Cari Alamat disini"
                name="search"
                value={search || ""}
                disabled={isLoading}
                onChange={(e) => {
                  if (e.target.value === "") {
                    if (page !== 1) {
                      setPage(1);
                    } else {
                      fetchAlamat();
                    }
                  }
                  setSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && search) {
                    fetchAlamatSearch();
                  }
                }}
              />
              <Button
                variant="secondary"
                disabled={isLoading}
                onClick={fetchAlamatSearch}
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
        ) : alamat?.length > 0 ? (
          <>
            <Table responsive striped>
              <thead>
                <tr>
                  <th style={{ width: "20%" }} className="th-style">
                    Nama Lengkap Penerima
                  </th>
                  <th style={{ width: "15%" }} className="th-style">
                    Nomor Telepon
                  </th>
                  <th style={{ width: "20%" }} className="th-style">
                    Alamat
                  </th>
                  <th style={{ width: "15%" }} className="th-style">
                    Keterangan
                  </th>
                  <th style={{ width: "30%" }} className="th-style">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {alamat.map((alamat, index) => (
                  <tr key={index}>
                    <td>{alamat.nama_lengkap}</td>
                    <td>{alamat.no_telp}</td>
                    <td>{alamat.lokasi}</td>
                    <td>{alamat.keterangan ? alamat.keterangan : "-"}</td>
                    <td>
                      <Row className="gap-1 gap-lg-0 gap-md-0">
                        <Col xs={12} sm={12} md={12} lg={6}>
                          <Button
                            variant="primary"
                            className="w-100"
                            onClick={() => {
                              setSelectedAlamat(alamat);
                              setMode("edit");
                              setFormData({
                                nama_lengkap: alamat.nama_lengkap,
                                no_telp: alamat.no_telp,
                                lokasi: alamat.lokasi,
                                keterangan: alamat.keterangan,
                              });
                              handleShowModal();
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
                              setSelectedAlamat(alamat);
                              setMode("delete");
                              handleDelShowModal();
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
            text={search ? "Alamat Tidak Ditemukan" : "Belum Ada Alamat Disini"}
          />
        )}

        <AddEditModal
          show={showModal}
          onHide={() => {
            handleCloseModal();
            setTimeout(() => {
              selectedAlamat(null);
            }, 125);
          }}
          size="lg"
          title={selectedAlamat ? "Edit Alamat" : "Tambah Alamat"}
          text={
            selectedAlamat
              ? "Pastikan alamat yang Anda ubahkan benar"
              : "Pastikan alamat yang Anda tambahkan benar"
          }
          onSubmit={inputHelper.handleSubmit}
          add={add}
          edit={edit}
          isLoadingModal={isLoading}
        >
          <Form.Group className="text-start mt-3">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Nama Lengkap Penerima
            </Form.Label>
            <Form.Control
              style={{ border: "1px solid #808080" }}
              type="text"
              placeholder="Masukkan nama lengkap penerima"
              name="nama_lengkap"
              value={formData.nama_lengkap}
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
              Alamat
            </Form.Label>
            <Form.Control
              as={"textarea"}
              rows={4}
              style={{ border: "1px solid #808080", resize: "none" }}
              type="text"
              placeholder="Masukkan alamat"
              name="lokasi"
              value={formData.lokasi}
              onChange={inputHelper.handleInputChange}
              disabled={edit.isPending || add.isPending}
              required
            />
          </Form.Group>
          <Form.Group className="text-start mt-3">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Keterangan
            </Form.Label>
            <Form.Control
              as={"textarea"}
              rows={4}
              style={{ border: "1px solid #808080", resize: "none" }}
              type="text"
              placeholder="Masukkan keterangan"
              name="keterangan"
              value={formData.keterangan}
              onChange={inputHelper.handleInputChange}
              disabled={edit.isPending || add.isPending}
              required
            />
          </Form.Group>
        </AddEditModal>

        <ConfrmationModal
          header="Anda Yakin Ingin Menghapus Alamat Ini?"
          secondP="Semua data yang terkait dengan alamat tersebut akan hilang."
          show={showDelModal}
          onCancel={() => {
            handleDelCloseModal();
            setSelectedAlamat(null);
          }}
          onSubmit={onSubmit}
          del={del}
        />
      </section>
    </>
  );
}
