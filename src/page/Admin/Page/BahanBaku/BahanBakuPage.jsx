import {
    Button,
    Col,
    Row,
    Form,
    Table,
    Modal,
    InputGroup,
    // Container,
    Spinner
  } from "react-bootstrap";
  import { useState,useEffect, useCallback } from "react";
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
  import OutlerHeader from "@/component/Admin/OutlerHeader";
  import APIBahanBaku from "@/api/APIBahanBaku";
  import NotFound from "@/component/Admin/NotFound";
  import CustomPagination from "@/component/Admin/CustomPagination";

  
  export default function BahanBakuPage() {
    const [showDelModal, setShowDelModal] = useState(false);
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [showPrintModal, setshowPrintModal] = useState(false);
    const [selectedBahanBaku, setSelectedBahanBaku] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleCloseDelModal = () => setShowDelModal(false);
    const handleShowDelModal = () => setShowDelModal(true);
  
    const handleCloseAddEditModal = () => setShowAddEditModal(false);
    const handleShowAddEditModal = () => setShowAddEditModal(true);
  
    const handleClosePrintModal = () => setshowPrintModal(false);
    // const handleShowPrintModal = () => setshowPrintModal(true);
  
    const [mode, setMode] = useState("add");

    // Fetch bahan baku with pagination
    const [bahanBaku, setBahanBaku] = useState([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [search, setSearch] = useState(null);
    
    const fetchBahanBaku = useCallback(async () => {
      setIsLoading(true);
      try {
        const response = await APIBahanBaku.getBahanBakuByPage(page);
        setBahanBaku(response.data);
        setLastPage(response.last_page);
      } catch (error) {
        // Handle ketika data terakhir di suatu page dihapus, jadi mundur ke page sebelumnya
        // Atau bakal di set ke array kosong kalo hapus semua data di page pertama
        if (page - 1 === 0 && error.response.status === 404) {
          setBahanBaku([]);
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

    useEffect(() => {
      fetchBahanBaku();
    }, [fetchBahanBaku]);
    
    const [formData, setFormData] = useState({
      nama_bahan_baku: "",
      stok: "",
      satuan:"",
    });

    const validationSchema = {
      nama_bahan_baku: {
        required: true,
        alias: "Nama Bahan Baku",
      },
      stok: {
        required: true,
        alias: "Stok Bahan Baku",
      },
      satuan: {
        required: true,
        alias: "Satuan Bahan Baku"
      }
    };

    const handleMutationSuccess = () => {
      setIsLoading(true);
      fetchBahanBaku();
      setTimeout(() => {
        setSelectedBahanBaku(null);
        setFormData({
          nama_bahan_baku: "",
          stok: "",
          satuan:"",
        });
        setSearch(null);
      }, 125);
    };

    // Add Data
    const add = useMutation({
      mutationFn: (data) => APIBahanBaku.createBahanBaku(data),
      onSuccess: async () => {
        toast.success("Tambah Bahan Baku berhasil!");
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
        APIBahanBaku.updateBahanBaku(data, selectedBahanBaku.id_bahan_baku),
      onSuccess: async () => {
        toast.success("Edit Bahan Baku berhasil!");
        handleCloseAddEditModal();
        handleMutationSuccess();
      },
      onError: (error) => {
        console.error(error.message);
      },
    });

    const del = useMutation({
      mutationFn: (id) => APIBahanBaku.deleteBahanBaku(id),
      onSuccess: async () => {
        toast.success("Hapus Bahan Baku berhasil!");
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
          await del.mutateAsync(selectedBahanBaku.id_bahan_baku);
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
  

    // Search Data
    const fetchBahanBakuSearch = async () => {
      if (search.trim() === "") { // Kalo spasi doang bakal gabisa
        return;
      }

      setIsLoading(true);

      try {
        const response = await APIBahanBaku.searchBahanBaku(search.trim());
        setBahanBaku(response);
      } catch (error) {
        setBahanBaku([]); // Kalo error / tidak ditemukan set bahan baku jadi array kosong
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };


    return (
      <>
        <OutlerHeader
          title="Kelola Data Bahan Baku"
          desc="Lakukan pengelolaan data bahan baku Atma Bakery"
          breadcrumb="Bahan Baku"
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
                    nama_bahan_baku: "",
                    stok: "",
                    satuan: ""
                  });
                }}
                disabled={isLoading}
                className="me-2"
              >
                <BsPlusSquare className="mb-1 me-2" />
                Tambah Data
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
                  placeholder="Cari Bahan Baku disini" 
                  name="search"
                  value={search || ""}
                  disabled={isLoading}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      if (page !== 1) {
                        setPage(1);
                      } else {
                        fetchBahanBaku();
                      }
                    }
                    setSearch(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      fetchBahanBakuSearch(search);
                    }
                  }}
                />
                <Button variant="secondary">
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
        ) : bahanBaku?.length > 0 ? (
          <>
          <Table responsive striped>
            <thead>
              <tr>
                <th style={{ width: "25%" }} className="th-style">
                  Nama
                </th>
                <th style={{ width: "25%" }} className="th-style">
                  Stok
                </th>
                <th style={{ width: "25%" }} className="th-style">
                  Satuan
                </th>
                <th style={{ width: "25%" }} className="th-style">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {bahanBaku.map((bahanBaku, index) => (
                <tr key={index}>
                  <td>{bahanBaku.nama_bahan_baku}</td>
                  <td>{bahanBaku.stok}</td>
                  <td>{bahanBaku.satuan}</td>
                  <td className="text-start">
                    <Button
                      variant="primary"
                      style={{ width: "40%" }}
                      className="mx-2"
                      onClick={() => {
                        setSelectedBahanBaku(bahanBaku);
                        setMode("edit");
                        setFormData({
                          nama_bahan_baku: bahanBaku.nama_bahan_baku,
                          stok: bahanBaku.stok,
                          satuan: bahanBaku.satuan,
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
                        setSelectedBahanBaku(bahanBaku);
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
         ): (
          <NotFound 
            text={
              search ? "Bahan Baku Tidak Ditemukan" : "Belum Ada Bahan Baku Disini" }/>
         )}
          {/* ini modal modalnya */}
          <Modal
            show={showDelModal}
            onHide={() => {
              handleCloseDelModal();
              setSelectedBahanBaku(null);
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
                Anda Yakin Ingin Menghapus Data Bahan Baku Ini?
              </h3>
              <p
                style={{ color: "rgb(18,19,20,70%)", fontSize: "1.15em" }}
                className="mt-3"
              >
                <p className="m-0 p-0">Tindakan ini tidak bisa dibatalkan.</p>
                <p className="m-0 p-0">
                  Semua data yang terkait dengan Bahan Baku tersebut akan hilang.
                </p>
              </p>
              <Row className="py-2 pt-3">
                <Col sm>
                  <Button
                    style={{ backgroundColor: "#FF5B19", border: "none" }}
                    className="mx-2 w-100 p-1"
                    onClick={() => {
                      handleCloseDelModal();
                      setSelectedBahanBaku(null);
                    }}
                    disabled={del.isPending}
                  >
                    <h5 className="mt-2">Batal</h5>
                  </Button>
                </Col>
                <Col sm>
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
                  Print Laporan Penggunaan Bahan Baku
                </h5>
                <p
                  style={{ color: "rgb(18,19,20,70%)", fontSize: "1em" }}
                  className="mt-1"
                >
                  Pilih tanggal awal Penggunaan Bahan Baku
                </p>
                <Form.Group className="text-start mt-3">
                  <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    Pilih Tanggal Awal
                  </Form.Label>
                  <Form.Control
                    style={{ border: "1px solid #808080" }}
                    type="date"
                    placeholder="Month YYYY"
                  />
                </Form.Group>
                <Form.Group className="text-start mt-3">
                  <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    Pilih Tanggal Akhir
                  </Form.Label>
                  <Form.Control
                    style={{ border: "1px solid #808080" }}
                    type="date"
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
                {selectedBahanBaku ? "Edit Data Bahan Baku" : "Tambah Data Bahan Baku"}
                </h4>
                <p
                  style={{ color: "rgb(18,19,20,70%)", fontSize: "1em" }}
                  className="mt-1"
                >
                  {selectedBahanBaku
                    ? "Pastikan data bahan baku yang Anda tambahkan benar"
                    : "Pastikan data bahan baku yang Anda ubahkan benar"}
                </p>
                <Form.Group className="text-start mt-3">
                  <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    Nama
                  </Form.Label>
                  <Form.Control
                    style={{ border: "1px solid #808080" }}
                    type="text"
                    placeholder="Masukkan nama bahan baku"
                    name="nama_bahan_baku"
                    value={formData.nama_bahan_baku || selectedBahanBaku?.nama_bahan_baku || ""}
                    onChange={inputHelper.handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="text-start mt-3">
                  <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    Stok
                  </Form.Label>
                  <Form.Control
                    style={{ border: "1px solid #808080" }}
                    type="number"
                    placeholder="Masukkan stok bahan baku"
                    name="stok"
                    value={formData.stok || selectedBahanBaku?.stok || ""}
                    onChange={inputHelper.handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="text-start mt-3">
                  <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    Satuan
                  </Form.Label>
                  <Form.Control
                    style={{ border: "1px solid #808080" }}
                    type="text"
                    placeholder="Masukkan satuan bahan baku"
                    name="satuan"
                    value={formData.satuan || selectedBahanBaku?.satuan || ""}
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
                          setSelectedBahanBaku(null);
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
  