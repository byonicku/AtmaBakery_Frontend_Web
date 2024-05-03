import { Toaster } from "sonner";
import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Home from "@/page/Main/Home";
import TentangKami from "@/page/Main/TentangKami";
import ProdukView from "@/page/Main/ProdukView";
import Pesan from "@/page/Main/Pesan";
import Kontak from "@/page/Main/Kontak";
import HomeAdmin from "@/page/Admin/Page/Home";
import Login from "@/page/Auth/Login";
import Register from "@/page/Auth/Register";
import ResetPass from "@/page/Auth/ResetPass";
import ChangePass from "@/page/Auth/ChangePass";
import Verify from "@/page/Auth/Verify";
import HistoryCustomerPageSelf from "@/page/Main/HistoryCustomerPage";

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
import DashboardRoute from "./page/Routes/DashboardRoute";
import RoleRoute from "./page/Routes/RoleRoute";
import PembelianBahanBakuPage from "./page/Admin/Page/PembelianBahanBaku/PembelianBahanBakuPage";
import ErrorPage from "./page/Main/ErrorPage";
import NotFound404 from "@/page/Admin/Page/NotFound404";

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" richColors duration="3000" />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tentang" element={<TentangKami />} />
            <Route path="/produk" element={<ProdukView />} />
            <Route path="/pesan" element={<Pesan />} />
            <Route path="/kontak" element={<Kontak />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset" element={<ResetPass />} />
            <Route path="/password/:key" element={<ChangePass />} />
            <Route path="/verify/:key" element={<Verify />} />
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
              <Route index element={<HomeAdmin />} />
              <Route path="*" element={<NotFound404 />} />
            </Route>
            <Route
              path="/profile"
              element={
                <RoleRoute roles={["CUST"]}>
                  <Dashboard />
                </RoleRoute>
              }
            >
              <Route path="pemesanan" element={<HistoryCustomerPageSelf />} />
              <Route index element={<AdminProfile />} />
              <Route path="*" element={<NotFound404 />} />
            </Route>
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </main>
      </QueryClientProvider>
    </>
  );
}
