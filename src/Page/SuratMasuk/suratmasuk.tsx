import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../API/firebase";
import Sidebar from "../../Components/sidebar";

import ModalSuratDetail from "./Component/detail";
import ModalSuratForm from "./Component/modal";

import {
  Eye,
  Edit2,
  Trash2,
  FileText,
  Calendar,
  MapPin,
  Hash,
  BookOpen,
} from "lucide-react";

interface SuratMasuk {
  id: string;
  nomor_surat: string;
  tanggal_surat: string;
  tanggal_terima: string;
  asal_surat: string;
  perihal: string;
  file_url?: string;
  file_public_id?: string;
}

const SuratMasuk: React.FC = () => {
  const [data, setData] = useState<SuratMasuk[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    nomor_surat: "",
    tanggal_surat: "",
    tanggal_terima: "",
    asal_surat: "",
    perihal: "",
  });

  const [detailItem, setDetailItem] = useState<SuratMasuk | null>(null);

  // OPEN DETAIL MODAL
  const openDetailModal = (item: SuratMasuk) => {
    setDetailItem(item);
  };

  // FORMAT TANGGAL
  const formatTanggal = (tanggal: string) => {
    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // CLOUDINARY UPLOAD
  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "surat_masuk_dan_keluar");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dnrmllkys/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();
    return { url: data.secure_url, publicId: data.public_id };
  };

  // DELETE CLOUDINARY
  const deleteFromCloudinary = async (publicId: string) => {
    await fetch(`https://api.cloudinary.com/v1_1/dtzkbcloy/delete_by_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_id: publicId }),
    });
  };

  // FETCH DATA
  const fetchSuratMasuk = async () => {
    try {
      const ref = collection(db, "suratMasuk");
      const snapshot = await getDocs(ref);
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as SuratMasuk[];

      setData(list);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuratMasuk();
  }, []);

  // OPEN ADD MODAL
  const openAddModal = () => {
    setEditId(null);
    setForm({
      nomor_surat: "",
      tanggal_surat: "",
      tanggal_terima: "",
      asal_surat: "",
      perihal: "",
    });
    setFile(null);
    setOpenModal(true);
  };

  // OPEN EDIT MODAL
  const openEditModal = (item: SuratMasuk) => {
    setEditId(item.id);
    setForm({
      nomor_surat: item.nomor_surat,
      tanggal_surat: item.tanggal_surat,
      tanggal_terima: item.tanggal_terima,
      asal_surat: item.asal_surat,
      perihal: item.perihal,
    });
    setFile(null);
    setOpenModal(true);
  };

  // DELETE DOCUMENT
  const handleDelete = async (id: string, publicId?: string) => {
    if (!confirm("Hapus data ini?")) return;

    try {
      if (publicId) await deleteFromCloudinary(publicId);
      await deleteDoc(doc(db, "suratMasuk", id));
      fetchSuratMasuk();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // SUBMIT FORM
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let uploaded = null;
      if (file) uploaded = await uploadToCloudinary(file);

      if (editId) {
        await updateDoc(doc(db, "suratMasuk", editId), {
          ...form,
          ...(uploaded && {
            file_url: uploaded.url,
            file_public_id: uploaded.publicId,
          }),
        });
      } else {
        await addDoc(collection(db, "suratMasuk"), {
          ...form,
          file_url: uploaded?.url || "",
          file_public_id: uploaded?.publicId || "",
          created_at: serverTimestamp()
        });
      }

      setOpenModal(false);
      fetchSuratMasuk();
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // RENDER UI
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 min-h-screen p-8 overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8 mt-10 lg:mt-0">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-800">Surat Masuk</h1>
          </div>
        </div>

        {/* TABLE */}
        <div className="backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-slate-300">Memuat data...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <FileText className="w-14 h-14 text-slate-600" />
              <p className="text-slate-400 text-lg">
                Tidak ada data surat masuk
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="px-4 py-3 text-left text-gray-600 uppercase text-xs w-[40px]">
                      No
                    </th>
                    <th className="px-4 py-3 text-left text-gray-600 uppercase text-xs w-[130px]">
                      Nomor Surat
                    </th>
                    <th className="px-4 py-3 text-left text-gray-600 uppercase text-xs w-[180px]">
                      Tgl Surat
                    </th>
                    <th className="px-4 py-3 text-left text-gray-600 uppercase text-xs w-[180px]">
                      Tgl Terima
                    </th>
                    <th className="px-4 py-3 text-left text-gray-600 uppercase text-xs w-[130px]">
                      Asal
                    </th>
                    <th className="px-4 py-3 text-left text-gray-600 uppercase text-xs w-[130px]">
                      Perihal
                    </th>
                    <th className="px-4 py-3 text-left text-gray-600 uppercase text-xs w-[120px]">
                      File
                    </th>
                    <th className="px-4 py-3 text-center text-gray-600 uppercase text-xs w-[120px]">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {data.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-gray-800">{index + 1}</td>

                      {/* NOMOR SURAT */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-gray-800">
                          <Hash className="w-4 h-4 text-emerald-500" />
                          <code className="bg-gray-100 px-2 py-1 rounded block max-w-[80px] truncate">
                            {item.nomor_surat}
                          </code>
                        </div>
                      </td>

                      {/* TGL SURAT */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-gray-800 whitespace-nowrap">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          {formatTanggal(item.tanggal_surat)}
                        </div>
                      </td>

                      {/* TGL TERIMA */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-gray-800 whitespace-nowrap">
                          <Calendar className="w-4 h-4 text-purple-500" />
                          {formatTanggal(item.tanggal_terima)}
                        </div>
                      </td>

                      {/* ASAL */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-gray-800">
                          <MapPin className="w-4 h-4 text-indigo-500" />
                          <span className="block max-w-[80px] truncate overflow-hidden text-ellipsis whitespace-nowrap">
                            {item.asal_surat}
                          </span>
                        </div>
                      </td>

                      {/* PERIHAL */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-gray-800">
                          <BookOpen className="w-4 h-4 text-amber-500" />
                          <span className="block max-w-[80px] truncate overflow-hidden text-ellipsis whitespace-nowrap">
                            {item.perihal}
                          </span>
                        </div>
                      </td>

                      {/* FILE */}
                      <td className="px-4 py-3">
                        {item.file_url ? (
                          <a
                            href={item.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg border border-blue-300 hover:bg-blue-200 transition"
                          >
                            <FileText className="w-4 h-4" />
                            Lihat
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>

                      {/* ACTION */}
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => openDetailModal(item)}
                            className="p-2 rounded-lg bg-gray-100 text-sky-600 hover:bg-sky-100 hover:text-sky-700"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => openEditModal(item)}
                            className="p-2 rounded-lg bg-gray-100 text-amber-600 hover:bg-amber-100 hover:text-amber-700"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(item.id, item.file_public_id)
                            }
                            className="p-2 rounded-lg bg-gray-100 text-red-600 hover:bg-red-100 hover:text-red-700"
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
            onClick={openAddModal}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Buat Surat Masuk
          </button>
        </div>

        {/* MODALS */}
        {detailItem && (
          <ModalSuratDetail
            item={detailItem}
            onClose={() => setDetailItem(null)}
            formatTanggal={formatTanggal}
          />
        )}

        {openModal && (
          <ModalSuratForm
            editId={editId}
            submitting={submitting}
            form={form}
            setForm={setForm}
            file={file}
            setFile={setFile}
            onClose={() => setOpenModal(false)}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default SuratMasuk;
