import {
  Button,
  Col,
  Row,
  Form,
  Table,
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
} from "react-icons/bs";

import "@/page/Admin/Page/css/Admin.css";

import OutlerHeader from "@/component/Admin/OutlerHeader";
import NotFound from "@/component/Admin/NotFound";
import CustomPagination from "@/component/Admin/Pagination/CustomPagination";
import APIProduk from "@/api/APIProduk";
import { Link } from "react-router-dom";
import ConfirmationModal from "@/component/Admin/Modal/ConfirmationModal";
import AddEditModal from "@/component/Admin/Modal/AddEditModal";
import { FaArrowCircleLeft } from "react-icons/fa";
import Formatter from "@/assets/Formatter";

const category = {
  CK: "Cake",
  RT: "Roti",
  MNM: "Minuman",
  TP: "Titipan",
};

export default function ProdukPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [selectedProduk, setSelectedProduk] = useState(null);
  const [selectedProdukTrashed, setSelectedProdukTrashed] = useState(null);
  const [produkOptions, setProdukOptions] = useState([]);

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setSelectedProduk(null);
    setShow(false);
  };

  const handleShow = () => setShow(true);

  const [showRestoreModal, setShowRestoreModal] = useState(false);

  const handleCloseRestoreModal = () => setShowRestoreModal(false);
  const handleShowRestoreModal = () => setShowRestoreModal(true);

  // Fetch bahan baku with pagination
  const [produk, setProduk] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchProduk = useCallback(
    async (signal) => {
      setIsLoading(true);
      try {
        const response = await APIProduk.getProdukByPage(page, signal);
        setProduk(response.data);
        setLastPage(response.last_page);
      } catch (error) {
        // Handle ketika data terakhir di suatu page dihapus, jadi mundur ke page sebelumnya
        // Atau bakal di set ke array kosong kalo hapus semua data di page pertama
        if (page - 1 === 0 || error.code === "ERR_NETWORK") {
          setProduk([]);
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

  const fetchTrashedProduk = useCallback(async () => {
    setIsLoadingModal(true);
    try {
      const response = await APIProduk.getAllProdukTrashed();
      setProdukOptions(response);
    } catch (error) {
      setProdukOptions([]);
      console.error(error);
    } finally {
      setIsLoadingModal(false);
    }
  }, []);

  const handleChangePage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetchProduk(signal);

    return () => {
      abortController.abort();
    };
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

  const restore = useMutation({
    mutationFn: () => APIProduk.restoreProduk(selectedProdukTrashed),
    onSuccess: async () => {
      toast.success("Restore Produk berhasil!");
      handleMutationSuccess();
      handleCloseRestoreModal();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = async () => {
    if (isLoadingModal) return;

    try {
      await restore.mutateAsync();
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Sesuatu sedang bermasalah pada server!"
      );
    }
  };

  const onDelete = async () => {
    if (isLoading) return;

    try {
      await del.mutateAsync(selectedProduk.id_bahan_baku);
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
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
        <Row className="pb-3 gap-1 gap-lg-0 gap-md-0">
          <Col
            xs={12}
            sm={12}
            lg={6}
            md={12}
            className="m-0 mb-lg-0 mb-md-0 mb-sm-0 mb-1"
          >
            <Link
              to="./tambah"
              className={
                isLoading
                  ? "btn btn-success me-2 me-lg-1 mb-2 mb-lg-1 mb-md-2 mb-sm-2 disabled"
                  : "btn btn-success me-2 me-lg-1 mb-2 mb-lg-1 mb-md-2 mb-sm-2"
              }
            >
              <BsPlusSquare className="mb-1 me-2" />
              Tambah Data
            </Link>
            <Button
              variant="primary"
              onClick={handleShowRestoreModal}
              disabled={isLoading}
              className="me-2 me-lg-1 mb-2 mb-lg-1 mb-md-2 mb-sm-2"
            >
              <FaArrowCircleLeft className="mb-1 me-2" />
              Restore Data
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
                  if (e.key === "Enter" && search) {
                    fetchProdukSearch();
                  }
                }}
              />
              <Button variant="secondary" onClick={fetchProdukSearch}>
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
                  <th style={{ width: "13%" }} className="th-style">
                    Nama Produk
                  </th>
                  <th style={{ width: "20%" }} className="th-style">
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
                  <th style={{ width: "40%" }} className="th-style">
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
                    <td>{Formatter.moneyFormatter(produk.harga)}</td>
                    <td>{produk.limit}</td>
                    <td>
                      {produk.status == "PO" ? (
                        <Badge bg="primary">{produk.status}</Badge>
                      ) : (
                        <Badge bg="success">{produk.status}</Badge>
                      )}
                    </td>
                    <td>{produk.stok}</td>
                    <td>
                      <Row className="gap-2 gap-lg-2 gap-md-2 gap-xl-0">
                        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
                          <Link
                            to={`./edit/${produk?.id_produk}`}
                            className="btn btn-primary w-100"
                          >
                            <BsPencilSquare className="mb-1" /> Ubah
                          </Link>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
                          <Button
                            variant="danger"
                            className="custom-danger-btn w-100"
                            onClick={() => {
                              setSelectedProduk(produk);
                              handleShow();
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

        <AddEditModal
          show={showRestoreModal}
          onHide={() => {
            handleCloseRestoreModal();
            setTimeout(() => {
              setSelectedProdukTrashed(null);
            }, 125);
          }}
          title="Restore Data Produk"
          text="Pastikan data produk yang Anda restore benar"
          onEnter={async () => {
            await fetchTrashedProduk();
          }}
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          add={restore}
          isLoadingModal={isLoadingModal}
          validate={() => {
            if (produkOptions?.length === 0) {
              toast.error("Tidak ada data Produk yang bisa direstore");
              return 0;
            }

            if (!selectedProdukTrashed) {
              toast.error("Pilih produk yang akan direstore terlebih dahulu!");
              return 0;
            }
            return 1;
          }}
        >
          <Form.Group className="text-start mt-3" controlId="formNamaBahanBaku">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Nama Bahan Baku
            </Form.Label>
            <Form.Select
              style={{ border: "1px solid #808080" }}
              name="id_produk"
              onChange={(e) => {
                setSelectedProdukTrashed(e.target.value);
              }}
              disabled={
                restore.isPending ||
                isLoadingModal ||
                produkOptions?.length === 0
              }
              required
            >
              <option value="" disabled selected hidden>
                {isLoadingModal
                  ? "Loading..."
                  : produkOptions?.length > 0
                  ? "Pilih Produk yang akan direstore"
                  : "Tidak ada data Produk yang bisa direstore"}
              </option>
              {produkOptions?.map((option) => (
                <option key={option.id_produk} value={option.id_produk}>
                  {option.nama_produk}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </AddEditModal>

        <ConfirmationModal
          header="Anda Yakin Ingin Menghapus Produk Ini?"
          secondP="Semua data yang terkait dengan produk tersebut akan hilang."
          show={show}
          onCancel={handleClose}
          onSubmit={onDelete}
          del={del}
        />
      </section>
    </>
  );
}
