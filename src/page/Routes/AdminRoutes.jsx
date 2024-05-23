import { Route } from "react-router-dom";

import HomeAdmin from "@/page/Admin/Page/Home";
import Produk from "@/page/Admin/Page/Produk/ProdukPage";
import AddEditProdukPage from "@/page/Admin/Page/Produk/AddEditProdukPage";
import Resep from "@/page/Admin/Page/Resep/ResepPage";
import BahanBaku from "@/page/Admin/Page/BahanBaku/BahanBakuPage";
import Karyawan from "@/page/Admin/Page/Karyawan/KaryawanPage";
import Penitip from "@/page/Admin/Page/Penitip/PenitipPage";
import Customer from "@/page/Admin/Page/Customer/CustomerPage";
import HistoryCustomer from "@/page/Admin/Page/Customer/HistoryCustomerPage";
import PengeluaranLain from "@/page/Admin/Page/PengeluaranLain/PengeluaranPage";
import Dashboard from "@/page/Admin/Dashboard";
import HampersPage from "@/page/Admin/Page/Hampers/HampersPage";
import AdminProfile from "@/page/Admin/Page/Profile";
import DashboardRoute from "@/page/Routes/Guards/DashboardRoute";
import RoleRoute from "@/page/Routes/Guards/RoleRoute";
import PembelianBahanBakuPage from "@/page/Admin/Page/PembelianBahanBaku/PembelianBahanBakuPage";
import NotFound404 from "@/page/Admin/Page/NotFound404";
import KonfirmasiPage from "@/page/Admin/Page/KonfirmasiPage";

export default function getAdminRoutes() {
  return (
    <Route
      path="/admin"
      element={
        <DashboardRoute>
          <Dashboard />
        </DashboardRoute>
      }
    >
      <Route
        path="profile"
        element={
          <RoleRoute roles={["ADM", "MO", "OWN"]}>
            <AdminProfile />
          </RoleRoute>
        }
      />
      <Route
        path="produk"
        element={
          <RoleRoute roles={["ADM"]}>
            <Produk />
          </RoleRoute>
        }
      />
      <Route
        path="hampers"
        element={
          <RoleRoute roles={["ADM"]}>
            <HampersPage />
          </RoleRoute>
        }
      />
      <Route
        path="resep"
        element={
          <RoleRoute roles={["ADM"]}>
            <Resep />
          </RoleRoute>
        }
      />
      <Route
        path="bahan_baku"
        element={
          <RoleRoute roles={["ADM"]}>
            <BahanBaku />
          </RoleRoute>
        }
      />
      <Route
        path="karyawan"
        element={
          <RoleRoute roles={["OWN", "MO"]}>
            <Karyawan />
          </RoleRoute>
        }
      />
      <Route
        path="penitip"
        element={
          <RoleRoute roles={["MO"]}>
            <Penitip />
          </RoleRoute>
        }
      />
      <Route
        path="customer"
        element={
          <RoleRoute roles={["ADM"]}>
            <Customer />
          </RoleRoute>
        }
      />
      <Route
        path="customer/history/:id"
        element={
          <RoleRoute roles={["ADM"]}>
            <HistoryCustomer />
          </RoleRoute>
        }
      />
      <Route
        path="pengeluaran_lain"
        element={
          <RoleRoute roles={["MO"]}>
            <PengeluaranLain />
          </RoleRoute>
        }
      />
      <Route
        path="pembelian_bahan_baku"
        element={
          <RoleRoute roles={["MO"]}>
            <PembelianBahanBakuPage />
          </RoleRoute>
        }
      />
      <Route
        path="produk/tambah"
        element={
          <RoleRoute roles={["ADM"]}>
            <AddEditProdukPage isEdit={false} />
          </RoleRoute>
        }
      />
      <Route
        path="produk/edit/:id"
        element={
          <RoleRoute roles={["ADM"]}>
            <AddEditProdukPage isEdit={true} />
          </RoleRoute>
        }
      />
      <Route
        path="input_jarak"
        element={
          <RoleRoute roles={["ADM"]}>
            <KonfirmasiPage status={"Menunggu Perhitungan Ongkir"} />
          </RoleRoute>
        }
      />
      <Route
        path="konfirmasi_pembayaran"
        element={
          <RoleRoute roles={["ADM"]}>
            <KonfirmasiPage status={"Menunggu Konfirmasi Pembayaran"} />
          </RoleRoute>
        }
      />
      <Route
        path="konfirmasi_pesanan"
        element={
          <RoleRoute roles={["MO"]}>
            <KonfirmasiPage status={"Menunggu Konfirmasi Pesanan"} />
          </RoleRoute>
        }
      />
      <Route
        path="konfirmasi_pemrosesan_pesanan"
        element={
          <RoleRoute roles={["MO"]}>
            <KonfirmasiPage status={"date"} />
          </RoleRoute>
        }
      />
      <Route index element={<HomeAdmin />} />
      <Route path="*" element={<NotFound404 />} />
    </Route>
  );
}
