import { useNavigate, useLocation } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { User, Home, Mail, FileEdit, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "../assets/icon.png";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const [userData, setUserData] = useState<{
    username: string;
    role: string;
  } | null>(null);

  // Ambil user login data dari localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUserData(JSON.parse(stored));
    }
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    if (window.confirm("Apakah kamu yakin ingin keluar?")) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const menu = [
    { label: "Beranda", path: "/", icon: Home },
    { label: "Surat Masuk", path: "/masuk", icon: Mail },
    { label: "Surat Keluar", path: "/keluar", icon: FileEdit },
  ];

  return (
    <>
      {/* 🔹 NAVBAR MOBILE */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white px-4 py-3 shadow flex items-center gap-3">
        <button onClick={() => setOpen(true)}>
          <Bars3Icon className="w-7 h-7 text-gray-700" />
        </button>

        {/* 🔹 LOGO di mobile */}
        <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
        <h1 className="font-semibold text-gray-700 text-lg">SIPENA</h1>
      </div>

      {/* 🔹 OVERLAY MOBILE */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 🔹 SIDEBAR */}
      <aside
        className={`
    fixed top-0 left-0 z-50 w-64 bg-white h-screen shadow-md 
    p-3 pt-5
    transform transition-transform duration-300
    ${open ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0 lg:static lg:pt-3
  `}
      >
        {/* HEADER MOBILE DALAM SIDEBAR */}
        <div className="lg:hidden flex items-center justify-between px-2 mb-5">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
            <h1 className="font-semibold text-gray-800 text-lg">SIPENA</h1>
          </div>

          {/* Tombol X */}
          <button onClick={() => setOpen(false)}>
            <XMarkIcon className="w-7 h-7 text-gray-700" />
          </button>
        </div>

        {/* Logo Desktop */}
        <div className="hidden lg:flex items-center gap-3 py-4 px-2">
          <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
          <div className="text-lg font-bold text-gray-800">SIPENA</div>
        </div>

        {/* Menu Header */}
        <div className="px-5 pt-1 hidden lg:block">
          <div className="text-xs font-bold tracking-wide text-gray-600">
            Menu
          </div>
        </div>

        {/* Menu List */}
        <div className="flex flex-col space-y-1 mt-2">
          {menu.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                navigate(item.path);
                setOpen(false);
              }}
              className={`flex items-center gap-3 px-4 h-12 rounded-md font-semibold transition
                ${
                  isActive(item.path)
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}

          {userData?.role === "manajer" && (
            <button
              onClick={() => {
                navigate("/akun");
                setOpen(false);
              }}
              className={`flex items-center gap-3 px-4 h-12 rounded-md font-semibold transition
                ${
                  isActive("/akun")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <User className="w-5 h-5" />
              <span>Akun</span>
            </button>
          )}
        </div>

        {/* 🔥 LOGOUT BUTTON */}
        <div className="absolute bottom-6 left-4 right-4">
          {/* 🔹 User Info */}
          {userData && (
            <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-800">
                  {userData.username}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {userData.role}
                </div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md shadow"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
