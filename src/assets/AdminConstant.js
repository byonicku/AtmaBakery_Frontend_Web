import { BsGrid, BsGift, BsBox2Heart, BsJournalText,   } from 'react-icons/bs';
import { FaShoppingBasket, FaUserTie, FaUserFriends  } from "react-icons/fa";

const MORoute = [
  { to: "/admin", icon: BsGrid, label: "Beranda" },
  { to: "./produk", icon: BsGift, label: "Produk" },
  { to: "./hampers", icon: BsBox2Heart, label: "Hampers" },
  { to: "./resep", icon: FaShoppingBasket, label: "Resep" },
  { to: "./bahan_baku", icon: BsJournalText, label: "Bahan Baku" },
  { to: "./karyawan", icon: FaUserTie, label: "Karyawan" },
  { to: "./penitip", icon: FaUserFriends, label: "Penitip" },
  { to: "./template", icon: BsJournalText, label: "Template" },
];

const RouteData = {
    'MO' : MORoute,
}

export default RouteData;