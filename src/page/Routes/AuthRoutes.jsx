import { Route } from "react-router-dom";

import Login from "@/page/Auth/Login";
import Register from "@/page/Auth/Register";
import ResetPass from "@/page/Auth/ResetPass";
import ChangePass from "@/page/Auth/ChangePass";
import Verify from "@/page/Auth/Verify";

export default function getAuthRoutes() {
  return (
    <>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="reset" element={<ResetPass />} />
      <Route path="password/:key" element={<ChangePass />} />
      <Route path="verify/:key" element={<Verify />} />
    </>
  );
}
