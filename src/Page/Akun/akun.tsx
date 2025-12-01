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
import { User, Edit2, Trash2, ShieldCheck, Lock } from "lucide-react";
import UserModal from "./Component/modal";

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
        <div className="flex items-center justify-between mb-8 mt-10 lg:mt-0">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-800">Manajemen Akun</h1>
          </div>
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
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="px-4 py-3 text-left text-xs text-gray-600 w-14 uppercase">
                      No
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase">
                      Username
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase">
                      Password
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase w-28">
                      Role
                    </th>
                    <th className="px-4 py-3 text-center text-xs text-gray-600 uppercase w-28">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {data.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-500" />
                          <span>{item.username}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-purple-500" />
                          <span>{item.password}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3 capitalize">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-green-500" />
                          <span>{item.role}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-2 rounded-lg bg-gray-100 text-amber-600 hover:bg-amber-200"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

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

        <div className="flex items-center justify-between mb-8 mt-6 lg:mt-4">
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            Tambah User
          </button>
        </div>

        <UserModal
          show={showModal}
          onClose={handleCloseModal}
          onSubmit={editingId ? handleUpdate : handleCreate}
          formData={formData}
          setFormData={setFormData}
          isEdit={!!editingId}
        />
      </div>
    </div>
  );
};

export default UserManagement;
