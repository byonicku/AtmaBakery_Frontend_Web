import {
  Button,
  Col,
  Row,
  Form,
  Table,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { useCallback, useEffect, useState } from "react";
import {
  BsSearch,
  BsPlusSquare,
  BsPencilSquare,
  BsFillTrash3Fill,
} from "react-icons/bs";
import OutlerHeader from "@/component/Admin/OutlerHeader";
import NotFound from "@/component/Admin/NotFound";
import APIHampers from "@/api/APIHampers";
import InputHelper from "@/page/InputHelper";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import CustomPagination from "@/component/Admin/Pagination/CustomPagination";
import { FaArrowCircleLeft, FaTrash } from "react-icons/fa";

import "./css/Hampers.css";
import "@/page/Admin/Page/css/Admin.css";

import APIProduk from "@/api/APIProduk";
import APIDetailHampers from "@/api/APIDetailHampers";
import APIGambar from "@/api/APIGambar";
import DeleteConfirmationModal from "@/component/Admin/Modal/DeleteConfirmationModal";
import AddEditModal from "@/component/Admin/Modal/AddEditModal";

export default function HampersPage() {
  const [showDelModal, setShowDelModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDelProdModal, setShowDelProdModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showAddEditProdModal, setShowAddEditProdModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingModal, setIsLoadingModal] = useState(true);
  const [hampersOptions, setHampersOptions] = useState([]);
  const [selectedIdHampers, setSelectedIdHampers] = useState(null);

  const [selectedAllHampers, setSelectedAllHampers] = useState(null);
  const [selectedHampers, setSelectedHampers] = useState(null);

  const [image_preview, setImagePreview] = useState(null);
  const [image, setImage] = useState(null);
  const [deleteImage, setDeleteImage] = useState([]);

  const [inModal, setInModal] = useState(false);

  const handleCloseDelModal = () => setShowDelModal(false);
  const handleShowDelModal = () => setShowDelModal(true);

  const handleCloseAddEditModal = () => setShowAddEditModal(false);
  const handleShowAddEditModal = () => setShowAddEditModal(true);

  const handleCloseDelProdModal = () => setShowDelProdModal(false);
  const handleShowDelProdModal = () => setShowDelProdModal(true);

  const handleCloseAddEditProdModal = () => setShowAddEditProdModal(false);
  const handleShowAddEditProdModal = () => setShowAddEditProdModal(true);

  const handleCloseRestoreModal = () => setShowRestoreModal(false);
  const handleShowRestoreModal = () => setShowRestoreModal(true);

  const handleAddClick = (event) => {
    // Prevent event propagation to the row click handler
    event.stopPropagation();
    setMode("add");
    setInModal(true);
    setFormData({
      nama_hampers: "",
      harga: "",
    });
    setImage(null);
    handleShowAddEditModal();
  };

  const handleAddProdClick = (hampers, event) => {
    // Prevent event propagation to the row click handler
    event.stopPropagation();
    setMode("add-produk");
    setSelectedAllHampers(hampers.detail_hampers);
    setInModal(true);
    setProduk(null);
    setFormDataProd({
      id_hampers: hampers.id_hampers,
      id_produk: "",
      jumlah: "",
    });
    setNamaHampers(hampers.nama_hampers);
    handleShowAddEditProdModal();
  };

  const handleEditClick = (hampers, event) => {
    // Prevent event propagation to the row click handler
    event.stopPropagation();
    setSelectedHampers(hampers);
    setMode("edit");
    setInModal(true);
    setFormData({
      nama_hampers: hampers.nama_hampers,
      harga: hampers.harga,
    });
    setImage(hampers.gambar);
    setDeleteImage([]);
    handleShowAddEditModal();
  };

  const handleEditProdClick = (hampers, detail_hampers, event) => {
    // Prevent event propagation to the row click handler
    event.stopPropagation();
    setSelectedAllHampers(hampers.detail_hampers);
    setNamaHampers(hampers.nama_hampers);
    setMode("edit-produk");
    setInModal(true);
    setFormDataProd({
      id_detail_hampers: detail_hampers.id_detail_hampers,
      id_produk: detail_hampers.produk.id_produk,
      jumlah: detail_hampers.jumlah,
    });
    setIdDetailHampers(detail_hampers.id_detail_hampers);
    setSelectedProduk(detail_hampers.produk);
    handleShowAddEditProdModal();
  };

  const handleDeleteClick = (hampers, event) => {
    // Prevent event propagation to the row click handler
    event.stopPropagation();
    setInModal(true);
    setSelectedHampers(hampers);
    setMode("delete");
    setImage(null);
    handleShowDelModal();
  };

  const handleDeleteProdClick = (detail_hampers, event) => {
    // Prevent event propagation to the row click handler
    event.stopPropagation();
    setInModal(true);
    setMode("delete-produk");
    setIdDetailHampers(detail_hampers.id_detail_hampers);
    setImage(null);
    handleShowDelProdModal();
  };

  const [mode, setMode] = useState("add");

  const [produk, setProduk] = useState([]);
  const [selectedProduk, setSelectedProduk] = useState(null);
  const [id_detail_hampers, setIdDetailHampers] = useState(null);
  const [nama_hampers, setNamaHampers] = useState("");

  // Fetch hampers with pagination
  const [hampers, setHampers] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchHampers = useCallback(
    async (signal) => {
      setIsLoading(true);
      try {
        const response = await APIHampers.getHampersByPage(page, signal);
        setHampers(response.data);
        setLastPage(response.last_page);
      } catch (error) {
        // Handle ketika data terakhir di suatu page dihapus, jadi mundur ke page sebelumnya
        // Atau bakal di set ke array kosong kalo hapus semua data di page pertama
        if (page - 1 === 0 || error.code === "ERR_NETWORK") {
          setHampers([]);
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

  const fetchTrashedHampers = useCallback(async () => {
    setIsLoadingModal(true);
    try {
      const response = await APIHampers.getAllHampersTrashed();
      setHampersOptions(response);
    } catch (error) {
      setHampersOptions([]);
      console.error(error);
    } finally {
      setIsLoadingModal(false);
    }
  }, []);

  const fetchProduk = useCallback(
    async (selectedAllProduk, selectedProdukEdit) => {
      setIsLoadingModal(true);
      try {
        const response = await APIProduk.getAllProduk();
        if (selectedAllProduk) {
          const selected = selectedAllProduk.map((item) => item.id_produk);

          const filter = response.filter(
            (item) => !selected.includes(item.id_produk)
          );

          if (selectedProdukEdit) {
            filter.unshift(selectedProdukEdit);
          }

          setProduk(filter);
        } else {
          setProduk(response);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingModal(false);
      }
    },
    []
  );

  const handleChangePage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  // Pas masuk load hampers
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetchHampers(signal);

    return () => {
      abortController.abort();
    };
  }, [fetchHampers]);

  // CRUD Hampers
  const [formData, setFormData] = useState({
    nama_hampers: "",
    harga: "",
  });

  const [formDataProd, setFormDataProd] = useState({
    id_detail_hampers: "",
    id_produk: "",
    jumlah: 0,
  });

  // Untuk validasi front-end (sebisa mungkin samain dengan backend ya)
  const validationSchema = {
    nama_hampers: {
      required: true,
      alias: "Nama Hampers",
    },
    harga: {
      required: true,
      alias: "Harga",
    },
    foto: {
      required: mode === "add" ? true : false,
      alias: "Gambar",
    },
  };

  const validationSchemaProd = {
    id_produk: {
      required: true,
      alias: "Produk",
    },
    jumlah: {
      required: true,
      alias: "Jumlah",
    },
  };

  const handleDeleteImage = async () => {
    try {
      const result = {};

      if (deleteImage.length === 0) return result;

      for (const image of deleteImage) {
        await APIGambar.deleteGambar(image.id_gambar);
        result[image.public_id] = image.public_id;
      }

      return result;
    } catch (error) {
      console.error(error);
    }
  };

  const uploadImage = async (id) => {
    try {
      const result = {};

      if (image_preview == null) return result;

      for (const image of image_preview) {
        console.log(image);
        const formData = new FormData();
        const filename = new Date().getTime() + "-hampers";
        formData.append("file", image);
        const response = await APIGambar.uploadImage(formData, filename);
        const url = response.secure_url;
        const public_id = filename;
        const insertData = await APIGambar.createGambar({
          id_hampers: id,
          url,
          public_id,
        });
        result[public_id] = insertData;
      }

      return result;
    } catch (error) {
      console.error(error);
    }
  };

  // Wajib dipanggil abis mutation / query
  const handleMutationSuccess = () => {
    setIsLoading(true);
    fetchHampers();
    setTimeout(() => {
      setSelectedHampers(null);
      setSelectedAllHampers(null);
      setFormData({
        nama_hampers: "",
        harga: "",
      });
      setSearch(null);
      setImage(null);
      setImagePreview(null);
    }, 125);
  };

  const handleMutationSuccessProd = () => {
    setIsLoadingModal(true);
    fetchHampers();
    setTimeout(() => {
      setSelectedProduk(null);
      setSelectedAllHampers(null);
      setSelectedHampers(null);
      setFormDataProd({
        id_hampers: "",
        nama_produk: "",
        ukuran: "",
      });
    }, 125);
  };

  // Add Data
  const add = useMutation({
    mutationFn: (data) => APIHampers.createHampers(data, uploadImage),
    onSuccess: async () => {
      toast.success("Tambah Hampers berhasil!");
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
      APIHampers.updateHampers(
        data,
        selectedHampers.id_hampers,
        uploadImage,
        handleDeleteImage
      ),
    onSuccess: async () => {
      toast.success("Edit Hampers berhasil!");
      handleCloseAddEditModal();
      handleMutationSuccess();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  // Delete Data
  const del = useMutation({
    mutationFn: (id) => APIHampers.deleteHampers(id),
    onSuccess: async () => {
      toast.success("Hapus Hampers berhasil!");
      handleCloseDelModal();
      handleMutationSuccess();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const restore = useMutation({
    mutationFn: (id) => APIHampers.restoreHampers(id),
    onSuccess: async () => {
      toast.success("Restore Bahan Baku berhasil!");
      handleMutationSuccess();
      handleCloseRestoreModal();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  // Add Produk
  const addProd = useMutation({
    mutationFn: (data) => APIDetailHampers.createDetailHampers(data),
    onSuccess: async () => {
      toast.success("Tambah Produk Hampers berhasil!");
      handleCloseAddEditProdModal();
      handleMutationSuccessProd();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  // Edit Produk
  const editProd = useMutation({
    mutationFn: (data) =>
      APIDetailHampers.updateDetailHampers(data, id_detail_hampers),
    onSuccess: async () => {
      toast.success("Edit Produk Hampers berhasil!");
      handleCloseAddEditProdModal();
      handleMutationSuccessProd();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const delProd = useMutation({
    mutationFn: (id) => APIDetailHampers.deleteDetailHampers(id),
    onSuccess: async () => {
      toast.success("Hapus Produk Hampers berhasil!");
      handleCloseDelProdModal();
      handleMutationSuccessProd();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = async (formData) => {
    if (isLoading) return;

    try {
      if (mode === "add") {
        if (parseInt(formData?.harga) <= 0) {
          toast.error("Harga harus lebih dari 0!");
          return;
        }

        if (image_preview?.length === 0 || image?.length === 0) {
          toast.error("Gambar tidak boleh kosong!");
          return;
        }

        await add.mutateAsync(formData);
        return;
      }

      if (mode === "edit") {
        if (parseInt(formData?.harga) <= 0) {
          toast.error("Harga harus lebih dari 0!");
          return;
        }

        await edit.mutateAsync(formData);
        return;
      }

      if (mode === "delete") {
        await del.mutateAsync(selectedHampers.id_hampers);
        return;
      }

      if (mode === "restore") {
        if (!selectedIdHampers) {
          toast.error("Pilih Hampers yang akan direstore!");
          return;
        }

        await restore.mutateAsync(selectedIdHampers);
        return;
      }

      if (mode === "add-produk") {
        if (parseInt(formDataProd?.jumlah) <= 0) {
          toast.error("Jumlah produk harus lebih dari 0!");
          return;
        }

        await addProd.mutateAsync(formDataProd);
        return;
      }

      if (mode === "edit-produk") {
        if (parseInt(formDataProd?.jumlah) <= 0) {
          toast.error("Jumlah produk harus lebih dari 0!");
          return;
        }

        await editProd.mutateAsync(formDataProd);
        return;
      }

      if (mode === "delete-produk") {
        await delProd.mutateAsync(id_detail_hampers);
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

  const inputHelperProd = new InputHelper(
    formDataProd,
    setFormDataProd,
    validationSchemaProd,
    onSubmit
  );

  // Search Data
  const fetchHampersSearch = async () => {
    if (search.trim() === "") {
      // Kalo spasi doang bakal gabisa
      return;
    }

    setIsLoading(true);

    try {
      const response = await APIHampers.searchHampers(search.trim());
      setHampers(response);
    } catch (error) {
      setHampers([]); // Kalo error / tidak ditemukan set penitip jadi array kosong
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <OutlerHeader
        title="Kelola Data Hampers"
        desc="Lakukan pengelolaan data hampers Atma Bakery"
        breadcrumb="Hampers"
        onClick={(e) => {
          e.stopPropagation();
          if (selectedHampers) {
            setSelectedHampers(null);
            setImage(null);
          }
        }}
      />
      <section
        className="content px-3"
        onClick={(e) => {
          e.stopPropagation();
          if (selectedHampers && !inModal) {
            setSelectedHampers(null);
            setImage(null);
          }
        }}
      >
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
              onClick={(e) => handleAddClick(e)}
              className="me-2 me-lg-1 mb-2 mb-lg-1 mb-md-2 mb-sm-2"
              disabled={isLoading}
            >
              <BsPlusSquare className="mb-1 me-2" />
              Tambah Data
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                handleShowRestoreModal();
                setMode("restore");
                setSelectedIdHampers(null);
              }}
              disabled={
                isLoading || add.isPending || edit.isPending || del.isPending
              }
              className="me-2 me-lg-1 mb-2 mb-lg-1 mb-md-2 mb-sm-2"
            >
              <FaArrowCircleLeft className="mb-1 me-2" />
              Restore Data
            </Button>
            <Button
              variant="primary"
              onClick={(e) => handleEditClick(selectedHampers, e)}
              className="me-2 me-lg-1 mb-2 mb-lg-1 mb-md-2 mb-sm-2"
              disabled={selectedHampers === null || isLoading}
            >
              <BsPencilSquare className="mb-1 me-2" />
              Ubah Data
            </Button>
            <Button
              variant="danger"
              onClick={(e) => handleDeleteClick(selectedHampers, e)}
              className="custom-danger-btn me-2 me-lg-1 mb-2 mb-lg-1 mb-md-2 mb-sm-2"
              disabled={selectedHampers === null || isLoading}
            >
              <BsFillTrash3Fill className="mb-1 me-2" />
              Hapus Data
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
                placeholder="Cari Hampers disini"
                name="search"
                value={search || ""}
                disabled={isLoading}
                onChange={(e) => {
                  if (e.target.value === "") {
                    if (page !== 1) {
                      setPage(1);
                    } else {
                      fetchHampers();
                    }
                  }
                  setSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && search) {
                    fetchHampersSearch();
                  }
                }}
              />
              <Button
                variant="secondary"
                disabled={isLoading}
                onClick={fetchHampersSearch}
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
        ) : hampers?.length > 0 ? (
          <>
            <Table bordered responsive className="prevent-select">
              <thead>
                <tr>
                  <th style={{ width: "7%" }} className="th-style">
                    Nama Hampers
                  </th>
                  <th style={{ width: "7%" }} className="th-style">
                    Harga
                  </th>
                  <th style={{ width: "25%" }} className="th-style">
                    Produk
                  </th>
                  <th style={{ width: "15%" }} className="th-style">
                    Jumlah
                  </th>
                  <th style={{ width: "30%" }} className="th-style">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {hampers.map((hampers, index) => {
                  return (
                    <>
                      {hampers.detail_hampers.map(function (
                        detail_hampers,
                        idx
                      ) {
                        if (detail_hampers.produk == null) return null;

                        return (
                          <tr
                            className={
                              selectedHampers === hampers
                                ? "selected-hampers"
                                : ""
                            }
                            key={`${index}-${idx}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (selectedHampers === hampers) {
                                setSelectedHampers(null);
                                setImage(null);
                                return;
                              }

                              setSelectedHampers(hampers);
                              setImage(hampers.gambar);
                            }}
                          >
                            {/* Nama Hampers and Harga */}
                            {idx === 0 && (
                              <>
                                <td rowSpan={hampers.detail_hampers.length + 1}>
                                  {hampers.nama_hampers}
                                </td>
                                <td rowSpan={hampers.detail_hampers.length + 1}>
                                  {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                  }).format(hampers.harga)}
                                </td>
                              </>
                            )}
                            {/* Tambahan, Nama Produk, Ukuran, and Aksi */}
                            {detail_hampers.produk?.nama_produk && (
                              <>
                                <td>
                                  {detail_hampers.produk?.id_kategori === "CK"
                                    ? detail_hampers.produk?.nama_produk +
                                      " " +
                                      detail_hampers.produk?.ukuran +
                                      " Loyang"
                                    : detail_hampers.produk?.nama_produk}
                                </td>
                                <td>{detail_hampers.jumlah}</td>
                                <td>
                                  <Row className="gap-1 gap-lg-0 gap-md-0">
                                    <Col xs={12} sm={12} md={6} lg={6}>
                                      <Button
                                        className="w-100"
                                        variant="primary"
                                        onClick={(event) =>
                                          handleEditProdClick(
                                            hampers,
                                            detail_hampers,
                                            event
                                          )
                                        }
                                      >
                                        <BsPencilSquare className="mb-1" /> Ubah
                                      </Button>
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={6}>
                                      <Button
                                        className="custom-danger-btn w-100"
                                        variant="danger"
                                        onClick={(event) =>
                                          handleDeleteProdClick(
                                            detail_hampers,
                                            event
                                          )
                                        }
                                      >
                                        <BsFillTrash3Fill className="mb-1" />{" "}
                                        Hapus
                                      </Button>
                                    </Col>
                                  </Row>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                      {/* "Tambah Isi" button */}
                      <tr
                        className={
                          selectedHampers === hampers ? "selected-hampers" : ""
                        }
                        key={`${index}-add`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (selectedHampers === hampers) {
                            setSelectedHampers(null);
                            setImage(null);
                            return;
                          }

                          setSelectedHampers(hampers);
                          setImage(hampers.gambar);
                        }}
                      >
                        {hampers.detail_hampers.length == 0 ? (
                          <>
                            <td>{hampers.nama_hampers}</td>
                            <td>
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              }).format(hampers.harga)}
                            </td>
                          </>
                        ) : null}
                        <td>
                          <p className="opacity-50">Tambah Produk</p>
                        </td>
                        <td>
                          <p className="opacity-50">Tambah Produk</p>
                        </td>
                        <td>
                          <Button
                            className="w-100"
                            variant="success"
                            onClick={(event) =>
                              handleAddProdClick(hampers, event)
                            }
                          >
                            <BsPlusSquare className="mb-1" /> Tambah Produk
                          </Button>
                        </td>
                      </tr>
                    </>
                  );
                })}
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
            text={
              search ? "Hampers Tidak Ditemukan" : "Belum Ada Hampers Disini"
            }
          />
        )}

        {/* ini modal modalnya */}
        <AddEditModal
          show={showAddEditModal}
          onClick={(e) => e.stopPropagation()}
          onHide={() => {
            handleCloseAddEditModal();
            setTimeout(() => {
              setSelectedHampers(null);
              setImage(null);
              setImagePreview(null);
              setInModal(false);
            }, 125);
          }}
          add={add}
          edit={edit}
          title={
            mode === "add"
              ? "Tambah Data Hampers"
              : mode === "edit"
              ? "Ubah Data Hampers"
              : "Hapus Data Hampers"
          }
          text={
            mode === "add"
              ? "Pastikan data Hampers yang Anda tambahkan benar"
              : mode === "edit"
              ? "Pastikan data Hampers yang Anda ubah benar"
              : "Pastikan data Hampers yang Anda hapus benar"
          }
          onSubmit={inputHelper.handleSubmit}
        >
          <Form.Group className="text-start mt-3">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Nama Hampers
            </Form.Label>
            <Form.Control
              style={{ border: "1px solid #808080" }}
              type="text"
              name="nama_hampers"
              onChange={inputHelper.handleInputChange}
              value={formData.nama_hampers}
              placeholder="Masukkan nama hampers"
              disabled={isLoading || add.isPending || edit.isPending}
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
              name="harga"
              onChange={inputHelper.handleInputChange}
              value={formData.harga}
              placeholder="Masukkan harga hampers"
              disabled={isLoading || add.isPending || edit.isPending}
              required
            />
          </Form.Group>
          <Form.Group className="text-start mt-3">
            <Form.Group>
              <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                Gambar (Max 5 Gambar, Max 1MB/Gambar)
              </Form.Label>
              <Form.Control
                name="foto"
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                multiple
                disabled={
                  image?.length >= 5 ||
                  image_preview?.length > 5 ||
                  isLoading ||
                  add.isPending ||
                  edit.isPending
                }
                onClick={() => {
                  if (image?.length >= 5 || image_preview?.length > 5) {
                    toast.error("Gambar maksimal 5!");
                    return;
                  }
                }}
                onChange={(e) => {
                  if (
                    e.target.files.length > 5 ||
                    image?.length + e.target.files.length > 5 ||
                    image_preview?.length > 5
                  ) {
                    toast.error("Gambar maksimal 5!");
                    return;
                  }

                  for (const image of e.target.files) {
                    if (image.size > 1000000) {
                      toast.error("Ukuran gambar maksimal 1MB!");
                      return;
                    }
                  }

                  inputHelper.handleFileChange(e);
                  setImagePreview(e.target.files);
                }}
              />
            </Form.Group>
          </Form.Group>
          <Row>
            {image != null &&
              image.map((img, index) => (
                <div key={index} className="image-container">
                  <img
                    draggable="false"
                    src={img.url}
                    alt="preview"
                    width="200"
                    height="200"
                    className={`img-thumbnail my-2 mx-1 ${
                      deleteImage.includes(img) && "selected-delete"
                    }`}
                  />
                  <div className="action-icons">
                    <label
                      className={`remove-icon text-white`}
                      onClick={() => {
                        if (isLoading || add.isPending || edit.isPending)
                          return;

                        const updatedDeleteImage = deleteImage.includes(img)
                          ? deleteImage.filter((image) => image !== img)
                          : [...deleteImage, img];
                        setDeleteImage(updatedDeleteImage);
                      }}
                    >
                      <FaTrash />
                    </label>
                  </div>
                </div>
              ))}

            {image_preview != null &&
              Array.from(image_preview).map((file, index) => (
                <>
                  <div className="image-container">
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      width="200"
                      height="200"
                      className="img-thumbnail my-2 mx-1 selected-new"
                    />
                    <div className="action-icons">
                      <label
                        className="remove-icon text-white"
                        onClick={() => {
                          if (isLoading || add.isPending || edit.isPending)
                            return;

                          setImagePreview(
                            Array.from(image_preview).filter(
                              (image) => image !== file
                            )
                          );

                          if (image_preview?.length === 1) {
                            document.getElementsByName("foto")[0].value = "";
                          }
                        }}
                      >
                        <FaTrash />
                      </label>
                    </div>
                  </div>
                </>
              ))}
          </Row>
        </AddEditModal>

        <AddEditModal
          show={showRestoreModal}
          onHide={() => {
            handleCloseRestoreModal();
            setTimeout(() => {
              setSelectedIdHampers(null);
            }, 125);
          }}
          title="Restore Data Hampers"
          text="Pastikan data hampers yang Anda restore benar"
          onEnter={async () => {
            await fetchTrashedHampers();
          }}
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          add={restore}
          isLoadingModal={isLoadingModal}
        >
          <Form.Group className="text-start mt-3" controlId="formNamaBahanBaku">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Nama Bahan Baku
            </Form.Label>
            <Form.Select
              style={{ border: "1px solid #808080" }}
              name="id_bahan_baku"
              onChange={(e) => {
                setSelectedIdHampers(e.target.value);
              }}
              disabled={
                restore.isPending ||
                isLoadingModal ||
                hampersOptions?.length === 0
              }
              required
            >
              <option value="" disabled selected hidden>
                {isLoadingModal
                  ? "Loading..."
                  : hampersOptions?.length > 0
                  ? "Pilih Hampers yang akan direstore"
                  : "Tidak ada data Hampers yang bisa direstore"}
              </option>
              {hampersOptions?.map((option) => (
                <option key={option.id_hampers} value={option.id_hampers}>
                  {option.nama_hampers}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </AddEditModal>

        <DeleteConfirmationModal
          header="Anda Yakin Ingin Menghapus Data Hampers Ini?"
          secondP="Semua data yang terkait dengan Hampers tersebut akan hilang."
          show={showDelModal}
          onClick={(e) => e.stopPropagation()}
          onHapus={() => {
            handleCloseDelModal();
            setSelectedHampers(null);
            setInModal(false);
          }}
          onSubmit={onSubmit}
          del={del}
        />

        <AddEditModal
          show={showAddEditProdModal}
          onEnter={async () => {
            await fetchProduk(selectedAllHampers || [], selectedProduk || "");
          }}
          onClick={(e) => e.stopPropagation()}
          title={
            selectedProduk ? "Edit Data Isi Hampers" : "Tambah Data Isi Hampers"
          }
          text={
            selectedProduk
              ? "Pastikan data isi hampers yang Anda tambahkan benar"
              : "Pastikan data isi hampers yang Anda ubahkan benar"
          }
          onSubmit={inputHelperProd.handleSubmit}
          onHide={() => {
            handleCloseAddEditProdModal();
            setTimeout(() => {
              setProduk(null);
              setSelectedProduk(null);
              setInModal(false);
            }, 125);
          }}
          add={addProd}
          edit={editProd}
          isLoadingModal={isLoadingModal}
        >
          <Form.Group className="text-start mt-3">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Nama Hampers
            </Form.Label>
            <Form.Control
              style={{ border: "1px solid #808080" }}
              type="text"
              name="nama_hampers"
              value={nama_hampers}
              onChange={inputHelperProd.handleInputChange}
              disabled
            />
          </Form.Group>
          <Form.Group className="text-start mt-3">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Nama Produk
            </Form.Label>
            <Form.Select
              style={{ border: "1px solid #808080" }}
              name="id_produk"
              value={formDataProd?.id_produk}
              onChange={inputHelperProd.handleInputChange}
              disabled={isLoadingModal || edit.isPending || add.isPending}
              required
            >
              <option value="" disabled selected hidden>
                ---
              </option>
              {produk?.map((produk, index) => (
                <option key={index} value={produk.id_produk}>
                  {produk.id_kategori === "CK"
                    ? produk.nama_produk + " " + produk?.ukuran + " Loyang"
                    : produk.nama_produk}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="text-start mt-3">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Jumlah
            </Form.Label>
            <Form.Control
              style={{ border: "1px solid #808080" }}
              type="number"
              placeholder="Masukkan jumlah produk"
              name="jumlah"
              value={formDataProd?.jumlah}
              onChange={inputHelperProd.handleInputChange}
              disabled={edit.isPending || add.isPending || isLoadingModal}
              required
            />
          </Form.Group>
        </AddEditModal>

        <DeleteConfirmationModal
          header="Anda Yakin Ingin Menghapus Data Isi Hampers Ini?"
          secondP="Semua data yang terkait dengan isi hampers tersebut akan hilang."
          show={showDelProdModal}
          onClick={(e) => e.stopPropagation()}
          onHapus={() => {
            handleCloseDelProdModal();
            setIdDetailHampers(null);
            setProduk(null);
            setInModal(false);
          }}
          onSubmit={onSubmit}
          del={delProd}
        />
      </section>
    </>
  );
}
