import {
  Button,
  Col,
  Row,
  Modal,
  Table,
  Spinner,
  Badge,
  InputGroup,
  Form,
  Image,
  Container,
} from "react-bootstrap";

import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import propTypes from "prop-types";

import { BsEnvelopePaper, BsInbox, BsSearch } from "react-icons/bs";

import "@/page/Admin/Page/css/Admin.css";
import InputHelper from "@/page/InputHelper";
import OutlerHeader from "@/component/Admin/OutlerHeader";
import APIHistory from "@/api/APICustomer";
import APITransaksi from "@/api/APITransaksi";
import APILaporan from "@/api/APILaporan";
import NotFound from "@/component/Admin/NotFound";
import CustomPagination from "@/component/Admin/Pagination/CustomPagination";
import Formatter from "@/assets/Formatter";
import AddEditModal from "@/component/Admin/Modal/AddEditModal";
import { toast } from "sonner";
import { FaCheck } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { useConfirm } from "@/hooks/useConfirm";

export default function KonfirmasiPage({ status }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingModal, setIsLoadingModal] = useState(true);
  const [selectedNota, setSelectedNota] = useState(null);
  const [listBahanBaku, setListBahanBaku] = useState([]);
  const [listBahanBakuUsed, setListBahanBakuUsed] = useState([]);
  const [listNotaBerhasil, setListNotaBerhasil] = useState([]);
  const [listNotaGagal, setListNotaGagal] = useState([]);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showGambarModal, setShowGambarModal] = useState(false);
  const [showBahanBakuModal, setShowBahanBakuModal] = useState(false);
  const [showBahanBakuProsesModal, setShowBahanBakuProsesModal] =
    useState(false);

  const [showBothModal, setShowBothModal] = useState(false);

  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(status ? status : "Semua");
  const [showModal, setShowModal] = useState(false);
  const [bukti_bayar, setBuktiBayar] = useState(null);
  const { confirm, modalElement } = useConfirm();

  const [dataNota, setDataNota] = useState([]);
  const [dataBahanBaku, setDataBahanBaku] = useState([]);
  const [dataBahanBakuKeseluruhan, setDataBahanBakuKeseluruhan] = useState([]);
  const [dataRekapProduk, setDataRekapProduk] = useState([]);
  const [dataRekapProdukDibuat, setDataRekapProdukDibuat] = useState([]);

  const fetchData = async () => {
    setIsLoadingModal(true);

    try {
      const response = await APILaporan.getRekapProduk();
      setDataRekapProduk(response);
    } catch (error) {
      console.error(error);
    }

    try {
      const response = await APILaporan.getRekapProdukPerluDibuat();
      setDataRekapProdukDibuat(response);
    } catch (error) {
      console.error(error);
    }

    try {
      const response = await APILaporan.getRekapBahanBakuPerProduk();
      setDataBahanBaku(response);
    } catch (error) {
      console.error(error);
    }

    try {
      const response = await APILaporan.getRekapBahanBaku();
      setDataBahanBakuKeseluruhan(response);
    } catch (error) {
      console.error(error);
    }

    try {
      const response = await APILaporan.getRekapNotaHarian();
      setDataNota(response);
    } catch (error) {
      console.error(error);
    }

    setIsLoadingModal(false);
  };

  const formatData = (data) => {
    const groupedData = data.reduce((acc, item) => {
      if (!acc[item.nama_produk]) {
        acc[item.nama_produk] = [];
      }

      acc[item.nama_produk].push(item);
      return acc;
    }, {});

    return Object.entries(groupedData).map(([productName, ingredients]) => (
      <div key={productName}>
        <h5 className="text-bold pt-2">{productName}</h5>
        {ingredients.map((ingredient, index) => {
          if (
            ingredient?.nama_bahan_baku.startsWith("Box") ||
            ingredient?.nama_bahan_baku.startsWith("Kartu") ||
            ingredient?.nama_bahan_baku.startsWith("Botol") ||
            ingredient?.nama_bahan_baku.startsWith("Tas")
          ) {
            return null;
          }
          return (
            <p key={index} className="p-0 m-0">
              {ingredient.total_jumlah_dibutuhkan} {ingredient.satuan}{" "}
              {ingredient.nama_bahan_baku}
            </p>
          );
        })}
      </div>
    ));
  };

  const [showModalRekapHarian, setShowModalRekapHarian] = useState(false);

  const handleCloseModalRekapHarian = () => setShowModalRekapHarian(false);
  const handleShowModalRekapHarian = () => {
    setShowModalRekapHarian(true);
    fetchData();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsLoadingModal(false);
  };

  const handleCloseBahanBakuModal = () => setShowBahanBakuModal(false);
  const handleShowBahanBakuModal = () => setShowBahanBakuModal(true);

  const handleCloseBahanBakuProsesModal = () =>
    setShowBahanBakuProsesModal(false);
  const handleShowBahanBakuProsesModal = () =>
    setShowBahanBakuProsesModal(true);

  const handleCloseAddEditModal = () => setShowAddEditModal(false);
  const handleShowAddEditModal = () => setShowAddEditModal(true);

  const handleCloseAdminModal = () => setShowAdminModal(false);
  const handleShowAdminModal = () => setShowAdminModal(true);

  const handleCloseGambarModal = () => setShowGambarModal(false);
  const handleShowGambarModal = () => setShowGambarModal(true);

  const handleCloseBothModal = () => setShowBothModal(false);
  const handleShowBothModal = () => setShowBothModal(true);

  const handleShowModal = useCallback(async (data) => {
    setShowModal(true);
    const response = await APIHistory.getNotaPesanan(data);
    setSelectedNota(response);
    setBuktiBayar(data?.bukti_pembayaran);
    setIsLoadingModal(false);
  }, []);

  const fetchHistoryCust = useCallback(
    async (signal, filter) => {
      try {
        const response = await APIHistory.getCustHistoryByPageAll(
          page,
          signal,
          filter
        );
        setHistory(response.data);
        setLastPage(response.last_page);
      } catch (error) {
        // Handle ketika data terakhir di suatu page dihapus, jadi mundur ke page sebelumnya
        // Atau bakal di set ke array kosong kalo hapus semua data di page pertama
        if (page - 1 === 0 || error.code === "ERR_NETWORK") {
          setHistory([]);
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

  useEffect(() => {
    setFilter(status);
  }, [status]);

  // Input Jarak
  const [formDataJarak, setFormDataJarak] = useState({
    no_nota: selectedNota?.no_nota,
    radius: "",
    ongkir: "",
  });

  const validationSchemaJarak = {
    radius: {
      required: true,
      alias: "Radius",
    },
  };

  const onSubmitJarak = async () => {
    if (isLoading) return;
    const data = new FormData();
    data.append("no_nota", selectedNota.no_nota);
    data.append("radius", formDataJarak.radius);
    data.append("ongkir", hitungOngkir(formDataJarak.radius));
    try {
      await inputJarak.mutateAsync(data);
      return;
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Sesuatu sedang bermasalah pada server!"
      );
    }
  };

  const inputJarak = useMutation({
    mutationFn: (data) => APITransaksi.addJarak(data),
    onSuccess: async () => {
      toast.success("Input Jarak Berhasil!");
      fetchHistoryCust(null, filter);
      setFormDataJarak({ radius: "", ongkir: "" });
      handleCloseAddEditModal();
      handleCloseModal();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const inputHelperJarak = new InputHelper(
    formDataJarak,
    setFormDataJarak,
    validationSchemaJarak,
    onSubmitJarak
  );

  function validateJarak() {
    if (!formDataJarak.radius) {
      toast.error("Radius perlu diisi!");
      return 0;
    }

    if (formDataJarak.radius <= 0) {
      toast.error("Radius tidak boleh kurang dari 0!");
      return 0;
    }

    return 1;
  }

  const hitungOngkir = (radius) => {
    if (!radius) {
      return 0;
    }

    if (radius <= 5) {
      return 10000;
    } else if (radius > 5 && radius <= 10) {
      return 15000;
    } else if (radius > 10 && radius <= 15) {
      return 20000;
    } else {
      return 25000;
    }
  };

  // Konfirmasi Admin
  const [formDataAdmin, setFormDataAdmin] = useState({
    tip: 0,
  });

  const validationSchemaAdmin = {
    tip: {
      required: false,
      alias: "Tip",
    },
  };

  async function onSubmitAdmin() {
    if (isLoading) return;
    const data = new FormData();
    data.append("no_nota", selectedNota.no_nota);
    data.append("tip", formDataAdmin.tip);
    try {
      await inputAdmin.mutateAsync(data);
      return;
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Sesuatu sedang bermasalah pada server!"
      );
    }
  }

  const inputAdmin = useMutation({
    mutationFn: (data) => APITransaksi.konfirmasiTransaksiAdmin(data),
    onSuccess: async () => {
      toast.success("Konfirmasi oleh Admin Berhasil!");
      fetchHistoryCust(null, filter);
      setFormDataAdmin({ tip: 0 });
      handleCloseAdminModal();
      handleCloseModal();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const inputHelperAdmin = new InputHelper(
    formDataAdmin,
    setFormDataAdmin,
    validationSchemaAdmin,
    onSubmitAdmin
  );

  function validateAdmin() {
    if (formDataAdmin.tip === "") {
      toast.error("Tip perlu diisi!");
      return 0;
    }

    if (formDataAdmin.tip < 0) {
      toast.error("Tip tidak boleh kurang dari 0!");
      return 0;
    }
    return 1;
  }

  // Pas masuk load customer
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    setIsLoading(true);
    const fetchData = async () => {
      await fetchHistoryCust(signal, filter);
    };

    fetchData();

    if (filter) {
      setSearch("");
    }

    return () => {
      abortController.abort();
    };
  }, [fetchHistoryCust, filter]);

  const fetchHistorySearch = async () => {
    if (search.trim() === "") {
      // Kalo spasi doang bakal gabisa
      return;
    }

    setIsLoading(true);
    try {
      const response = await APIHistory.searchCustHistoryAll(search, filter);
      setHistory(response);
    } catch (error) {
      setHistory([]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const statusNotFound = (status) => {
    if (status === "Menunggu Perhitungan Ongkir") {
      return "Tidak ada pesanan yang menunggu ongkir";
    }

    if (status === "Menunggu Konfirmasi Pembayaran") {
      return "Tidak ada pesanan yang menunggu konfirmasi pembayaran";
    }

    if (status === "Menunggu Konfirmasi Pesanan") {
      return "Tidak ada pesanan yang menunggu konfirmasi pesanan";
    }

    if (status === "date") {
      return "Tidak ada pesanan yang menunggu pemrosesan";
    }

    if (status === "batal") {
      return "Tidak ada pesanan yang dapat dibatalkan";
    }

    if (!status && search) {
      return "History Tidak Ditemukan";
    }

    return "Belum Ada History Disini";
  };

  const outletHeaderData = (status) => {
    if (status === "Menunggu Perhitungan Ongkir") {
      return {
        title: "Penginputan Jarak Pesanan Customer",
        desc: "Lakukan penginputan jarak pesanan customer",
        breadcrumb: "Input Jarak",
      };
    }

    if (status === "Menunggu Konfirmasi Pembayaran") {
      return {
        title: "Konfirmasi Pembayaran Customer",
        desc: "Lakukan konfirmasi pembayaran customer",
        breadcrumb: "Konfirmasi Pembayaran",
      };
    }

    if (status === "Menunggu Konfirmasi Pesanan") {
      return {
        title: "Konfirmasi Pesanan Customer",
        desc: "Lakukan konfirmasi pesanan customer",
        breadcrumb: "Konfirmasi Pesanan",
      };
    }

    if (status === "date") {
      return {
        title: "Konfirmasi Pemrosesan Pesanan Customer",
        desc: "Lakukan konfirmasi pemrosesan pesanan customer",
        breadcrumb: "Konfirmasi Pemrosesan Pesanan",
      };
    }

    if (status === "batal") {
      return {
        title: "Batalkan Pesanan Customer",
        desc: "Batalkan pesanan customer",
        breadcrumb: "Batalkan Pesanan",
      };
    }

    return {
      title: "History Pesanan Customer",
      desc: "Lihat history pesanan customer",
      breadcrumb: "History Pesanan",
    };
  };

  const handleConfirmMOItem = async () => {
    const data = {
      no_nota: selectedNota?.no_nota,
    };

    try {
      setIsLoading(true);
      const response = await APITransaksi.konfirmasiPesananMO(data);
      fetchHistoryCust(null, filter);
      if (response.bahan_baku) {
        setListBahanBaku(response?.bahan_baku);
        if (response?.bahan_baku?.length != 0) {
          handleCloseBahanBakuModal();
        }
      }
      toast.success("Konfirmasi oleh MO Berhasil!");
      handleCloseModal();
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Sesuatu sedang bermasalah pada server!"
      );
    }
  };

  const showBahanBakuKurang = async () => {
    const data = {
      no_nota: selectedNota?.no_nota,
    };

    const isConfirmed = await confirm(
      "Apakah anda yakin ingin mengonfirmasi transaksi ini?",
      "",
      "Konfirmasi",
      false
    );

    if (!isConfirmed) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await APITransaksi.tampilBahanBakuKurang(data);
      fetchHistoryCust(null, filter);
      if (response.bahan_baku) {
        setListBahanBaku(response?.bahan_baku);
        if (response?.bahan_baku?.length != 0) {
          handleShowBahanBakuModal();
        }
      }
      handleCloseModal();
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Sesuatu sedang bermasalah pada server!"
      );
    }
  };

  const handleConfirmMOProses = async () => {
    const data = {
      no_nota: selectedNota?.no_nota,
    };

    const isConfirmed = await confirm(
      "Apakah anda yakin ingin memproses pesanan ini?",
      "",
      "Proses",
      false
    );

    if (!isConfirmed) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await APITransaksi.konfirmasiPemrosesanMO(data);

      if (response.bahan_baku) {
        setListBahanBaku(response.bahan_baku);
        listNotaGagal.push(data.no_nota);
        if (response.bahan_baku.length != 0) {
          handleShowBothModal();
          toast.warning(
            "Konfirmasi Pemrosesan oleh MO Gagal! Silahkan cek bahan baku yang tersedia"
          );
          return;
        }
      }

      if (response.histori) {
        setListBahanBaku(response.histori);
        if (response?.histori?.length != 0) {
          handleShowBahanBakuProsesModal();
        }
      }

      fetchHistoryCust(null, filter);
      toast.success("Konfirmasi Pemrosesan oleh MO Berhasil!");
      handleCloseModal();
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Sesuatu sedang bermasalah pada server!"
      );
    }
  };

  const handleConfirmMOProsesAll = async () => {
    const isConfirmed = await confirm(
      "Apakah anda yakin ingin memproses semua pesanan ini?",
      "",
      "Proses",
      false
    );

    if (!isConfirmed) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      let isSuccess = true;
      const bahanBakuUsed = [];
      const bahanBakuNeeded = [];
      const bahanBakuUsedResult = [];
      const bahanBakuNeededResult = [];

      for (const data of history) {
        try {
          const response = await APITransaksi.konfirmasiPemrosesanMO({
            no_nota: data.no_nota,
          });

          if (response.bahan_baku) {
            bahanBakuNeeded.push(...response.bahan_baku);
          }

          if (response.histori) {
            bahanBakuUsed.push(...response.histori);
          }

          if (
            response.message ===
            "Transaksi tidak berhasil diproses karena stok bahan baku tidak mencukupi"
          ) {
            isSuccess = false;
            listNotaGagal.push(data.no_nota);
          } else {
            listNotaBerhasil.push(data.no_nota);
          }
        } catch (error) {
          console.error(error);
        }
      }
      bahanBakuNeeded.forEach(function (a) {
        if (!this[a.id_bahan_baku]) {
          this[a.id_bahan_baku] = {
            id_bahan_baku: a.id_bahan_baku,
            nama_bahan_baku: a.nama_bahan_baku,
            stok_sekarang: a.stok_sekarang,
            jumlah_dibutuhkan: 0,
            stok_yang_harus_dibeli: 0,
          };
          bahanBakuNeededResult.push(this[a.id_bahan_baku]);
        }
        this.stok_sekarang = a.stok_sekarang;
        this[a.id_bahan_baku].jumlah_dibutuhkan += a.jumlah_dibutuhkan;
        this[a.id_bahan_baku].stok_yang_harus_dibeli +=
          a.stok_yang_harus_dibeli;
      }, Object.create(null));

      bahanBakuUsed.forEach(function (a) {
        if (!this[a.id_bahan_baku]) {
          this[a.id_bahan_baku] = {
            id_bahan_baku: a.id_bahan_baku,
            nama_bahan_baku: a.nama_bahan_baku,
            stok: a.stok,
            jumlah: 0,
          };
          bahanBakuUsedResult.push(this[a.id_bahan_baku]);
        }
        this.stok = a.stok;
        this[a.id_bahan_baku].jumlah += a.jumlah;
      }, Object.create(null));

      setListBahanBaku(bahanBakuNeededResult);
      setListBahanBakuUsed(bahanBakuUsedResult);

      handleShowBothModal();

      fetchHistoryCust(null, filter);

      if (!isSuccess) {
        toast.warning(
          "Konfirmasi Semua Pemrosesan oleh MO terdapat yang Gagal! Silahkan cek bahan baku yang tersedia"
        );
        return;
      }
      toast.success("Konfirmasi Semua Pemrosesan oleh MO Berhasil!");
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Sesuatu sedang bermasalah pada server!"
      );
    }
  };

  const handleRejectMOItem = async () => {
    const data = {
      no_nota: selectedNota?.no_nota,
    };
    const isConfirmed = await confirm(
      "Apakah anda yakin ingin menolak transaksi ini?",
      "",
      "Tolak Konfirmasi",
      false
    );

    if (!isConfirmed) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      await APITransaksi.tolakPesananMO(data);

      fetchHistoryCust(null, filter);
      toast.success("Penolakan Transaksi oleh MO Berhasil!");
      handleCloseModal();
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Sesuatu sedang bermasalah pada server!"
      );
    }
  };

  const handleConfirmSelesai = async () => {
    const data = {
      no_nota: selectedNota?.no_nota,
    };
    const isConfirmed = await confirm(
      "Apakah anda yakin ingin menyelesaikan transaksi ini?",
      "",
      "Selesai",
      false
    );

    if (!isConfirmed) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      await APITransaksi.updateStatusSelesai(data);

      fetchHistoryCust(null, filter);
      toast.success("Transaksi Selesai!");
      handleCloseModal();
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Sesuatu sedang bermasalah pada server!"
      );
    }
  };

  const handleSelesaiProses = async () => {
    const data = {
      no_nota: selectedNota?.no_nota,
    };
    const isConfirmed = await confirm(
      "Apakah anda yakin ingin selesai memproses transaksi ini?",
      "",
      "Selesai",
      false
    );

    if (!isConfirmed) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      await APITransaksi.updateStatusKirimPickUp(data);

      fetchHistoryCust(null, filter);
      toast.success("Proses Transaksi Selesai!");
      handleCloseModal();
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Sesuatu sedang bermasalah pada server!"
      );
    }
  };

  const handleBatalkanTransaksiSemua = async () => {
    const isConfirmed = await confirm(
      "Apakah anda yakin ingin menolak semua transaksi ini?",
      "",
      "Tolak Semua",
      true
    );

    if (!isConfirmed) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      await APITransaksi.batalkanSemuaTransaksi();

      fetchHistoryCust(null, filter);
      toast.success("Batalkan Transaksi Berhasil!");
      handleCloseModal();
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Sesuatu sedang bermasalah pada server!"
      );
    }
  };

  const namaProdukConverter = (kategori, ukuran, nama) => {
    if (kategori === "CK") {
      return nama + " " + ukuran + " Loyang";
    }

    return nama;
  };

  const namaProdukConverterDibuat = (kategori, jumlah, nama) => {
    const ukuran =
      jumlah - Math.floor(jumlah) !== 0
        ? Math.floor(jumlah) + " 1/2"
        : Math.floor(jumlah);

    if (kategori === "CK") {
      return nama + " " + ukuran + " Loyang";
    }

    return nama;
  };

  return (
    <>
      <OutlerHeader
        title={outletHeaderData(status).title}
        desc={outletHeaderData(status).desc}
        breadcrumb={outletHeaderData(status).breadcrumb}
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
            {status === "date" && (
              <>
                <Button
                  variant="success"
                  onClick={() => handleConfirmMOProsesAll()}
                  disabled={isLoading || history?.length === 0}
                  className="me-2 me-lg-1 mb-2 mb-lg-1 mb-md-2 mb-sm-2"
                >
                  <FaCheck className="mb-1" /> Konfirmasi Semua
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleShowModalRekapHarian()}
                  disabled={isLoading || history?.length === 0}
                  className="mb-2 mb-lg-1 mb-md-2 mb-sm-2"
                >
                  <BsEnvelopePaper className="mb-1" /> Rekap Harian
                </Button>
              </>
            )}
            {status === "batal" && (
              <Button
                variant="danger"
                className="custom-danger-btn me-2 me-lg-1 mb-2 mb-lg-1 mb-md-2 mb-sm-2"
                onClick={() => handleBatalkanTransaksiSemua()}
                disabled={isLoading}
              >
                <FaX className="mb-1" /> Tolak Semua
              </Button>
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
                placeholder="Cari History disini"
                name="search"
                value={search || ""}
                disabled={isLoading}
                onChange={(e) => {
                  if (e.target.value === "") {
                    if (page !== 1) {
                      setPage(1);
                    } else {
                      fetchHistoryCust(null, filter);
                    }
                  }
                  setSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && search) {
                    fetchHistorySearch();
                  }
                }}
              />
              <Button
                variant="secondary"
                disabled={isLoading}
                onClick={() => fetchHistorySearch()}
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
        ) : history?.length > 0 ? (
          <>
            <Table responsive striped>
              <thead>
                <tr>
                  <th style={{ width: "10%" }} className="th-style">
                    Nomor Nota
                  </th>
                  <th style={{ width: "16%" }} className="th-style">
                    Tanggal Pesan
                  </th>
                  <th style={{ width: "16%" }} className="th-style">
                    Tanggal Ambil
                  </th>
                  <th style={{ width: "13%" }} className="th-style">
                    Status
                  </th>
                  <th style={{ width: "16%" }} className="th-style">
                    Total
                  </th>
                  <th style={{ width: "13%" }} className="th-style">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {history.map((history, index) => (
                  <tr key={index}>
                    <td>{history.no_nota}</td>
                    <td>
                      {Formatter.dateTimeFormatter(history.tanggal_pesan)}
                    </td>
                    <td>{Formatter.dateFormatter(history.tanggal_ambil)}</td>
                    <td>
                      {history.status.includes("Terkirim") ||
                      history.status.includes("Selesai") ||
                      history.status.includes("Pesanan Diterima") ? (
                        <Badge bg="success">{history.status}</Badge>
                      ) : history.status.includes("Sedang Diproses") ? (
                        <Badge bg="warning">{history.status}</Badge>
                      ) : history.status.includes("Siap Pick Up") ||
                        history.status.includes("Siap Kirim") ||
                        history.status.includes("Sedang Diantar Kurir") ||
                        history.status.includes("Sedang Diantar Ojol") ? (
                        <Badge bg="primary">{history.status}</Badge>
                      ) : history.status === "Ditolak" ? (
                        <Badge bg="danger">{history.status}</Badge>
                      ) : (
                        <Badge bg="secondary">{history.status}</Badge>
                      )}
                    </td>
                    <td>{Formatter.moneyFormatter(history.total)}</td>
                    <td>
                      <Row className="gap-1 gap-lg-0 gap-md-0">
                        <Col xs={12} sm={12} md={11} lg={11}>
                          <Button
                            variant="danger"
                            className="custom-danger-btn w-100"
                            onClick={() => {
                              setSelectedNota(history);
                              handleShowModal(history);
                              setIsLoadingModal(true);
                            }}
                          >
                            <BsInbox className="mb-1" /> Lihat Detail
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
          <NotFound text={statusNotFound(status)} />
        )}

        <Modal show={showModal} onHide={handleCloseModal} size="xl">
          <Modal.Body className="text-start p-4 m-2">
            {isLoadingModal ? (
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
            ) : (
              <>
                <Row>
                  <Col>
                    <h2 style={{ fontWeight: "bold" }}>Atma Bakery</h2>
                    <h5
                      style={{ color: "rgb(18,19,20,70%)", fontSize: "1.1em" }}
                      className="mt-3"
                    >
                      Jl. Babarsari No.43, Janti, Caturtunggal, Kec. Depok,
                      Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281
                    </h5>
                    <h5
                      style={{ color: "rgb(18,19,20,70%)", fontSize: "1.1em" }}
                    >
                      AtmaBakery@gmail.uajy.ac.id
                    </h5>
                    <h5
                      style={{ color: "rgb(18,19,20,70%)", fontSize: "1.1em" }}
                    >
                      012-345-6789
                    </h5>
                  </Col>
                  <Col className="text-end">
                    <h4>
                      Nota {selectedNota?.no_nota}
                      {selectedNota?.status.includes("Terkirim") ||
                      selectedNota?.status.includes("Selesai") ||
                      selectedNota?.status.includes("Pesanan Diterima") ? (
                        <Badge className="ms-3 font-size-12" bg="success">
                          {selectedNota?.status}
                        </Badge>
                      ) : selectedNota?.status.includes("Sedang Diproses") ? (
                        <Badge
                          className="ms-3 font-size-12"
                          bg="orange"
                          style={{
                            backgroundColor: "orange",
                            color: "white !important",
                          }}
                        >
                          {selectedNota?.status}
                        </Badge>
                      ) : selectedNota?.status.includes("Siap Pick Up") ||
                        selectedNota?.status.includes("Siap Kirim") ||
                        selectedNota?.status.includes("Sedang Diantar Kurir") ||
                        selectedNota?.status.includes("Sedang Diantar Ojol") ? (
                        <Badge className="ms-3 font-size-12" bg="primary">
                          {selectedNota?.status}
                        </Badge>
                      ) : selectedNota?.status === "Ditolak" ? (
                        <Badge className="ms-3 font-size-12" bg="danger">
                          {selectedNota?.status}
                        </Badge>
                      ) : (
                        <Badge className="ms-3 font-size-12" bg="secondary">
                          {selectedNota?.status}
                        </Badge>
                      )}
                    </h4>
                    <h5
                      style={{ color: "rgb(18,19,20,70%)", fontSize: "1.1em" }}
                      className="mt-3"
                    >
                      Tanggal Pesan :{" "}
                      {Formatter.dateTimeFormatter(selectedNota?.tanggal_pesan)}
                    </h5>
                    <h5
                      style={{ color: "rgb(18,19,20,70%)", fontSize: "1.1em" }}
                    >
                      Lunas Pada :{" "}
                      {Formatter.dateTimeFormatter(selectedNota?.tanggal_lunas)}
                    </h5>
                    <h5
                      style={{ color: "rgb(18,19,20,70%)", fontSize: "1.1em" }}
                    >
                      Tanggal Ambil :{" "}
                      {Formatter.dateFormatter(selectedNota?.tanggal_ambil)}
                    </h5>
                  </Col>
                </Row>

                <hr style={{ border: "1px solid" }} />

                <Row>
                  <Col>
                    <h4 style={{ fontWeight: "bold" }}>Customer : </h4>
                    <h5
                      style={{
                        color: "rgb(18,19,20,70%)",
                        fontSize: "1.07em",
                        fontWeight: "600",
                      }}
                    >
                      {selectedNota?.nama}
                    </h5>
                    <h5
                      style={{ color: "rgb(18,19,20,70%)", fontSize: "1.07em" }}
                    >
                      {selectedNota?.email}
                    </h5>
                    <h5
                      style={{ color: "rgb(18,19,20,70%)", fontSize: "1.07em" }}
                    >
                      {selectedNota?.no_telp}
                    </h5>
                  </Col>
                  <Col className="text-end">
                    <h4>
                      Tipe Delivery
                      {selectedNota?.tipe_delivery == "Ojol" ? (
                        <Badge className="ms-2 font-size-12" bg="success">
                          {selectedNota?.tipe_delivery}
                        </Badge>
                      ) : selectedNota?.tipe_delivery === "Kurir" ? (
                        <Badge className="ms-2 font-size-12" bg="primary">
                          {selectedNota?.tipe_delivery}
                        </Badge>
                      ) : (
                        <Badge className="ms-2 font-size-12" bg="dark">
                          {selectedNota?.tipe_delivery}
                        </Badge>
                      )}
                    </h4>
                    {selectedNota?.tipe_delivery == "Ambil" ? null : (
                      <>
                        <h5
                          style={{
                            color: "rgb(18,19,20,70%)",
                            fontSize: "1.05em",
                          }}
                          className="mt-2"
                        >
                          {selectedNota?.lokasi}
                        </h5>
                        <h5
                          style={{
                            color: "rgb(18,19,20,70%)",
                            fontSize: "1.05em",
                          }}
                        >
                          {selectedNota?.keterangan}
                        </h5>
                      </>
                    )}
                  </Col>
                </Row>
                <h5 className="mt-3" style={{ fontWeight: "bold" }}>
                  Ringkasan Pesanan
                </h5>
                <Table
                  responsive
                  className="text-start align-middle table-nowrap"
                >
                  <thead>
                    <tr>
                      <th style={{ width: "5%" }} className="th-style">
                        No
                      </th>
                      <th style={{ width: "50%" }} className="th-style">
                        Produk
                      </th>
                      <th style={{ width: "20%" }} className="th-style">
                        Jumlah
                      </th>
                      <th style={{ width: "30%" }} className="th-style">
                        Sub Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedNota?.produk?.map(function (detail, idx) {
                      return (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>
                            {detail.id_kategori === "CK"
                              ? detail.nama_produk +
                                " " +
                                detail.ukuran +
                                " Loyang"
                              : detail.nama_produk}{" "}
                          </td>
                          <td>{detail.jumlah}</td>
                          <td>
                            {Formatter.moneyFormatter(
                              detail.jumlah * detail.harga_saat_beli
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {selectedNota?.tipe_delivery === "Kurir" ? (
                      <tr>
                        <td colSpan={3} className="text-end">
                          Ongkos Kirim (rad. {selectedNota?.radius} km) :
                        </td>
                        <td>
                          {Formatter.moneyFormatter(selectedNota?.ongkir)}
                        </td>
                      </tr>
                    ) : null}
                    <tr>
                      <td className="text-end" colSpan={3}>
                        Potongan Poin {selectedNota?.penggunaan_poin} poin :
                      </td>
                      <td>
                        -{" "}
                        {Formatter.moneyFormatter(
                          selectedNota?.penggunaan_poin * 100
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-end" colSpan={3}>
                        Total :
                      </td>
                      <td>{Formatter.moneyFormatter(selectedNota?.total)}</td>
                    </tr>
                  </tbody>
                </Table>
                <h5
                  style={{ color: "rgb(18,19,20,70%)", fontSize: "1.1em" }}
                  className="mt-1"
                >
                  Poin dari pesanan ini : {selectedNota?.penambahan_poin}
                </h5>
                <h5
                  style={{ color: "rgb(18,19,20,70%)", fontSize: "1.1em" }}
                  className="mt-1"
                >
                  Total Poin Customer :{" "}
                  {selectedNota?.poin_user_setelah_penambahan}
                </h5>
              </>
            )}
          </Modal.Body>
          {isLoadingModal ? null : (
            <Modal.Footer>
              {bukti_bayar && (
                <Button
                  variant="primary"
                  onClick={() => {
                    handleShowGambarModal();
                  }}
                >
                  Lihat Bukti Bayar
                </Button>
              )}
              {status === "Menunggu Perhitungan Ongkir" && (
                <Button
                  variant="primary"
                  onClick={() => {
                    handleShowAddEditModal();
                  }}
                >
                  Input Jarak
                </Button>
              )}
              {status === "Menunggu Konfirmasi Pembayaran" && (
                <Button
                  variant="success"
                  onClick={() => {
                    handleShowAdminModal();
                  }}
                >
                  <FaCheck className="mb-1" /> Konfirmasi Pembayaran
                </Button>
              )}

              {status === "Menunggu Konfirmasi Pesanan" && (
                <>
                  <Button
                    variant="success"
                    onClick={() => {
                      showBahanBakuKurang();
                    }}
                  >
                    <FaCheck className="mb-1" /> Konfirmasi Pesanan
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() => {
                      handleRejectMOItem();
                    }}
                  >
                    <FaX className="mb-1" /> Tolak Pesanan
                  </Button>
                </>
              )}
              {status === "date" && (
                <Button
                  variant="success"
                  onClick={() => {
                    handleConfirmMOProses();
                  }}
                >
                  <FaCheck className="mb-1" /> Lakukan Pemrosesan
                </Button>
              )}
              {status === "ubah" &&
                (selectedNota?.status === "Sedang Diantar Kurir" ||
                  selectedNota?.status === "Sedang Diantar Ojol" ||
                  selectedNota?.status === "Siap Pick Up") && (
                  <Button
                    variant="success"
                    onClick={() => {
                      handleConfirmSelesai();
                    }}
                  >
                    <FaCheck className="mb-1" /> Selesaikan Pesanan
                  </Button>
                )}
              {status === "ubah" &&
                selectedNota?.status === "Sedang Diproses" && (
                  <Button
                    variant="success"
                    onClick={() => {
                      handleSelesaiProses();
                    }}
                  >
                    <FaCheck className="mb-1" /> Selesaikan Proses
                  </Button>
                )}
              <Button variant="secondary" onClick={handleCloseModal}>
                Tutup
              </Button>
            </Modal.Footer>
          )}
        </Modal>
        <Modal show={showGambarModal} onHide={handleCloseGambarModal}>
          <Image src={bukti_bayar} alt="bukti_bayar" />
        </Modal>
        <AddEditModal
          show={showAddEditModal}
          handleClose={handleCloseAddEditModal}
          title="Input Jarak"
          text="Pastikan jarak sudah sesuai dengan radius pesanan"
          onSubmit={onSubmitJarak}
          onHide={() => {
            handleCloseAddEditModal();
            setFormDataJarak({ radius: "" });
          }}
          isLoading={inputJarak.isLoading}
          add={inputJarak}
          validate={validateJarak}
        >
          <Form.Group className="text-start mb-3">
            <Form.Label>Radius (km)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Masukkan radius"
              name="radius"
              value={formDataJarak.radius}
              onChange={inputHelperJarak.handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="text-start mb-3">
            <Form.Label>Ongkos Kirim</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ongkos Kirim"
              name="ongkir"
              value={Formatter.moneyFormatter(
                hitungOngkir(formDataJarak.radius)
              )}
              readOnly
            />
          </Form.Group>
        </AddEditModal>
        <AddEditModal
          show={showAdminModal}
          handleClose={handleCloseAdminModal}
          title="Konfirmasi Pembayaran"
          text="Pastikan pembayaran sudah sesuai"
          onSubmit={onSubmitAdmin}
          onHide={() => {
            handleCloseAdminModal();
            setFormDataAdmin({ tip: 0 });
          }}
          isLoading={inputAdmin.isLoading}
          add={inputAdmin}
          validate={validateAdmin}
        >
          <Image fluid src={bukti_bayar} alt="bukti_bayar" />

          <Form.Group className="text-start mb-3">
            <Form.Label>Tip</Form.Label>
            <Form.Control
              type="number"
              placeholder="Masukkan Tip"
              name="tip"
              value={formDataAdmin.tip}
              onChange={inputHelperAdmin.handleInputChange}
            />
          </Form.Group>
        </AddEditModal>

        <AddEditModal
          show={showBahanBakuModal}
          centered
          size="lg"
          handleClose={handleCloseBahanBakuModal}
          title="Bahan Baku Yang Kurang"
          onSubmit={handleConfirmMOItem}
          onHide={() => {
            handleCloseBahanBakuModal();
          }}
        >
          <Table responsive className="text-start align-middle table-nowrap">
            <thead>
              <tr>
                <th className="th-style">Nama Bahan Baku</th>
                <th className="th-style">Stok Sekarang</th>
                <th
                  className="th-style"
                  style={{ color: "red", fontWeight: "bolder" }}
                >
                  Stok Yang Dibutuhkan
                </th>
              </tr>
            </thead>
            <tbody>
              {listBahanBaku?.map((detail, idx) => (
                <tr key={idx}>
                  <td>{detail.nama_bahan_baku}</td>
                  <td>{detail.stok_sekarang}</td>
                  <td style={{ color: "red", fontWeight: "bolder" }}>
                    {detail.jumlah_dibutuhkan}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </AddEditModal>

        <Modal
          show={showBahanBakuProsesModal}
          centered
          size="lg"
          onHide={() => {
            handleCloseBahanBakuProsesModal();
            setTimeout(() => {
              setListBahanBaku([]);
              setListBahanBakuUsed([]);
            }, 125);
          }}
        >
          <Modal.Body className="text-center p-4 m-2">
            <h5 style={{ fontWeight: "bold" }}>Bahan Baku Yang Terpakai</h5>
            <Table responsive className="text-start align-middle table-nowrap">
              <thead>
                <tr>
                  <th className="th-style">Nama Bahan Baku</th>
                  <th className="th-style">Stok Sekarang</th>
                  <th className="th-style">Stok Yang Terpakai</th>
                </tr>
              </thead>
              <tbody>
                {listBahanBaku?.map((detail, idx) => (
                  <tr key={idx}>
                    <td>{detail.nama_bahan_baku}</td>
                    <td>{detail.stok}</td>
                    <td>{detail.jumlah}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Modal.Body>
        </Modal>

        <Modal
          show={showBothModal}
          centered
          size="lg"
          onHide={() => {
            handleCloseBothModal();
            setTimeout(() => {
              setListBahanBaku([]);
              setListBahanBakuUsed([]);
              setListNotaBerhasil([]);
              setListNotaGagal([]);
            }, 125);
          }}
        >
          <Modal.Body className="text-center p-4 m-2">
            {listBahanBaku.length > 0 && (
              <>
                <h5 style={{ fontWeight: "bold" }}>Bahan Baku Yang Kurang</h5>
                <Table
                  responsive
                  className="text-start align-middle table-nowrap"
                >
                  <thead>
                    <tr>
                      <th className="th-style">Nama Bahan Baku</th>
                      <th className="th-style">Stok Sekarang</th>
                      <th
                        className="th-style"
                        style={{ color: "red", fontWeight: "bolder" }}
                      >
                        Stok Yang Dibutuhkan
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listBahanBaku?.map((detail, idx) => (
                      <tr key={idx}>
                        <td>{detail.nama_bahan_baku}</td>
                        <td>{detail.stok_sekarang}</td>
                        <td style={{ color: "red", fontWeight: "bolder" }}>
                          {detail.jumlah_dibutuhkan}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
            {listBahanBakuUsed.length > 0 && (
              <>
                <h5 style={{ fontWeight: "bold" }}>Bahan Baku Yang Terpakai</h5>
                <Table
                  responsive
                  className="text-start align-middle table-nowrap"
                >
                  <thead>
                    <tr>
                      <th className="th-style">Nama Bahan Baku</th>
                      <th className="th-style">Stok Sekarang</th>
                      <th className="th-style">Stok Yang Terpakai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listBahanBakuUsed?.map((detail, idx) => (
                      <tr key={idx}>
                        <td>{detail.nama_bahan_baku}</td>
                        <td>{detail.stok}</td>
                        <td>{detail.jumlah}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
            {(listBahanBaku.length > 0 || listBahanBakuUsed.length > 0) && (
              <>
                <h5 style={{ fontWeight: "bold" }}>Keterangan</h5>
                {listNotaBerhasil.length > 0 && (
                  <h5 style={{ color: "green" }}>
                    Berhasil diproses : {listNotaBerhasil.join(", ")}
                  </h5>
                )}

                {listNotaGagal.length > 0 && (
                  <h5 style={{ color: "red" }}>
                    Gagal diproses : {listNotaGagal.join(", ")}
                  </h5>
                )}
              </>
            )}
          </Modal.Body>
        </Modal>

        <Modal
          show={showModalRekapHarian}
          centered
          size="xl"
          onHide={() => {
            handleCloseModalRekapHarian();
            setTimeout(() => {
              setDataBahanBaku([]);
              setDataNota([]);
              setDataBahanBakuKeseluruhan([]);
              setDataRekapProduk([]);
              setDataRekapProdukDibuat([]);
            }, 125);
          }}
        >
          <Modal.Body>
            <Container
              className={isLoadingModal ? "" : "border border-dark rounded-1"}
            >
              {isLoadingModal ? (
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
              ) : (
                <>
                  <h4 className="text-center text-bold">List Pesanan Harian</h4>
                  <h5 className="text-center border-dark pb-1">
                    Tanggal : {Formatter.dateFormatter(new Date())}
                  </h5>

                  <Row>
                    <Col
                      xl={6}
                      lg={6}
                      md={12}
                      sm={12}
                      className="border-right border-top border-bottom border-dark"
                    >
                      <h5 className="text-center text-bold pt-2">
                        List Pemesanan
                      </h5>
                      <Table
                        responsive
                        className="text-start align-middle table-nowrap"
                      >
                        <thead>
                          <tr>
                            <th className="th-style">No Nota</th>
                            <th className="th-style">Nama</th>
                            <th className="th-style">Pesanan</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataNota?.map((detail, idx) => (
                            <tr key={idx}>
                              <td>{detail?.no_nota}</td>
                              <td>{detail?.user?.nama}</td>
                              <td>
                                {detail?.detail_transaksi?.map(
                                  (detail, idx) => (
                                    <div key={idx}>
                                      {detail?.jumlah +
                                        " " +
                                        (namaProdukConverter(
                                          detail?.produk?.id_kategori,
                                          detail?.produk?.ukuran,
                                          detail?.produk?.nama_produk
                                        ) ?? detail?.hampers?.nama_hampers)}
                                    </div>
                                  )
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Col>
                    <Col
                      xl={6}
                      lg={6}
                      md={12}
                      sm={12}
                      className="border-top border-bottom border-dark"
                    >
                      <h5 className="text-center text-bold pt-2">Rekap</h5>
                      {dataRekapProduk?.map((detail, idx) => (
                        <div key={idx}>
                          {detail?.jumlah +
                            " " +
                            namaProdukConverter(
                              detail?.id_kategori,
                              detail?.ukuran,
                              detail?.nama
                            )}
                        </div>
                      ))}

                      <h5 className="text-center text-bold border-top border-dark pt-2">
                        Yang Perlu Dibuat
                      </h5>
                      {dataRekapProdukDibuat?.map((detail, idx) => (
                        <div key={idx}>
                          {namaProdukConverterDibuat(
                            detail?.id_kategori,
                            detail?.jumlah,
                            detail?.nama
                          )}
                        </div>
                      ))}
                    </Col>
                    <Col
                      xl={6}
                      lg={6}
                      md={12}
                      sm={12}
                      className="border-right border-dark"
                    >
                      <h5 className="text-center text-bold pt-2">Bahan</h5>
                      {formatData(dataBahanBaku)}
                    </Col>
                    <Col xl={6} lg={6} md={12} sm={12}>
                      <h5 className="text-center text-bold pt-2">
                        Rekap Bahan
                      </h5>
                      {dataBahanBakuKeseluruhan?.map((detail, idx) => {
                        if (
                          detail?.nama_bahan_baku.startsWith("Box") ||
                          detail?.nama_bahan_baku.startsWith("Kartu") ||
                          detail?.nama_bahan_baku.startsWith("Botol") ||
                          detail?.nama_bahan_baku.startsWith("Tas")
                        ) {
                          return null;
                        }
                        return (
                          <div key={idx}>
                            {detail?.total_jumlah_dibutuhkan +
                              " " +
                              detail?.satuan +
                              " " +
                              detail?.nama_bahan_baku}
                            {detail?.stok_sekarang <
                              detail?.total_jumlah_dibutuhkan && (
                              <span style={{ color: "red" }}>
                                {" "}
                                (Warning Stok : {detail?.stok_sekarang}
                                {" " + detail?.satuan})
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </Col>
                  </Row>
                </>
              )}
            </Container>
          </Modal.Body>
        </Modal>
        {modalElement}
      </section>
    </>
  );
}

KonfirmasiPage.propTypes = {
  status: propTypes.string,
};
