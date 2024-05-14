import { Route } from "react-router-dom";

import Home from "@/page/Main/Home";
import TentangKami from "@/page/Main/TentangKami";
import ProdukView from "@/page/Main/ProdukView";
import Pesan from "@/page/Main/Pesan";
import Kontak from "@/page/Main/Kontak";

import Wrapper from "@/page/Main/Wrapper";
import ErrorPage from "../Main/ErrorPage";
import ProdukDetail from "../Main/ProdukDetail";
import HampersDetail from "../Main/HampersDetail";

export default function getPublicRoutes() {
  return (
    <Route path="/" element={<Wrapper />}>
      <Route path="tentang" element={<TentangKami />} />
      <Route path="produk" element={<ProdukView />} />
      <Route path="produk/:id" element={<ProdukDetail />} />
      <Route path="produk/hampers/:id" element={<HampersDetail />} />
      <Route path="pesan" element={<Pesan />} />
      <Route path="kontak" element={<Kontak />} />
      <Route index element={<Home />} />
      <Route path="*" element={<ErrorPage />} />
    </Route>
  );
}
