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
  
  import React, { useState, useEffect, useCallback } from "react";
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
  
  import NotFound from "@/component/Admin/NotFound";
  import CustomPagination from "@/component/Admin/CustomPagination";
  import OutlerHeader from "@/component/Admin/OutlerHeader";
  import APIResep from "@/api/APIResep";
  import APIBahanBaku from "@/api/APIBahanBaku";
  
  export default function ResepPage() {
    const [showDelModal, setShowDelModal] = useState(false);
    const [showPrintModal, setshowPrintModal] = useState(false);
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  
    const handleCloseDelModal = () => setShowDelModal(false);
    const handleShowDelModal = () => setShowDelModal(true);
  
    const handleCloseAddEditModal = () => setShowAddEditModal(false);
    const handleShowAddEditModal = () => setShowAddEditModal(true);
  
    const handleClosePrintModal = () => setshowPrintModal(false);
  
    const [mode, setMode] = useState("add");
  
    const [resep, setResep] = useState([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [search, setSearch] = useState(null);
  
    const [selectedProduk, setSelectedProduk] = useState(null);
    const [selectedBahanBaku, setSelectedBahanBaku] = useState(null);
    const [selectedResep, setSelectedResep] = useState(null);
  
    const [bahanBakuOptions, setBahanBakuOptions] = useState([]);
    const [deleteIdProduk, setDeleteIdProduk] = useState(null);
    const [deleteResep, setDeleteResep] = useState(null);
  
    const [isEdit, setIsEdit] = useState(false);
  
    const fetchResep = useCallback(async () => {
      try {
        setIsLoading(true);
        const response = await APIResep.getProdukByPage(page);
        console.log(response.data);
        setResep(response.data);
        setLastPage(response.last_page);
      } catch (error) {
        // Handle ketika data terakhir di suatu page dihapus, jadi mundur ke page sebelumnya
        // Atau bakal di set ke array kosong kalo hapus semua data di page pertama
        if (page - 1 === 0 && error.response.status === 404) {
          setResep([]);
        } else {
          setPage(page - 1);
        }
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }, [page]);
  
    const fetchDataBahanBaku = useCallback(async () => {
        try {
          setIsLoading(true);
          const bahanBakuResponse = await APIBahanBaku.getAllBahanBaku();
          setBahanBakuOptions(bahanBakuResponse);
        } catch (error) {
          console.error("Error fetching bahan baku:", error);
        } finally {
          setIsLoading(false);
        }
      }, []);
    
    const handleChangePage = useCallback((newPage) => {
        setPage(newPage);
    }, []);
  
    useEffect(() => {
      fetchResep();
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
        alias: "ID Produk",
      },
      id_bahan_baku: {
        required: true,
        alias: "ID Bahan Baku",
      },
      kuantitas: {
        required: true,
        alias: "Kuantitas",
        numeric: true,
        gte: 0,
      },
      satuan: {
        required: true,
        alias: "Satuan",
        max: 255,
      },
    };
  
    const handleCloseDeleteModal = () => {
      setDeleteIdProduk(null);
      setDeleteIdBahanBaku(null);
      setShowDelModal(false);
    };
    
    // Wajib dipanggil abis mutation / query
    const handleMutationSuccess = () => {
        setIsLoading(true);
        fetchResep();
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
          console.log(formData);
          if (parseInt(formData.kuantitas) < 0) {
            toast.error("Kuantitas boleh negatif!");
            return;
          }
          await add.mutateAsync(formData);
          return;
        }
  
        if (mode === "edit") {
          console.log("Data yang akan diedit:", formData);
          await edit.mutateAsync(formData);
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
        if (search.trim() === "") { // Kalo spasi doang bakal gabisa
          return;
        }
    
        setIsLoading(true);
    
        try {
          const response = await APIResep.searchResep(search.trim());
          console.log(response);
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
      setFormData({
        ...formData,
        id_produk: produk.id_produk,
        nama_produk: produk.nama_produk,
      });
      setShowAddEditModal(true);
    };
  
    const handleEditResepClick = (resep, produk) => {
      setSelectedProduk(resep);
      setSelectedResep(resep);
      setMode("edit");
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
    
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      if (name === "nama_bahan_baku" && value != null) {
        const selectedOption = bahanBakuOptions[value-1].satuan;
        //minta ming ming buat bikin findBahanBaku by id
        setSelectedBahanBaku(selectedOption);
        formData.satuan=selectedOption;
        formData.id_bahan_baku=value;
      }
      setFormData({
        ...formData,
        [name]: value,
      });
    };  
  
    const handleAddResep = async () => {
      try {
  
        console.log("Data yang akan ditambahkan:", {
          id_produk: selectedProduk.id_produk,
          id_bahan_baku: formData.id_bahan_baku,
          kuantitas: formData.kuantitas,
          satuan: formData.satuan,
        });
  
        const response = await APIResep.createResep({
          id_produk: selectedProduk.id_produk,
          id_bahan_baku: formData.id_bahan_baku,
          kuantitas: formData.kuantitas,
          satuan: formData.satuan,
        });
    
          toast.success("Resep berhasil ditambahkan");
  
          const refreshedResponse = await APIResep.getAllProduk();
          setResep(refreshedResponse.data);
    
          setShowAddEditModal(false);
         
      } catch (error) {
      
        console.error("Error adding resep:", error);
        toast.error("Terjadi kesalahan. Mohon coba lagi.");
      }
    };
  
    const handleEditResep = async () => {
      try {
  
        console.log("Data yang akan diupdate:", {
          id_produk: formData.id_produk,
          id_bahan_baku: formData.id_bahan_baku,
          kuantitas: formData.kuantitas,
          satuan: formData.satuan,
        });
  
        const response = await APIResep.updateBahanBakuInResep({
          id_resep: formData.id_resep,
          id_produk: formData.id_produk,
          id_bahan_baku: formData.id_bahan_baku,
          kuantitas: formData.kuantitas,
          satuan: formData.satuan,
        });
    
          toast.success("Resep berhasil diubah");
  
          const refreshedResponse = await APIResep.getAllProduk();
          setResep(refreshedResponse.data);
          setSelectedResep(null);
          set
          setShowAddEditModal(false);
         
      } catch (error) {
      
        console.error("Error editing resep:", error);
        toast.error("Terjadi kesalahan. Mohon coba lagi.");
      }
    };
  
    const handleDeleteResep = async () => {
      try {
        await del.mutateAsync(deleteResep);
        handleCloseDeleteModal(); 
        toast.success("Resep berhasil dihapus");
        await fetchResep(); 
      } catch (error) {
        console.error("Error deleting resep:", error);
        toast.error("Terjadi kesalahan saat menghapus resep. Mohon coba lagi.");
      }
    };
    
    return (
      <>
        <OutlerHeader
          title="Kelola Data Resep Produk"
          desc="Lakukan pengelolaan data resep produk Atma Bakery"
          breadcrumb="Resep"
        />
  
       <section className="content px-3">
       <Row className="pb-3">
        <Col
         xs="12"
         sm="6"
         lg="6"
         md="6"
         className="m-0 mb-lg-0 mb-md-0 mb-sm-0 mb-1">
        </Col>
        <Col
         xs="12"
         sm="6"
         lg="6"
         md="6"
         className="m-0 mb-lg-0 mb-md-0 mb-sm-0 mb-1">
  
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
                  <Button variant="secondary" disabled={isLoading} onClick={() => fetchResepSearch()}>
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
                <th style={{ width: "20%" }} className="th-style">
                  Kuantitas
                </th>
                <th style={{ width: "20%" }} className="th-style">
                  Satuan
                </th>
                <th style={{ width: "20%" }} className="th-style">
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
                          {produk.nama_produk}
                        </td>
                      )}
                      <td>{item.bahan_baku.nama_bahan_baku}</td>
                      <td>{item.kuantitas}</td>
                      <td>{item.satuan}</td>
                      <td>
                        <Button 
                          variant="primary"
                          style={{ width: "40%" }}
                          className="mx-2"
                          onClick={() => {
                          setMode("edit");
                          setSelectedProduk(produk);
                          handleEditResepClick(item, produk)}}>
                          <BsPencilSquare className="mb-1" /> Ubah
                        </Button>
                        <Button
                          variant="danger"
                          style={{ backgroundColor: "#FF5B19", width: "40%" }}
                          className="mx-2"
                          onClick={(event)=>
                          {
                            handleDeleteResepClick(item.id_resep, event); 
                          }}>
                          <BsFillTrash3Fill className="mb-1" /> Hapus
                        </Button>
                      </td>
                    </tr>
  
                  ))}
                  {/* Baris tambahan untuk tambah bahan */}
                  <tr>
                  {produk.resep.length == 0  && produk.id_penitip == null ? (
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
                          ) : produk.resep.length != 0 ?(
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
                                  style={{ width: "94%" }}
                                  className="mx-2"
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
              text={
                search ? "Resep Tidak Ditemukan" : "Belum Ada Resep Disini"
              }
            />
          )}
          
        {/* Modal */}
        <Modal 
          show={showAddEditModal} 
          onEnter={async () => {
            await fetchDataBahanBaku();
          }}
          onHide={() => {
            handleCloseDelModal();
            setShowAddEditModal(false);
            setIsEdit(true);
            setMode("add");
          }}
          keyboard={false}
          backdrop="static"
          centered
          size="lg"
          style={{ border: "none" }}
          >
            <Form onSubmit={inputHelper.handleSubmit}>
          <Modal.Body className="text-center p-4 m-2">
          <h4 style={{ fontWeight: "bold" }}>
                    {selectedResep ? "Edit Data Resep" : "Tambah Data Resep"}
                  </h4>
          <p
            style={{ color: "rgb(18,19,20,70%)", fontSize: "1em" }}
            className="mt-1"
          >
             {selectedResep
                    ? "Pastikan data resep yang Anda tambahkan benar"
                    : "Pastikan data resep yang Anda ubahkan benar"}
          </p>
            <Form.Group  className="text-start mt-3" controlId="formNamaProduk">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Nama Produk
                </Form.Label>
                <Form.Control
                  style={{ border: "1px solid #808080" }}
                  type="text"
                  name="nama_produk"
                  value={formData.nama_produk ||  ""}
                  onChange={handleInputChange}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="text-start mt-3" controlId="formNamaBahanBaku">
              <Form.Label  style={{ fontWeight: "bold", fontSize: "1em" }}>
                Nama Bahan Baku
              </Form.Label>
              <Form.Control
                style={{ border: "1px solid #808080" }}
                as="select"
                name="nama_bahan_baku"
                value={formData.id_bahan_baku}
                onChange={handleInputChange}
                disabled={edit.isPending || add.isPending}
              >
                <option value="">Pilih Bahan Baku</option>
                {bahanBakuOptions?.map((option,index) => (
                  <option key={option.id_bahan_baku} value={option.id_bahan_baku}>
                    {option.nama_bahan_baku}
                  </option>
                ))}
              </Form.Control>
  
            </Form.Group>
              <Form.Group className="text-start mt-3" controlId="formKuantitas">
                <Form.Label  style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Kuantitas
                </Form.Label>
                <Form.Control
                  style={{ border: "1px solid #808080" }}
                  type="number"
                  name="kuantitas"
                  value={formData.kuantitas}
                  onChange={handleInputChange}
                  disabled={edit.isPending || add.isPending}
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
                  value={formData.satuan ? formData.satuan : ""}
                  disabled={edit.isPending || add.isPending}
                  readOnly
                />
              </Form.Group>
          </Modal.Body>
          <Modal.Footer>
          <Row className="py-2 pt-3 mt-4">
          <Col sm>
            <Button  style={{ backgroundColor: "#F48E28", border: "none" }} 
              className="w-100"
              onClick={() => {setShowAddEditModal(false); 
              setSelectedResep(null)}}>
              Batal
            </Button>
            </Col>
            <Col sm>
            <Button   
              style={{ backgroundColor: "#FF5B19", border: "none" }} 
              className="w-100"
              onClick={mode == "add" ? handleAddResep : handleEditResep}
              disabled={add.isPending || edit.isPending}
              >
              {add.isPending || edit.isPending ? "Loading..." : "Simpan"}
            </Button>
            </Col>
          </Row>
          </Modal.Footer>
          </Form>
        </Modal>
        <Modal
          show={showDelModal}
          onHide={handleCloseDeleteModal}
          keyboard={false}
          backdrop="static"
          centered
          size="lg"
          style={{ border: "none" }}
        >
          <Modal.Body className="text-center p-5">
            <h3 style={{ fontWeight: "bold" }}> Anda Yakin Ingin Menghapus Data Resep Ini?</h3>
            <p
                  style={{ color: "rgb(18,19,20,70%)", fontSize: "1.15em" }}
                  className="mt-3"
                >
                  <p className="m-0 p-0">Tindakan ini tidak bisa dibatalkan.</p>
                  <p className="m-0 p-0">
                    Semua data yang terkait dengan resep tersebut akan hilang.
                  </p>
                </p>
                <Row className="py-2 pt-3">
                  <Col sm>
                <Button
             style={{ backgroundColor: "#FF5B19", border: "none" }}
             className="mx-2 w-100 p-1"
             onClick={() => {
              handleCloseDelModal();
              setDeleteResep(null);
             }}
            >
               <h5 className="mt-2">Batal</h5>
            </Button>
            </Col>
                  <Col sm>
            <Button
                  style={{ backgroundColor: "#F48E28", border: "none" }}
                  className="mx-2 w-100 p-1"
              onClick={onSubmit}
            >
           <h5 className="mt-2">Hapus {deleteIdProduk} </h5>
            </Button>
            </Col>
                </Row>
          </Modal.Body>
        </Modal>
  
        </section>
      </>
    );
  }