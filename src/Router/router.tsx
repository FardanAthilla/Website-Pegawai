import { Routes, Route } from "react-router-dom";
import Home from "../Page/home";
import SuratKeluar from "../Page/suratkeluar";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/keluar" element={<SuratKeluar />} />
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}

export default AppRouter;
