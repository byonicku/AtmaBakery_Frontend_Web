import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  InputGroup,
  Spinner,
  // Container,
} from "react-bootstrap";
import { useCallback, useEffect, useState } from "react";
import {
  BsSearch,
  BsPlusSquare,
  BsPencilSquare,
  BsFillTrash3Fill,
  // BsPrinterFill,
} from "react-icons/bs";
import OutlerHeader from "@/component/Admin/OutlerHeader";
import NotFound from "@/component/Admin/NotFound";
import APIHampers from "@/api/APIHampers";
import InputHelper from "@/page/InputHelper";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

export default function HampersPage() {
  const [showDelModal, setShowDelModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHampers, setSelectedHampers] = useState(null);

  const handleCloseDelModal = () => setShowDelModal(false);
  const handleShowDelModal = () => setShowDelModal(true);

  const handleCloseAddEditModal = () => setShowAddEditModal(false);
  const handleShowAddEditModal = () => setShowAddEditModal(true);
  const [mode, setMode] = useState("add");

  // Fetch hampers with pagination
  const [hampers, setHampers] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState(null);

  const fetchHampers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await APIHampers.getHampersByPage(page);
      setHampers(response.data);
      setLastPage(response.last_page);
    } catch (error) {
      // Handle ketika data terakhir di suatu page dihapus, jadi mundur ke page sebelumnya
      // Atau bakal di set ke array kosong kalo hapus semua data di page pertama
      if (page - 1 === 0 && error.response.status === 404) {
        setHampers([]);
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

  // Pas masuk load hampers
  useEffect(() => {
    fetchHampers();
  }, [fetchHampers]);

  // CRUD Hampers
  const [formData, setFormData] = useState({
    nama_hampers: "",
    harga: "",
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
  };

  // Wajib dipanggil abis mutation / query
  const handleMutationSuccess = () => {
    setIsLoading(true);
    fetchHampers();
    setTimeout(() => {
      setSelectedHampers(null);
      setFormData({
        nama_hampers: "",
        harga: "",
      });
      setSearch(null);
    }, 125);
  };

  // Add Data
  const add = useMutation({
    mutationFn: (data) => APIHampers.createHampers(data),
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
      APIHampers.updateHampers(data, selectedHampers.id_hampers),
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
        await del.mutateAsync(selectedHampers.id_hampers);
        return;
      }
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  const inputHelper = new InputHelper(
    formData,
    setFormData,
    validationSchema,
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
              onClick={handleShowAddEditModal}
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
              <Form.Control type="text" placeholder="Cari Hampers disini" />
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
        ) : hampers?.length > 0 ? (
          <Table bordered responsive>
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
                <th style={{ width: "25%" }} className="th-style">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {hampers.map((hampers, index) => {
                return (
                  <>
                    {hampers.detail_hampers.map(function (detail_hampers, idx) {
                      if (detail_hampers.produk == null) return null;

                      return (
                        <tr key={`${index}-${idx}`}>
                          {/* Nama Hampers and Harga */}
                          {idx === 0 && (
                            <>
                              <td
                                rowSpan={
                                  hampers.detail_hampers.length > 2
                                    ? hampers.detail_hampers.length - 2
                                    : 2
                                }
                              >
                                {hampers.nama_hampers}
                              </td>
                              <td
                                rowSpan={
                                  hampers.detail_hampers.length > 2
                                    ? hampers.detail_hampers.length - 2
                                    : 2
                                }
                              >
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
                                {detail_hampers.produk?.nama_produk +
                                  " " +
                                  detail_hampers.produk?.ukuran +
                                  " Loyang"}
                              </td>
                              <td>
                                <Button
                                  variant="primary"
                                  style={{ width: "40%" }}
                                  className="mx-2"
                                  onClick={() => {
                                    setSelectedHampers(hampers);
                                    setMode("edit");
                                    setFormData({
                                      nama_hampers: hampers.nama_hampers,
                                      no_telp: hampers.no_telp,
                                    });
                                    handleShowAddEditModal();
                                  }}
                                >
                                  <BsPencilSquare className="mb-1" /> Ubah
                                </Button>
                                <Button
                                  variant="danger"
                                  style={{
                                    backgroundColor: "#FF5B19",
                                    width: "40%",
                                  }}
                                  className="mx-2"
                                  onClick={() => {
                                    setSelectedHampers(hampers);
                                    setMode("delete");
                                    handleShowDelModal();
                                  }}
                                >
                                  <BsFillTrash3Fill className="mb-1" /> Hapus
                                </Button>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                    {/* "Tambah Isi" button */}
                    <tr key={`${index}-add`}>
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
                      ) : (
                        <td colSpan={2} />
                      )}
                      <td>
                        <p className="opacity-50">Tambah Produk</p>
                      </td>
                      <td className="text-center">
                        <Button
                          variant="success"
                          style={{ width: "50%" }}
                          className="mx-2"
                          onClick={() => {
                            setSelectedHampers(hampers);
                            setMode("edit");
                            setFormData({
                              nama_hampers: hampers.nama_hampers,
                              no_telp: hampers.no_telp,
                            });
                            handleShowAddEditModal();
                          }}
                        >
                          <BsPencilSquare className="mb-1" /> Tambah Produk
                        </Button>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </Table>
        ) : (
          <NotFound
            text={
              search ? "Hampers Tidak Ditemukan" : "Belum Ada Hampers Disini"
            }
          />
        )}

        {/* ini modal modalnya */}
        <Modal
          show={showDelModal}
          onHide={handleCloseDelModal}
          animation={false}
          centered
          size="lg"
          style={{ border: "none" }}
        >
          <Modal.Body className="text-center p-5">
            <h3 style={{ fontWeight: "bold" }}>
              Anda Yakin Ingin Menghapus Data Hampers Ini?
            </h3>
            <p
              style={{ color: "rgb(18,19,20,70%)", fontSize: "1.15em" }}
              className="mt-3"
            >
              <p className="m-0 p-0">Tindakan ini tidak bisa dibatalkan.</p>
              <p className="m-0 p-0">
                Semua data yang terkait dengan Hampers tersebut akan hilang.
              </p>
            </p>
            <Row className="py-2 pt-3">
              <Col sm>
                <Button
                  style={{ backgroundColor: "#FF5B19", border: "none" }}
                  className="mx-2 w-100 p-1"
                  onClick={handleCloseDelModal}
                >
                  <h5 className="mt-2">Batal</h5>
                </Button>
              </Col>
              <Col sm>
                <Button
                  style={{ backgroundColor: "#F48E28", border: "none" }}
                  className="mx-2 w-100 p-1"
                >
                  <h5 className="mt-2">Hapus</h5>
                </Button>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>

        <Modal
          show={showAddEditModal}
          onHide={handleCloseAddEditModal}
          animation={false}
          centered
          style={{ border: "none" }}
        >
          <Form>
            <Modal.Body className="text-center p-4 m-2">
              <h4 style={{ fontWeight: "bold" }}>Tambah Data Bahan Baku</h4>
              <p
                style={{ color: "rgb(18,19,20,70%)", fontSize: "1em" }}
                className="mt-1"
              >
                Pastikan data Bahan Baku yang Anda tambahkan benar
              </p>
              <Form.Group className="text-start mt-3">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Nama
                </Form.Label>
                <Form.Control
                  style={{ border: "1px solid #808080" }}
                  type="text"
                  placeholder="Masukkan nama bahan baku"
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
                />
              </Form.Group>
              <Row className="py-2 pt-3 mt-4">
                <Col sm>
                  <Button
                    style={{ backgroundColor: "#FF5B19", border: "none" }}
                    className="w-100"
                    onClick={handleCloseAddEditModal}
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
      </section>
    </>
  );
}
