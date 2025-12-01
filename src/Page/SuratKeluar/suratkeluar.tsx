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
import ModalSuratKeluarForm from "./Component/modal";
import ModalSuratKeluarDetail from "./Component/detail";
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

interface SuratKeluar {
  id: string;
  nomor_surat: string;
  tanggal_surat: string;
  tujuan_surat: string;
  perihal: string;
  file_url?: string;
  file_public_id?: string;
}

const SuratKeluar: React.FC = () => {
  const [data, setData] = useState<SuratKeluar[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    nomor_surat: "",
    tanggal_surat: "",
    tujuan_surat: "",
    perihal: "",
  });
  const [detailItem, setDetailItem] = useState<SuratKeluar | null>(null);

  // DETAIL
  const openDetailModal = (item: SuratKeluar) => {
    setDetailItem(item);
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

  const formatTanggal = (tanggal: string) => {
    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // DELETE FROM CLOUDINARY
  const deleteFromCloudinary = async (publicId: string) => {
    await fetch(`https://api.cloudinary.com/v1_1/dtzkbcloy/delete_by_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_id: publicId }),
    });
  };

  // FETCH
  const fetchSuratKeluar = async () => {
    try {
      const ref = collection(db, "suratKeluar");
      const snapshot = await getDocs(ref);
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as SuratKeluar[];

      setData(list);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuratKeluar();
  }, []);

  // ADD MODAL
  const openAddModal = () => {
    setEditId(null);
    setForm({
      nomor_surat: "",
      tanggal_surat: "",
      tujuan_surat: "",
      perihal: "",
    });
    setFile(null);
    setOpenModal(true);
  };

  // EDIT MODAL
  const openEditModal = (item: SuratKeluar) => {
    setEditId(item.id);
    setForm({
      nomor_surat: item.nomor_surat,
      tanggal_surat: item.tanggal_surat,
      tujuan_surat: item.tujuan_surat,
      perihal: item.perihal,
    });
    setFile(null);
    setOpenModal(true);
  };

  // DELETE
  const handleDelete = async (id: string, publicId?: string) => {
    if (!confirm("Hapus data ini?")) return;

    try {
      if (publicId) await deleteFromCloudinary(publicId);
      await deleteDoc(doc(db, "suratKeluar", id));
      fetchSuratKeluar();
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
        const ref = doc(db, "suratKeluar", editId);
        await updateDoc(ref, {
          ...form,
          ...(uploaded && {
            file_url: uploaded.url,
            file_public_id: uploaded.publicId,
          }),
        });
      } else {
        await addDoc(collection(db, "suratKeluar"), {
          ...form,
          file_url: uploaded?.url || "",
          file_public_id: uploaded?.publicId || "",
          created_at: serverTimestamp(),
        });
      }

      setOpenModal(false);
      fetchSuratKeluar();
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // UI START
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <Sidebar />
      <div className="flex flex-col flex-1 min-h-screen p-8 overflow-y-auto">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 mt-10 lg:mt-0 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Surat Keluar</h1>

          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition w-full lg:w-auto"
          >
            Buat Surat Keluar
          </button>
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
                Tidak ada data surat keluar
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto relative">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="px-6 py-4 text-left text-gray-600 uppercase text-xs">
                      No
                    </th>
                    <th className="px-6 py-4 text-left text-gray-600 uppercase text-xs">
                      Tanggal
                    </th>
                    <th className="px-6 py-4 text-left text-gray-600 uppercase text-xs">
                      Tujuan
                    </th>
                    <th className="px-6 py-4 text-left text-gray-600 uppercase text-xs">
                      Nomor Surat
                    </th>
                    <th className="px-6 py-4 text-left text-gray-600 uppercase text-xs">
                      Perihal
                    </th>
                    <th className="px-6 py-4 text-left text-gray-600 uppercase text-xs">
                      File
                    </th>
                    <th className="px-6 py-4 text-center text-gray-600 uppercase text-xs">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {data.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 text-gray-800">{index + 1}</td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-800">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          {formatTanggal(item.tanggal_surat)}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-800">
                          <MapPin className="w-4 h-4 text-purple-500" />
                          <span className="block max-w-[100px] truncate whitespace-nowrap">
                            {item.tujuan_surat}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-emerald-500" />
                          <code className="text-gray-800 bg-gray-100 px-2 py-1 rounded block max-w-[100px] truncate whitespace-nowrap">
                            {item.nomor_surat}
                          </code>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-800">
                          <BookOpen className="w-4 h-4 text-amber-500" />
                          <span className="block max-w-[100px] truncate whitespace-nowrap">
                            {item.perihal}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {item.file_url ? (
                          <a
                            href={item.file_url}
                            target="_blank"
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg border border-blue-300 hover:bg-blue-200 transition"
                          >
                            <FileText className="w-4 h-4" />
                            Lihat
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
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

        {/* MODALS */}
        {detailItem && (
          <ModalSuratKeluarDetail
            item={detailItem}
            onClose={() => setDetailItem(null)}
            formatTanggal={formatTanggal}
          />
        )}

        {openModal && (
          <ModalSuratKeluarForm
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

export default SuratKeluar;
