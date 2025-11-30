import React from "react";
import { X } from "lucide-react";

interface ModalSuratKeluarFormProps {
  editId: string | null;
  submitting: boolean;
  form: {
    nomor_surat: string;
    tanggal_surat: string;
    tujuan_surat: string;
    perihal: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      nomor_surat: string;
      tanggal_surat: string;
      tujuan_surat: string;
      perihal: string;
    }>
  >;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ModalSuratKeluarForm: React.FC<ModalSuratKeluarFormProps> = ({
  editId,
  submitting,
  form,
  setForm,
  setFile,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-slate-300 rounded-2xl shadow-2xl max-w-md w-full relative">
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-gray-800">
            {editId ? "Edit Surat Keluar" : "Tambah Surat Keluar"}
          </h2>

          <button
            onClick={onClose}
            className="text-slate-600 hover:text-black transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {/* Tanggal Surat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Surat
            </label>
            <input
              type="date"
              value={form.tanggal_surat}
              onChange={(e) =>
                setForm({ ...form, tanggal_surat: e.target.value })
              }
              className="
                w-full px-4 py-2 border border-slate-300 rounded-lg 
                focus:border-blue-600 focus:ring focus:ring-blue-200 
                outline-none transition
              "
              required
            />
          </div>

          {/* Tujuan Surat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tujuan Surat
            </label>
            <input
              type="text"
              placeholder="Tujuan Surat"
              value={form.tujuan_surat}
              onChange={(e) =>
                setForm({ ...form, tujuan_surat: e.target.value })
              }
              className="
                w-full px-4 py-2 border border-slate-300 rounded-lg 
                focus:border-blue-600 focus:ring focus:ring-blue-200 
                outline-none transition
              "
              required
            />
          </div>

          {/* Nomor Surat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor Surat
            </label>
            <input
              type="text"
              placeholder="Nomor Surat"
              value={form.nomor_surat}
              onChange={(e) =>
                setForm({ ...form, nomor_surat: e.target.value })
              }
              className="
                w-full px-4 py-2 border border-slate-300 rounded-lg 
                focus:border-blue-600 focus:ring focus:ring-blue-200 
                outline-none transition
              "
              required
            />
          </div>

          {/* Perihal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Perihal
            </label>
            <input
              type="text"
              placeholder="Perihal"
              value={form.perihal}
              onChange={(e) => setForm({ ...form, perihal: e.target.value })}
              className="
                w-full px-4 py-2 border border-slate-300 rounded-lg 
                focus:border-blue-600 focus:ring focus:ring-blue-200 
                outline-none transition
              "
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File (PDF/IMG)
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required={!editId}
              className="
                w-full px-3 py-2 border border-slate-300 rounded-lg 
                bg-white 
                focus:border-blue-600 focus:ring focus:ring-blue-200 
                outline-none transition
              "
            />
          </div>

          {/* BUTTON */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="
      flex-1 bg-blue-600 text-white rounded-lg py-2 
      hover:bg-blue-700 transition font-medium shadow-sm
      disabled:bg-blue-300
    "
            >
              {submitting ? "Mengirim..." : editId ? "Update" : "Simpan"}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
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

export default ModalSuratKeluarForm;
