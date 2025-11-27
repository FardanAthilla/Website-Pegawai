import { useNavigate, useLocation } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const menu = [
  { label: "Surat Masuk", path: "/", icon: "📝" },
  { label: "Surat Keluar", path: "/keluar", icon: "✉️" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Logo */}
      <div className="flex justify-start items-center gap-2 py-4 px-4">
        <div className="h-10 rounded-lg text-lg flex items-center justify-center text-Black font-bold">
          Website Surat
        </div>
      </div>

      {/* Menu Header */}
      <div className="px-5 pt-2 hidden lg:block">
        <div className="text-xs font-bold tracking-wide text-gray-600">
          Menu
        </div>
      </div>

      {/* Menu List */}
      <div className="flex flex-col space-y-1 mx-1 mt-2 flex-grow">
        {menu.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              navigate(item.path);
              setOpen(false);
            }}
            className={`flex items-center gap-3 h-12 rounded-md px-4 font-semibold cursor-pointer transition
              ${
                isActive(item.path)
                  ? "bg-blue-100 text-blue-500 shadow-sm"
                  : "text-gray-500 hover:text-blue-400"
              }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm lg:text-base">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 h-screen shadow-md p-2 transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static`}
      >
        {/* Close button mobile */}
        <button
          className="lg:hidden absolute top-4 right-4"
          onClick={() => setOpen(false)}
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <SidebarContent />
      </aside>
    </>
  );
}
