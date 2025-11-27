import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../API/firebase";
import Sidebar from "../Components/sidebar";

interface SuratKeluar {
  id: string;
  nomor_surat: string;
  tanggal_surat: string;
  tanggal_terima: string;
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
  // Fungsi Detail
  const openDetailModal = (item: SuratKeluar) => {
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

  // OPEN MODAL ADD
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

  // OPEN MODAL EDIT
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

  // DELETE RECORD + CLOUDINARY
  const handleDelete = async (id: string, publicId?: string) => {
    if (!confirm("Hapus data ini?")) return;

    try {
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }

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
          ...(uploaded && { file_url: uploaded.url }),
          ...(uploaded && { file_public_id: uploaded.publicId }),
        });
      } else {
        await addDoc(collection(db, "suratKeluar"), {
          ...form,
          file_url: uploaded?.url || "",
          file_public_id: uploaded?.publicId || "",
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
            Buat Surat Keluar
          </button>
        </div>

        {/* TABLE */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                  <th className="py-3 px-6 text-left">No</th>
                  <th className="py-3 px-6 text-left">Tanggal Surat</th>
                  <th className="py-3 px-6 text-left">Tujuan Surat</th>
                  <th className="py-3 px-6 text-left">Nomor Surat</th>
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
                      <td className="py-3 px-6">
                        {formatTanggal(item.tanggal_surat)}
                      </td>
                      <td
                        className="py-3 px-6 max-w-[150px] truncate"
                        title={item.tujuan_surat}
                      >
                        {item.tujuan_surat}
                      </td>
                      <td
                        className="py-3 px-6 max-w-[150px] truncate"
                        title={item.nomor_surat}
                      >
                        {item.nomor_surat}
                      </td>
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
            <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
              <button
                onClick={() => setDetailItem(null)}
                className="absolute right-3 top-3"
              >
                ❌
              </button>

              <h2 className="text-xl font-bold mb-4 text-center">
                Detail Surat
              </h2>

              <div className="space-y-2">
                <p>
                  <strong>Tanggal Surat:</strong>{" "}
                  {formatTanggal(detailItem.tanggal_surat)}
                </p>

                <p>
                  <strong>Tujuan Surat:</strong> {detailItem.tujuan_surat}
                </p>
                <p>
                  <strong>Nomor Surat:</strong> {detailItem.nomor_surat}
                </p>
                <p>
                  <strong>Perihal:</strong> {detailItem.perihal}
                </p>
                <p>
                  <strong>File:</strong>
                </p>
                {detailItem.file_url ? (
                  detailItem.file_url.endsWith(".pdf") ? (
                    <iframe
                      src={detailItem.file_url}
                      className="w-full h-64 border rounded-md"
                    ></iframe>
                  ) : (
                    <img
                      src={detailItem.file_url}
                      alt="File Surat"
                      className="w-full h-auto max-h-64 object-contain rounded-md"
                    />
                  )
                ) : (
                  <p>-</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL */}
        {openModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
            <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
              <button
                onClick={() => setOpenModal(false)}
                className="absolute right-3 top-3"
              >
                ❌
              </button>

              <h2 className="text-xl font-bold mb-4 text-center">
                {editId ? "Edit Surat" : "Tambah Surat"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3">
                <label>Tanggal Surat</label>
                <input
                  type="date"
                  value={form.tanggal_surat}
                  onChange={(e) =>
                    setForm({ ...form, tanggal_surat: e.target.value })
                  }
                  className="w-full p-3 border rounded-md"
                  required
                />
                <input
                  type="text"
                  placeholder="Tujuan Surat"
                  value={form.tujuan_surat}
                  onChange={(e) =>
                    setForm({ ...form, tujuan_surat: e.target.value })
                  }
                  className="w-full p-3 border rounded-md"
                  required
                />
                <input
                  type="text"
                  placeholder="Nomor Surat"
                  value={form.nomor_surat}
                  onChange={(e) =>
                    setForm({ ...form, nomor_surat: e.target.value })
                  }
                  className="w-full p-3 border rounded-md"
                  required
                />
                <input
                  type="text"
                  placeholder="Perihal"
                  value={form.perihal}
                  onChange={(e) =>
                    setForm({ ...form, perihal: e.target.value })
                  }
                  className="w-full p-3 border rounded-md"
                  required
                />
                <div>
                  <label>Upload File (PDF/IMG)</label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full p-2 border rounded-md"
                    required={!editId}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setOpenModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded-md"
                    disabled={submitting}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`px-4 py-2 text-white rounded-md ${
                      submitting
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-600"
                    }`}
                  >
                    {submitting ? "Mengirim..." : editId ? "Update" : "Save"}
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

export default SuratKeluar;
