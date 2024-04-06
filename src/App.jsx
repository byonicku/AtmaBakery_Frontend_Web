import { Toaster } from 'sonner';
import { Route, Routes } from "react-router-dom";

import Home from '@/page/Home';
import HomeAdmin from '@/page/Admin/Page/Home';
import Login from '@/page/Auth/Login';
import Register from '@/page/Auth/Register';
import ResetPass from '@/page/Auth/ResetPass';
import Produk from '@/page/Admin/Page/ProdukPage';
import AddEditProdukPage from '@/page/Admin/Page/AddEditProdukPage';
import Penitip from '@/page/Admin/Page/PenitipPage';
import Dashboard from '@/page/Admin/Dashboard';

export default function App() {
  return (
    <>
      <Toaster position="top-center" richColors closeButton />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset" element={<ResetPass />} />
          <Route path="/admin" element={<Dashboard />}>
            <Route path="produk" element={<Produk />} />
            <Route path="penitip" element={<Penitip />} />
            <Route path="produk/tambah" element={<AddEditProdukPage />} />
            <Route path="/admin" element={<HomeAdmin />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}
