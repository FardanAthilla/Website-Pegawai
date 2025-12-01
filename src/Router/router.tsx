import { Routes, Route } from "react-router-dom";

import Home from "../Page/home";
import SuratKeluar from "../Page/SuratKeluar/suratkeluar";
import SuratMasuk from "../Page/SuratMasuk/suratmasuk";
import NotFound from "../error/error";
import Akun from "../Page/Akun/akun";
import Login from "../Page/login";

import ProtectedRoute from "./protectedroute";
import PublicRoute from "./publicroute";

function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/keluar"
        element={
          <ProtectedRoute>
            <SuratKeluar />
          </ProtectedRoute>
        }
      />

      <Route
        path="/masuk"
        element={
          <ProtectedRoute>
            <SuratMasuk />
          </ProtectedRoute>
        }
      />

      <Route
        path="/akun"
        element={
          <ProtectedRoute>
            <Akun />
          </ProtectedRoute>
        }
      />

      {/* Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;
