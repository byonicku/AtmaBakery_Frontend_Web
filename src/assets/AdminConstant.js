import { BsGrid, BsGift, BsBox2Heart, BsJournalText } from "react-icons/bs";
import {
  FaShoppingBasket,
  FaUserTie,
  FaUserFriends,
  FaShoppingCart,
  FaFileInvoice,
  FaUsers,
  FaHome,
  FaBell,
  FaLocationArrow,
  FaCheckDouble,
} from "react-icons/fa";

const MORoute = [
  { to: "/admin", icon: BsGrid, label: "Beranda" },
  { to: "./karyawan", icon: FaUserTie, label: "Karyawan" },
  { to: "./penitip", icon: FaUserFriends, label: "Penitip" },
  {
    to: "./pembelian_bahan_baku",
    icon: FaShoppingCart,
    label: "Pembelian Bahan Baku",
  },
  { to: "./pengeluaran_lain", icon: FaFileInvoice, label: "Pengeluaran Lain" },
  {
    to: "./konfirmasi_pesanan",
    icon: FaShoppingBasket,
    label: "Konfirmasi Pesanan",
  },
  {
    to: "./konfirmasi_pemrosesan_pesanan",
    icon: FaCheckDouble,
    label: "Pemrosesan Pesanan",
  },
];

const AdminRoute = [
  { to: "/admin", icon: BsGrid, label: "Beranda" },
  { to: "./produk", icon: BsGift, label: "Produk" },
  { to: "./resep", icon: FaShoppingBasket, label: "Resep" },
  { to: "./bahan_baku", icon: BsJournalText, label: "Bahan Baku" },
  { to: "./hampers", icon: BsBox2Heart, label: "Hampers" },
  { to: "./customer", icon: FaUsers, label: "Customer" },
  { to: "./input_jarak", icon: FaLocationArrow, label: "Input Jarak" },
  {
    to: "./konfirmasi_pembayaran",
    icon: FaFileInvoice,
    label: "Konfirmasi Pembayaran",
  },
  {
    to: "./ubah_status_pesanan",
    icon: FaBell,
    label: "Ubah Status Pesanan",
  },
];

const OwnerRoute = [
  { to: "/admin", icon: BsGrid, label: "Beranda" },
  { to: "./karyawan", icon: FaUserTie, label: "Karyawan" },
];

const CustomerRoute = [
  { to: "./notifikasi", icon: FaBell, label: "Notifikasi" },
  { to: "./alamat", icon: FaHome, label: "Alamat Pengiriman" },
  { to: "./pemesanan", icon: FaShoppingBasket, label: "Pemesanan" },
];

const EmptyRoute = [{ to: "/admin", icon: BsGrid, label: "Beranda" }];

const RouteData = {
  MO: MORoute,
  ADM: AdminRoute,
  OWN: OwnerRoute,
  CUST: CustomerRoute,
  EMP: EmptyRoute,
};

export default RouteData;
