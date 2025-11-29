import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../API/firebase";

import Sidebar from "../../Components/sidebar";
import { User, Edit2, Trash2, ShieldCheck, Lock, X } from "lucide-react";

interface UserData {
  id: string;
  username: string;
  password: string;
  role: string;
}

const UserManagement: React.FC = () => {
  // DATA LIST
  const [data, setData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  // MODAL
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // FORM
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "pegawai",
  });

  // FETCH DATA USER
  const fetchUsers = async () => {
    try {
      const ref = collection(db, "users");
      const snap = await getDocs(ref);

      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as UserData[];

      setData(list);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // OPEN MODAL TAMBAH
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      username: "",
      password: "",
      role: "pegawai",
    });
    setShowModal(true);
  };

  // OPEN MODAL EDIT
  const handleOpenEdit = (item: UserData) => {
    setEditingId(item.id);
    setFormData({
      username: item.username,
      password: item.password,
      role: item.role,
    });
    setShowModal(true);
  };

  // CLOSE MODAL
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  // CREATE USER
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      alert("Mohon isi username & password");
      return;
    }

    try {
      await addDoc(collection(db, "users"), formData);
      handleCloseModal();
      fetchUsers();
    } catch (err) {
      console.error("Create error:", err);
    }
  };

  // UPDATE USER (password optional)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatePayload = {
      username: formData.username,
      role: formData.role,
      ...(formData.password ? { password: formData.password } : {}), // password optional
    };

    try {
      await updateDoc(doc(db, "users", editingId!), updatePayload);
      handleCloseModal();
      fetchUsers();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // DELETE USER
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus user?")) return;

    try {
      await deleteDoc(doc(db, "users", id));
      fetchUsers();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // UI PAGE
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-1 p-8 min-h-screen overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 mt-10 lg:mt-0">
          <h1 className="text-3xl font-bold text-gray-800">Manajemen User</h1>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Tambah User
          </button>
        </div>

        {/* TABLE WRAPPER */}
        <div className="backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 animate-spin rounded-full"></div>
              <p className="text-slate-300">Memuat data...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <User className="w-14 h-14 text-slate-600" />
              <p className="text-slate-400">Belum ada data user</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="px-4 py-3 text-left text-xs text-gray-600 w-[40px] uppercase">
                      No
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase">
                      Username
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase">
                      Password
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase w-[120px]">
                      Role
                    </th>
                    <th className="px-4 py-3 text-center text-xs text-gray-600 uppercase w-[120px]">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {data.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">{index + 1}</td>

                      <td className="px-4 py-3 flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-500" />
                        {item.username}
                      </td>

                      <td className="px-4 py-3 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-purple-500" />
                        {item.password}
                      </td>

                      <td className="px-4 py-3 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        {item.role}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          {/* EDIT */}
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-2 rounded-lg bg-gray-100 text-amber-600 hover:bg-amber-200"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* DELETE */}
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 rounded-lg bg-gray-100 text-red-600 hover:bg-red-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full">
              {/* HEADER */}
              <div className="flex justify-between items-center p-6 border-b border-slate-700">
                <h2 className="text-xl font-bold">
                  {editingId ? "Edit User" : "Tambah User"}
                </h2>
                <button onClick={handleCloseModal} className="text-slate-900">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* FORM */}
              <form
                onSubmit={editingId ? handleUpdate : handleCreate}
                className="p-6 space-y-4"
              >
                {/* USERNAME */}
                <div>
                  <label className="block text-sm mb-2">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    minLength={4}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:border-blue-500 
      ${
        formData.username.length > 0 && formData.username.length < 4
          ? "border-red-500"
          : "border-slate-600"
      }`}
                  />
                  {formData.username.length > 0 &&
                    formData.username.length < 4 && (
                      <p className="text-red-500 text-xs mt-1">
                        Username minimal 4 karakter
                      </p>
                    )}
                </div>

                {/* PASSWORD → hanya saat create */}
                {!editingId && (
                  <div>
                    <label className="block text-sm mb-2">Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      minLength={4}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:border-blue-500 
        ${
          formData.password.length > 0 && formData.password.length < 4
            ? "border-red-500"
            : "border-slate-600"
        }`}
                    />
                    {formData.password.length > 0 &&
                      formData.password.length < 4 && (
                        <p className="text-red-500 text-xs mt-1">
                          Password minimal 4 karakter
                        </p>
                      )}
                  </div>
                )}

                {/* ROLE */}
                <div>
                  <label className="block text-sm mb-2">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-600 rounded-lg focus:border-blue-500"
                  >
                    <option value="pegawai">Pegawai</option>
                    <option value="manajer">Manajer</option>
                  </select>
                </div>

                {/* BUTTON */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
                  >
                    {editingId ? "Update" : "Buat User"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-red-600 text-slate-100 rounded-lg py-2 hover:bg-red-700"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
