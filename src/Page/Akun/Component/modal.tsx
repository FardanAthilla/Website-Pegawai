import React from "react";
import { X } from "lucide-react";

interface Props {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    username: string;
    password: string;
    role: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{ username: string; password: string; role: string }>
  >;
  isEdit: boolean;
}

const UserModal: React.FC<Props> = ({
  show,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEdit,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-slate-300 rounded-2xl shadow-2xl max-w-md w-full animate-fade-in">
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-gray-800">
            {isEdit ? "Edit User" : "Tambah User"}
          </h2>
          <button onClick={onClose} className="text-slate-700 hover:text-black transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">

          {/* USERNAME */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
              minLength={4}
              className="
                w-full px-4 py-2 border border-slate-300 rounded-lg 
                focus:border-blue-600 focus:ring focus:ring-blue-200 
                outline-none transition
              "
            />
          </div>

          {/* PASSWORD (hanya saat create) */}
          {!isEdit && (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                minLength={4}
                className="
                  w-full px-4 py-2 border border-slate-300 rounded-lg 
                  focus:border-blue-600 focus:ring focus:ring-blue-200 
                  outline-none transition
                "
              />
            </div>
          )}

          {/* ROLE */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="
                w-full px-4 py-2 border border-slate-300 rounded-lg 
                focus:border-blue-600 focus:ring focus:ring-blue-200 
                outline-none transition
                bg-white
              "
            >
              <option value="pegawai">Pegawai</option>
              <option value="manajer">Manajer</option>
            </select>
          </div>

          {/* BUTTON */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="
                flex-1 bg-blue-600 text-white rounded-lg py-2 
                hover:bg-blue-700 transition font-medium shadow-sm
              "
            >
              {isEdit ? "Update" : "Buat User"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="
                flex-1 bg-red-600 text-white rounded-lg py-2 
                hover:bg-red-700 transition font-medium shadow-sm
              "
            >
              Batal
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UserModal;
