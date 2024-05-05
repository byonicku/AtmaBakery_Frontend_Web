import {
  Button,
  Col,
  Row,
  Form,
  Table,
  InputGroup,
  Spinner,
} from "react-bootstrap";

import React, { useState, useEffect, useCallback } from "react";
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

import NotFound from "@/component/Admin/NotFound";
import CustomPagination from "@/component/Admin/Pagination/CustomPagination";
import OutlerHeader from "@/component/Admin/OutlerHeader";
import APIResep from "@/api/APIResep";
import APIBahanBaku from "@/api/APIBahanBaku";
import DeleteConfirmationModal from "@/component/Admin/Modal/DeleteConfirmationModal";
import AddEditModal from "@/component/Admin/Modal/AddEditModal";

export default function ResepPage() {
  const [showDelModal, setShowDelModal] = useState(false);
  // const [showPrintModal, setshowPrintModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingModal, setIsLoadingModal] = useState(false);

  const handleCloseDelModal = () => setShowDelModal(false);
  // const handleShowDelModal = () => setShowDelModal(true);

  const handleCloseAddEditModal = () => setShowAddEditModal(false);
  // const handleShowAddEditModal = () => setShowAddEditModal(true);

  // const handleClosePrintModal = () => setshowPrintModal(false);

  const [mode, setMode] = useState("add");

  const [resep, setResep] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");

  const [selectedProduk, setSelectedProduk] = useState(null);
  const [selectedAllBahanBaku, setSelectedAllBahanBaku] = useState(null);
  const [selectedResep, setSelectedResep] = useState(null);
  const [selectedSatuan, setSelectedSatuan] = useState(null);

  const [bahanBakuOptions, setBahanBakuOptions] = useState([]);
  const [deleteResep, setDeleteResep] = useState(null);

  const fetchResep = useCallback(
    async (signal) => {
      try {
        setIsLoading(true);
        const response = await APIResep.getProdukByPage(page, signal);

        setResep(response.data);
        setLastPage(response.last_page);
      } catch (error) {
        // Handle ketika data terakhir di suatu page dihapus, jadi mundur ke page sebelumnya
        // Atau bakal di set ke array kosong kalo hapus semua data di page pertama
        if (page - 1 === 0 || error.code === "ERR_NETWORK") {
          setResep([]);
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

  const fetchDataBahanBaku = useCallback(
    async (selectedAllBahanBaku, selectedResep) => {
      const abortController = new AbortController();
      const signal = abortController.signal;
      try {
        setIsLoadingModal(true);
        const bahanBakuResponse = await APIBahanBaku.getAllBahanBaku(signal);

        if (selectedAllBahanBaku) {
          const selectedBahanBaku = selectedAllBahanBaku.map(
            (item) => item.id_bahan_baku
          );
          console.log(bahanBakuResponse);
          const filteredBahanBaku = bahanBakuResponse.filter(
            (item) => !selectedBahanBaku.includes(item.id_bahan_baku)
          );

          if (selectedResep) {
            filteredBahanBaku.unshift(selectedResep.bahan_baku);
          }

          setBahanBakuOptions(filteredBahanBaku);
        } else {
          setBahanBakuOptions(bahanBakuResponse);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingModal(false);
      }

      return () => {
        abortController.abort();
      };
    },
    []
  );

  const handleChangePage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetchResep(signal);

    return () => {
      abortController.abort();
    };
  }, [fetchResep]);

  const [formData, setFormData] = useState({
    id_resep: "",
    id_produk: "",
    id_bahan_baku: "",
    kuantitas: "",
    satuan: "",
  });

  const validationSchema = {
    id_produk: {
      required: true,
      alias: "Produk",
    },
    id_bahan_baku: {
      required: true,
      alias: "Bahan Baku",
    },
    kuantitas: {
      required: true,
      alias: "Kuantitas",
    },
    satuan: {
      required: false,
      alias: "Satuan",
    },
  };

  const handleCloseDeleteModal = () => {
    setShowDelModal(false);
    setTimeout(() => {
      setDeleteResep(null);
    }, 125);
  };

  // Wajib dipanggil abis mutation / query
  const handleMutationSuccess = () => {
    setIsLoading(true);
    fetchResep();
    setSelectedResep(null);
    setSelectedSatuan(null);
    setTimeout(() => {
      setSelectedProduk(null);
      setFormData({
        id_resep: "",
        id_produk: "",
        id_bahan_baku: "",
        kuantitas: "",
        satuan: "",
      });
      setSearch(null);
    }, 125);
  };

  // Add Data
  const add = useMutation({
    mutationFn: (data) => APIResep.createResep(data),
    onSuccess: async () => {
      toast.success("Tambah Resep berhasil!");
      handleCloseAddEditModal();
      handleMutationSuccess();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const edit = useMutation({
    mutationFn: (data) => APIResep.updateBahanBakuInResep(data),
    onSuccess: async () => {
      toast.success("Edit Resep berhasil!");
      handleCloseAddEditModal();
      handleMutationSuccess();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const del = useMutation({
    mutationFn: (data) => APIResep.deleteBahanBakuFromResep(data),
    onSuccess: async () => {
      toast.success("Hapus Resep berhasil!");
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
        if (parseInt(formData?.kuantitas) < 0) {
          toast.error("Kuantitas boleh negatif!");
          return;
        }

        const data = {
          id_produk: selectedProduk.id_produk,
          id_bahan_baku: formData.id_bahan_baku,
          kuantitas: formData.kuantitas,
          satuan: selectedSatuan.satuan,
        };

        await add.mutateAsync(data);
        return;
      }

      if (mode === "edit") {
        const data = {
          id_resep: formData.id_resep,
          id_produk: formData.id_produk,
          id_bahan_baku: formData.id_bahan_baku,
          kuantitas: formData.kuantitas,
          satuan: selectedSatuan.satuan,
        };

        await edit.mutateAsync(data);
        return;
      }

      if (mode === "delete") {
        await del.mutateAsync(deleteResep);
        return;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const inputHelper = new InputHelper(
    formData,
    setFormData,
    validationSchema,
    onSubmit
  );

  const fetchResepSearch = async () => {
    if (search.trim() === "") {
      // Kalo spasi doang bakal gabisa
      return;
    }

    setIsLoading(true);

    try {
      const response = await APIResep.searchResep(search.trim());
      setResep(response);
    } catch (error) {
      setResep([]); // Kalo error / tidak ditemukan set resep jadi array kosong
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddResepClick = (produk) => {
    setMode("add");
    setSelectedProduk(produk);
    setSelectedAllBahanBaku(produk.resep);
    setFormData({
      ...formData,
      id_produk: produk.id_produk,
      nama_produk: produk.nama_produk,
    });
    setShowAddEditModal(true);
  };

  const handleEditResepClick = (resep, produk) => {
    setSelectedResep(resep);
    setMode("edit");
    setSelectedSatuan(resep);
    setFormData({
      ...formData,
      id_resep: resep.id_resep,
      id_produk: resep.id_produk,
      id_bahan_baku: resep.id_bahan_baku,
      kuantitas: resep.kuantitas,
      satuan: resep.satuan,
      nama_produk: produk.nama_produk,
    });
    setShowAddEditModal(true);
  };

  const handleDeleteResepClick = (resep) => {
    setMode("delete");
    setDeleteResep(resep);
    setShowDelModal(true);
  };

  return (
    <>
      <OutlerHeader
        title="Kelola Data Resep Produk"
        desc="Lakukan pengelolaan data resep produk Atma Bakery"
        breadcrumb="Resep"
      />

      <section className="content px-3">
        <Row className="pb-3 gap-1 gap-lg-0 gap-md-0">
          <Col
            xs={12}
            sm={12}
            lg={6}
            md={12}
            className="m-0 mb-lg-0 mb-md-0 mb-sm-0 mb-1"
          />
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
                placeholder="Cari Resep disini"
                name="search"
                value={search || ""}
                disabled={isLoading}
                onChange={(e) => {
                  if (e.target.value === "") {
                    if (page !== 1) {
                      setPage(1);
                    } else {
                      fetchResep();
                    }
                  }

                  setSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchResepSearch();
                  }
                }}
              />
              <Button
                variant="secondary"
                disabled={isLoading}
                onClick={fetchResepSearch}
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
        ) : resep?.length > 0 ? (
          <>
            <Table bordered responsive className="prevent-select">
              <thead>
                <tr>
                  <th style={{ width: "20%" }} className="th-style">
                    Nama Produk
                  </th>
                  <th style={{ width: "20%" }} className="th-style">
                    Nama Bahan Baku
                  </th>
                  <th style={{ width: "15%" }} className="th-style">
                    Kuantitas
                  </th>
                  <th style={{ width: "15%" }} className="th-style">
                    Satuan
                  </th>
                  <th style={{ width: "30%" }} className="th-style">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {resep.map((produk) => (
                  <React.Fragment key={produk.id_produk}>
                    {produk.resep.map((item, index) => (
                      <tr key={item.id_bahan_baku}>
                        {index === 0 && (
                          <td rowSpan={produk.resep.length + 1}>
                            {produk?.id_kategori === "CK"
                              ? produk?.nama_produk +
                                " " +
                                produk?.ukuran +
                                " Loyang"
                              : produk?.nama_produk}
                          </td>
                        )}
                        <td>{item.bahan_baku.nama_bahan_baku}</td>
                        <td>{item.kuantitas}</td>
                        <td>{item.satuan}</td>
                        <td>
                          <Row className="gap-1 gap-lg-0 gap-md-0">
                            <Col xs={12} sm={12} md={6} lg={6}>
                              <Button
                                variant="primary"
                                className="w-100"
                                onClick={() => {
                                  setMode("edit");
                                  setSelectedProduk(produk);
                                  setSelectedAllBahanBaku(produk.resep);
                                  handleEditResepClick(item, produk);
                                }}
                              >
                                <BsPencilSquare className="mb-1" /> Ubah
                              </Button>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6}>
                              <Button
                                variant="danger"
                                className="custom-danger-btn w-100"
                                onClick={(event) => {
                                  handleDeleteResepClick(item.id_resep, event);
                                }}
                              >
                                <BsFillTrash3Fill className="mb-1" /> Hapus
                              </Button>
                            </Col>
                          </Row>
                        </td>
                      </tr>
                    ))}
                    {/* Baris tambahan untuk tambah bahan */}
                    <tr>
                      {produk.resep.length == 0 && produk.id_penitip == null ? (
                        <>
                          <td>{produk.nama_produk}</td>
                          <td>
                            <p className="opacity-50">Tambah Resep</p>
                          </td>
                          <td>
                            <p className="opacity-50">Tambah Resep</p>
                          </td>
                          <td>
                            <p className="opacity-50">Tambah Resep</p>
                          </td>
                          <td className="text-center">
                            <Button
                              variant="success"
                              style={{ width: "94%" }}
                              className="mx-2"
                              onClick={() => handleAddResepClick(produk)}
                            >
                              <BsPlusSquare className="mb-1" /> Tambah Resep
                            </Button>
                          </td>
                        </>
                      ) : produk.resep.length != 0 ? (
                        <>
                          <td>
                            <p className="opacity-50">Tambah Resep</p>
                          </td>
                          <td>
                            <p className="opacity-50">Tambah Resep</p>
                          </td>
                          <td>
                            <p className="opacity-50">Tambah Resep</p>
                          </td>
                          <td className="text-center">
                            <Button
                              variant="success"
                              className="w-100"
                              onClick={() => handleAddResepClick(produk)}
                            >
                              <BsPlusSquare className="mb-1" /> Tambah Resep
                            </Button>
                          </td>
                        </>
                      ) : null}
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
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
            text={search ? "Resep Tidak Ditemukan" : "Belum Ada Resep Disini"}
          />
        )}

        {/* Modal */}
        <AddEditModal
          show={showAddEditModal}
          onHide={() => {
            setShowAddEditModal(false);

            setTimeout(() => {
              setSelectedResep(null);
              setBahanBakuOptions([]);
              setSelectedAllBahanBaku(null);
              setFormData({
                id_resep: "",
                id_produk: "",
                id_bahan_baku: "",
                kuantitas: "",
                satuan: "",
              });
              setSelectedSatuan(null);
            }, 125);
          }}
          title={selectedResep ? "Edit Data Resep" : "Tambah Data Resep"}
          text={
            selectedResep
              ? "Pastikan data resep yang Anda ubah benar"
              : "Pastikan data resep yang Anda tambahkan benar"
          }
          add={add}
          edit={edit}
          isLoadingModal={isLoadingModal}
          onSubmit={inputHelper.handleSubmit}
          onEnter={async () => {
            await fetchDataBahanBaku(
              selectedAllBahanBaku || [],
              selectedResep || ""
            );
          }}
        >
          <Form.Group className="text-start mt-3" controlId="formNamaProduk">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Nama Produk
            </Form.Label>
            <Form.Control
              style={{ border: "1px solid #808080" }}
              type="text"
              name="nama_produk"
              value={formData.nama_produk || ""}
              onChange={inputHelper.handleInputChange}
              disabled={true}
              readOnly
            />
          </Form.Group>
          <Form.Group className="text-start mt-3" controlId="formNamaBahanBaku">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Nama Bahan Baku
            </Form.Label>
            <Form.Select
              style={{ border: "1px solid #808080" }}
              name="id_bahan_baku"
              value={formData.id_bahan_baku}
              onChange={(e) => {
                inputHelper.handleInputChange(e);
                setSelectedSatuan(
                  bahanBakuOptions.find(
                    (option) => option.id_bahan_baku == e.target.value
                  )
                );
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
          <Form.Group className="text-start mt-3" controlId="formKuantitas">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Kuantitas
            </Form.Label>
            <Form.Control
              style={{ border: "1px solid #808080" }}
              type="number"
              name="kuantitas"
              placeholder="Masukkan Kuantitas"
              value={formData.kuantitas}
              onChange={inputHelper.handleInputChange}
              disabled={edit.isPending || add.isPending || isLoadingModal}
            />
          </Form.Group>
          <Form.Group className="text-start mt-3" controlId="formSatuan">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Satuan
            </Form.Label>
            <Form.Control
              style={{ border: "1px solid #808080" }}
              type="text"
              name="satuan"
              placeholder="Pilih Bahan Baku terlebih dahulu"
              value={selectedSatuan?.satuan}
              disabled={edit.isPending || add.isPending || isLoadingModal}
              readOnly
            />
          </Form.Group>
        </AddEditModal>

        <DeleteConfirmationModal
          header="Anda Yakin Ingin Menghapus Data Resep Ini?"
          secondP="Semua data yang terkait dengan resep tersebut akan hilang."
          show={showDelModal}
          onHapus={handleCloseDeleteModal}
          onSubmit={onSubmit}
          del={del}
        />
      </section>
    </>
  );
}
