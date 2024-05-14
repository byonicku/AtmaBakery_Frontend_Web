import { Route } from "react-router-dom";

import Home from "@/page/Main/Home";
import TentangKami from "@/page/Main/TentangKami";
import ProdukView from "@/page/Main/ProdukView";
import Kontak from "@/page/Main/Kontak";

import Wrapper from "@/page/Main/Wrapper";
import ErrorPage from "@/page/Main/ErrorPage";
import ProdukDetail from "@/page/Main/ProdukDetail";
import HampersDetail from "@/page/Main/HampersDetail";
import Keranjang from "@/page/Main/Keranjang";
import RoleRoute from "./Guards/RoleRoute";

export default function getPublicRoutes() {
  return (
    <Route path="/" element={<Wrapper />}>
      <Route path="tentang" element={<TentangKami />} />
      <Route path="produk" element={<ProdukView />} />
      <Route path="produk/:id" element={<ProdukDetail />} />
      <Route path="produk/hampers/:id" element={<HampersDetail />} />
      <Route
        path="keranjang"
        element={
          <RoleRoute roles={["CUST"]}>
            <Keranjang />
          </RoleRoute>
        }
      />
      <Route path="kontak" element={<Kontak />} />
      <Route index element={<Home />} />
      <Route path="*" element={<ErrorPage />} />
    </Route>
  );
}
