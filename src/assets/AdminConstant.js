import { BsGrid, BsGift, BsBox2Heart, BsJournalText } from "react-icons/bs";
import {
  FaShoppingBasket,
  FaUserTie,
  FaUserFriends,
  FaShoppingCart,
  FaFileInvoice,
  FaUsers,
  FaWallet,
  FaHome,
  FaBell,
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
];

const AdminRoute = [
  { to: "/admin", icon: BsGrid, label: "Beranda" },
  { to: "./produk", icon: BsGift, label: "Produk" },
  { to: "./resep", icon: FaShoppingBasket, label: "Resep" },
  { to: "./bahan_baku", icon: BsJournalText, label: "Bahan Baku" },
  { to: "./hampers", icon: BsBox2Heart, label: "Hampers" },
  { to: "./customer", icon: FaUsers, label: "Customer" },
];

const OwnerRoute = [
  { to: "/admin", icon: BsGrid, label: "Beranda" },
  { to: "./karyawan", icon: FaUserTie, label: "Karyawan" },
];

const CustomerRoute = [
  { to: "./dompet", icon: FaWallet, label: "Dompet Saya" },
  { to: "./alamat", icon: FaHome, label: "Alamat Pengiriman Saya" },
  { to: "./notifikasi", icon: FaBell, label: "Notifikasi Saya" },
  { to: "./pemesanan", icon: FaShoppingBasket, label: "Pemesanan Saya" },
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
