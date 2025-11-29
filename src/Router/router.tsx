import { Routes, Route } from "react-router-dom";
import Home from "../Page/home";
import SuratKeluar from "../Page/SuratKeluar/suratkeluar";
import SuratMasuk from "../Page/SuratMasuk/suratmasuk";
import NotFound from "../error/error";
import Akun from "../Page/Akun/akun";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/keluar" element={<SuratKeluar />} />
      <Route path="/masuk" element={<SuratMasuk />} />
      <Route path="/akun" element={<Akun />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;
