import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/icon.png";
import ilustrasi from "../assets/ilustrasi.png";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../API/firebase";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError("");

  if (!username || !password) {
    setError("Username dan password wajib diisi.");
    return;
  }

  setLoading(true);

  try {
    // Cari user di Firestore
    const q = query(
      collection(db, "users"),
      where("username", "==", username),
      where("password", "==", password)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      setError("Username atau password salah.");
      return;
    }

    // Ambil user pertama
    const userData = snap.docs[0].data();

    localStorage.setItem(
      "user",
      JSON.stringify({
        id: snap.docs[0].id,
        username: userData.username,
        role: userData.role,
      })
    );

    console.log("Login berhasil");

    navigate("/");
  } catch (err) {
    console.error("Login error:", err);
    setError("Terjadi kesalahan.");
  } finally {
    setLoading(false);
  }
};


  return (
  <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">

    {/* LEFT ILLUSTRATION (Hanya muncul di Desktop) */}
    <div className="hidden md:flex items-center justify-center bg-blue-600 p-10">
      <img
        src={ilustrasi} 
        alt="Ilustrasi"
        className="max-w-md w-full"
      />
    </div>

    {/* RIGHT FORM */}
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <img src={logo} alt="SIPENA" className="h-32 mx-auto" />
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Masuk</h1>
          <p className="text-gray-500">Selamat datang di SIPENA</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-sm font-bold">!</span>
              </div>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Username */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Username
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Masukkan username Anda"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl
                  focus:outline-none focus:border-blue-500 focus:bg-white text-gray-900"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password Anda"
                className="w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl
                  focus:outline-none focus:border-blue-500 focus:bg-white text-gray-900"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
              disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl
              shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Masuk</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  </div>
);

};

export default Login;
