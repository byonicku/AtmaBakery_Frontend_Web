import { Toaster } from "sonner";
import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Home from "@/page/Main/Home";
import HomeAdmin from "@/page/Admin/Page/Home";
import Login from "@/page/Auth/Login";
import Register from "@/page/Auth/Register";
import ResetPass from "@/page/Auth/ResetPass";
import ChangePass from "@/page/Auth/ChangePass";
import Produk from "@/page/Admin/Page/Produk/ProdukPage";
import AddEditProdukPage from "@/page/Admin/Page/Produk/AddEditProdukPage";
import Resep from "@/page/Admin/Page/Resep/ResepPage";
import BahanBaku from "@/page/Admin/Page/BahanBaku/BahanBakuPage";
import Karyawan from "@/page/Admin/Page/Karyawan/KaryawanPage";
import Penitip from "@/page/Admin/Page/Penitip/PenitipPage";
import Dashboard from "@/page/Admin/Dashboard";
import Verify from "@/page/Auth/Verify";
import HampersPage from "@/page/Admin/Page/Hampers/HampersPage";
import AdminProfile from "@/page/Admin/Page/Profile";
import DashboardRoute from "./page/Routes/DashboardRoute";
import RoleRoute from "./page/Routes/RoleRoute";

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" richColors duration="3000" />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
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
            </Route>
          </Routes>
        </main>
      </QueryClientProvider>
    </>
  );
}
