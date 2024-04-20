import { BsGrid, BsGift, BsBox2Heart, BsJournalText } from "react-icons/bs";
import { FaShoppingBasket, FaUserTie, FaUserFriends } from "react-icons/fa";

const MORoute = [
  { to: "/admin", icon: BsGrid, label: "Beranda" },
  { to: "./karyawan", icon: FaUserTie, label: "Karyawan" },
  { to: "./penitip", icon: FaUserFriends, label: "Penitip" },
];

const AdminRoute = [
  { to: "/admin", icon: BsGrid, label: "Beranda" },
  { to: "./produk", icon: BsGift, label: "Produk" },
  { to: "./resep", icon: FaShoppingBasket, label: "Resep" },
  { to: "./bahan_baku", icon: BsJournalText, label: "Bahan Baku" },
  { to: "./hampers", icon: BsBox2Heart, label: "Hampers" },
];

const OwnerRoute = [
  { to: "/admin", icon: BsGrid, label: "Beranda" },
  { to: "./karyawan", icon: FaUserTie, label: "Karyawan" },
];

const EmptyRoute = [{ to: "/admin", icon: BsGrid, label: "Beranda" }];

const RouteData = {
  MO: MORoute,
  ADM: AdminRoute,
  OWN: OwnerRoute,
  EMP: EmptyRoute,
};

export default RouteData;
