import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  InputGroup,
  Spinner,
  Badge,
} from "react-bootstrap";
import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  BsSearch,
  BsPlusSquare,
  BsPencilSquare,
  BsFillTrash3Fill,
  BsJournalText,
} from "react-icons/bs";

import OutlerHeader from "@/component/Admin/OutlerHeader";
import NotFound from "@/component/Admin/NotFound";
import CustomPagination from "@/component/Admin/CustomPagination";
import APIProduk from "@/api/APIProduk";
import { Link } from "react-router-dom";

const category = {
  CK: "Cake",
  RT: "Roti",
  MNM: "Minuman",
  TP: "Titipan",
};

export default function ProdukPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduk, setSelectedProduk] = useState(null);

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setSelectedProduk(null);
    setShow(false);
  };

  const handleShow = () => setShow(true);

  // Fetch bahan baku with pagination
  const [produk, setProduk] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState(null);

  const fetchProduk = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await APIProduk.getProdukByPage(page);
      setProduk(response.data);
      setLastPage(response.last_page);
    } catch (error) {
      // Handle ketika data terakhir di suatu page dihapus, jadi mundur ke page sebelumnya
      // Atau bakal di set ke array kosong kalo hapus semua data di page pertama
      if (page - 1 === 0 && error.response.status === 404) {
        setProduk([]);
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
    fetchProduk();
  }, [fetchProduk]);

  const handleMutationSuccess = () => {
    setTimeout(() => {
      fetchProduk();
      handleClose();
    }, 125);
  };

  const del = useMutation({
    mutationFn: () => APIProduk.deleteProduk(selectedProduk.id_produk),
    onSuccess: async () => {
      toast.success("Hapus Produk berhasil!");
      handleMutationSuccess();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onDelete = async () => {
    if (isLoading) return;

    try {
      await del.mutateAsync(selectedProduk.id_bahan_baku);
    } catch (error) {
      toast.error(
        error.data.message ||
          error.message ||
          "Sesuatu sedang bermasalah pada server!"
      );
    }
  };

  // Search Data
  const fetchProdukSearch = async () => {
    if (search.trim() === "") {
      // Kalo spasi doang bakal gabisa
      return;
    }

    setIsLoading(true);

    try {
      const response = await APIProduk.searchProduk(search.trim());
      setProduk(response);
    } catch (error) {
      setProduk([]); // Kalo error / tidak ditemukan set bahan baku jadi array kosong
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <OutlerHeader
        title="Kelola Data Produk"
        desc="Lakukan pengelolaan data produk Atma Bakery"
        breadcrumb="Produk"
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
            <Link
              to="./tambah"
              className={
                isLoading
                  ? "btn btn-success me-2 disabled"
                  : "btn btn-success me-2"
              }
            >
              <BsPlusSquare className="mb-1 me-2" />
              Tambah Data
            </Link>
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
                placeholder="Cari Produk disini"
                disabled={isLoading}
                onChange={(e) => {
                  if (e.target.value === "") {
                    if (page !== 1) {
                      setPage(1);
                    } else {
                      fetchProduk();
                    }
                  }
                  setSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchProdukSearch();
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
        ) : produk?.length > 0 ? (
          <>
            <Table responsive striped>
              <thead>
                <tr>
                  <th style={{ width: "14%" }} className="th-style">
                    Nama Produk
                  </th>
                  <th style={{ width: "24%" }} className="th-style">
                    Deskripsi
                  </th>
                  <th style={{ width: "6.5%" }} className="th-style">
                    Kategori
                  </th>
                  <th style={{ width: "5%" }} className="th-style">
                    Ukuran
                  </th>
                  <th style={{ width: "7%" }} className="th-style">
                    Harga
                  </th>
                  <th style={{ width: "5%" }} className="th-style">
                    Limit
                  </th>
                  <th style={{ width: "8.5%" }} className="th-style">
                    Status
                  </th>
                  <th style={{ width: "5%" }} className="th-style">
                    Stok
                  </th>
                  <th style={{ width: "30%" }} className="th-style">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {produk.map((produk, index) => (
                  <tr key={index}>
                    <td>{produk.nama_produk}</td>
                    <td>{produk.deskripsi}</td>
                    <td>{category[produk.id_kategori]}</td>
                    <td>{produk.ukuran}</td>
                    <td>{produk.harga}</td>
                    <td>{produk.limit}</td>
                    <td>
                      {produk.status == "PO" ? (
                        <Badge bg="primary">{produk.status}</Badge>
                      ) : (
                        <Badge bg="success">{produk.status}</Badge>
                      )}
                    </td>
                    <td>{produk.stok}</td>
                    <td className="text-start">
                      <Button variant="primary" className="me-2">
                        <BsJournalText className="mb-1" /> Resep
                      </Button>
                      <Link
                        to={`./edit/${produk?.id_produk}`}
                        className="btn btn-secondary me-2"
                      >
                        <BsPencilSquare className="mb-1" /> Ubah
                      </Link>
                      <Button
                        variant="danger"
                        style={{ backgroundColor: "#FF5B19" }}
                        onClick={() => {
                          setSelectedProduk(produk);
                          handleShow();
                        }}
                      >
                        <BsFillTrash3Fill className="mb-1" /> Hapus
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {lastPage > 1 && !search && (
              <CustomPagination
                currentPage={page}
                totalPage={lastPage}
                onChangePage={handleChangePage}
              />
            )}
          </>
        ) : (
          <NotFound
            text={search ? "Produk Tidak Ditemukan" : "Belum Ada Produk Disini"}
          />
        )}

        <Modal
          show={show}
          onHide={handleClose}
          centered
          size="lg"
          style={{ border: "none" }}
          keyboard={false}
          backdrop="static"
        >
          <Modal.Body className="text-center p-5">
            <h3 style={{ fontWeight: "bold" }}>
              Anda Yakin Ingin Menghapus Data Produk Ini?
            </h3>
            <p
              style={{ color: "rgb(18,19,20,70%)", fontSize: "1.15em" }}
              className="mt-3"
            >
              <p className="m-0 p-0">Tindakan ini tidak bisa dibatalkan.</p>
              <p className="m-0 p-0">
                Semua data yang terkait dengan produk tersebut akan hilang.
              </p>
            </p>
            <Row className="py-2 pt-3">
              <Col sm>
                <Button
                  style={{ backgroundColor: "#FF5B19", border: "none" }}
                  className="mx-2 w-100 p-1"
                  onClick={handleClose}
                  disabled={del.isPending}
                >
                  <h5 className="mt-2">Batal</h5>
                </Button>
              </Col>
              <Col sm>
                <Button
                  style={{ backgroundColor: "#F48E28", border: "none" }}
                  className="mx-2 w-100 p-1"
                  onClick={onDelete}
                  disabled={del.isPending}
                >
                  <h5 className="mt-2">Hapus</h5>
                </Button>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      </section>
    </>
  );
}
