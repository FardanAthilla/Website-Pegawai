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
import ModalSuratDetail from "./Component/detail";
import ModalSuratForm from "./Component/modal";

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
  // Fungsi Detail
  const openDetailModal = (item: SuratMasuk) => {
    setDetailItem(item);
  };

  // UPLOAD CLOUDINARY
  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "surat_masuk_dan_keluar");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dnrmllkys/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();

    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  };

  function formatTanggal(tanggal: string) {
    const date = new Date(tanggal);
    const bulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const hari = date.getDate();
    const namaBulan = bulan[date.getMonth()];
    const tahun = date.getFullYear();
    return `${hari} ${namaBulan} ${tahun}`;
  }

  // HAPUS FILE CLOUDINARY
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
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuratMasuk();
  }, []);

  // OPEN MODAL ADD
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

  // OPEN MODAL EDIT
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

  // DELETE RECORD + CLOUDINARY
  const handleDelete = async (id: string, publicId?: string) => {
    if (!confirm("Hapus data ini?")) return;

    try {
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }

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
        const ref = doc(db, "suratMasuk", editId);

        await updateDoc(ref, {
          ...form,
          ...(uploaded && { file_url: uploaded.url }),
          ...(uploaded && { file_public_id: uploaded.publicId }),
        });
      } else {
        await addDoc(collection(db, "suratMasuk"), {
          ...form,
          file_url: uploaded?.url || "",
          file_public_id: uploaded?.publicId || "",
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

  // RENDER
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR FIXED / STICKY */}
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 min-h-screen p-8 overflow-y-auto">
        <div className="flex justify-end mb-6">
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Buat Surat Masuk
          </button>
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white dark:bg-gray-900">
            <p>Loading</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                  <th className="py-3 px-6 text-left">No</th>
                  <th className="py-3 px-6 text-left">Nomor Surat</th>
                  <th className="py-3 px-6 text-left">Tanggal Surat</th>
                  <th className="py-3 px-6 text-left">Tanggal Terima</th>
                  <th className="py-3 px-6 text-left">Asal Surat</th>
                  <th className="py-3 px-6 text-left">Perihal</th>
                  <th className="py-3 px-6 text-left">File</th>
                  <th className="py-3 px-6 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      Tidak ada data.
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-100">
                      <td className="py-3 px-6">{index + 1}</td>
                      <td
                        className="py-3 px-6 max-w-[150px] truncate"
                        title={item.nomor_surat}
                      >
                        {item.nomor_surat}
                      </td>{" "}
                      <td className="py-3 px-6">
                        {formatTanggal(item.tanggal_surat)}
                      </td>
                      <td className="py-3 px-6">
                        {formatTanggal(item.tanggal_terima)}
                      </td>
                      <td
                        className="py-3 px-6 max-w-[150px] truncate"
                        title={item.asal_surat}
                      >
                        {item.asal_surat}
                      </td>{" "}
                      <td
                        className="py-3 px-6 max-w-[180px] truncate"
                        title={item.perihal}
                      >
                        {item.perihal}
                      </td>
                      <td className="py-3 px-6 text-blue-600">
                        {item.file_url ? (
                          <a href={item.file_url} target="_blank">
                            Lihat File
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={() => openDetailModal(item)}
                            className="text-blue-500 hover:scale-110"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => openEditModal(item)}
                            className="text-blue-500 hover:scale-110"
                          >
                            ✏️
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(item.id, item.file_public_id)
                            }
                            className="text-red-500 hover:scale-110"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
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
