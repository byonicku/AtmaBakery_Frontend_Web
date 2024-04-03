import { Toaster } from 'sonner';
import { Route, Routes } from "react-router-dom";

import Home from './page/Home';
import Login from './page/Login';
import Register from './page/Register';

export default function App() {
  return (
    <>
      <Toaster position="top-center" richColors closeButton />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </>
  )
}