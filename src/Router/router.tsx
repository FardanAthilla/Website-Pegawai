import { Routes, Route } from "react-router-dom";
import Home from "../Page/home";
import SuratKeluar from "../Page/SuratKeluar/suratkeluar";
import SuratMasuk from "../Page/SuratMasuk/suratmasuk";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/keluar" element={<SuratKeluar />} />
      <Route path="/masuk" element={<SuratMasuk />} />
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}

export default AppRouter;
