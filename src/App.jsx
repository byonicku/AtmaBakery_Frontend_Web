import { Toaster } from "sonner";
import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Home from "@/page/Home";
import HomeAdmin from "@/page/Admin/Page/Home";
import Login from "@/page/Auth/Login";
import Register from "@/page/Auth/Register";
import ResetPass from "@/page/Auth/ResetPass";
import ChangePass from "@/page/Auth/ChangePass";
import Produk from "@/page/Admin/Page/Produk/ProdukPage";
import AddEditProdukPage from "@/page/Admin/Page/Produk/AddEditProdukPage";
import BahanBaku from "@/page/Admin/Page/BahanBaku/BahanBakuPage";
import Karyawan from "@/page/Admin/Page/Karyawan/KaryawanPage";
import Penitip from "@/page/Admin/Page/Penitip/PenitipPage";
import Dashboard from "@/page/Admin/Dashboard";
import Verify from "@/page/Auth/Verify";

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
            <Route path="/admin" element={<Dashboard />}>
              <Route path="produk" element={<Produk />} />
              <Route path="bahan_baku" element={<BahanBaku />} />
              <Route path="karyawan" element={<Karyawan />} />
              <Route path="penitip" element={<Penitip />} />
              <Route
                path="produk/tambah"
                element={<AddEditProdukPage isEdit={false} />}
              />
              <Route
                path="produk/edit/:id"
                element={<AddEditProdukPage isEdit={true} />}
              />
              <Route path="/admin" element={<HomeAdmin />} />
            </Route>
          </Routes>
        </main>
      </QueryClientProvider>
    </>
  );
}
