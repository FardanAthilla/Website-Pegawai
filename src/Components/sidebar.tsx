import { useNavigate, useLocation } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { User, Home, Mail, FileEdit } from "lucide-react";
import { useState } from "react";

const menu = [
  { label: "Beranda", path: "/", icon: Home },
  { label: "Surat Masuk", path: "/masuk", icon: Mail },
  { label: "Surat Keluar", path: "/keluar", icon: FileEdit },
  { label: "Akun", path: "/akun", icon: User },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* 🔹 NAVBAR MOBILE */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white px-4 py-3 shadow flex items-center gap-3">
        <button onClick={() => setOpen(true)}>
          <Bars3Icon className="w-7 h-7 text-gray-700" />
        </button>
        <h1 className="font-semibold text-gray-700 text-lg">Website Surat</h1>
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
          fixed top-0 left-0 z-50 w-64 bg-white h-screen shadow-md p-3
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
        `}
      >
        {/* Close (mobile only) */}
        <button
          className="lg:hidden absolute top-4 right-4"
          onClick={() => setOpen(false)}
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Logo Desktop */}
        <div className="hidden lg:flex items-center gap-2 py-4 px-2">
          <div className="text-lg font-bold text-gray-800">Website Surat</div>
        </div>

        {/* Menu Header */}
        <div className="px-5 pt-4 hidden lg:block">
          <div className="text-xs font-bold tracking-wide text-gray-600">
            Menu
          </div>
        </div>

        {/* Menu */}
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
        </div>
      </aside>
    </>
  );
}
