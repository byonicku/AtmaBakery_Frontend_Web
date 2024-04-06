import { Toaster } from 'sonner';
import { Route, Routes } from "react-router-dom";

import Home from '@/page/Home'
import Login from '@/page/Auth/Login';
import Register from '@/page/Auth/Register';
import ResetPass from '@/page/Auth/ResetPass';
import Produk from '@/page/Admin/ProdukPage';
import AddEditProdukPage from '@/page/Admin/AddEditProdukPage';
import Penitip from '@/page/Admin/PenitipPage';
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
          <Route path='/admin' element={<Dashboard/>} />
          <Route path="/admin/produk" element={<Produk/>} />
          <Route path="/admin/penitip" element={<Penitip/>} />
          <Route path="/admin/produk/tambah" element={<AddEditProdukPage />} />
        </Routes>
      </main>
    </>
  )
}