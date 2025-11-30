import React from "react";

interface ModalSuratFormProps {
  editId: string | null;
  submitting: boolean;
  form: {
    nomor_surat: string;
    tanggal_surat: string;
    tanggal_terima: string;
    asal_surat: string;
    perihal: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      nomor_surat: string;
      tanggal_surat: string;
      tanggal_terima: string;
      asal_surat: string;
      perihal: string;
    }>
  >;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ModalSuratForm: React.FC<ModalSuratFormProps> = ({
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
      <div className="bg-white border border-slate-300 rounded-2xl shadow-2xl max-w-md w-full relative p-6">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-600 hover:text-black transition"
        >
          ❌
        </button>

        {/* TITLE */}
        <h2 className="text-xl font-bold text-center mb-4 text-gray-800">
          {editId ? "Edit Surat" : "Tambah Surat"}
        </h2>

        {/* FORM */}
        <form onSubmit={onSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Nomor Surat"
            value={form.nomor_surat}
            onChange={(e) => setForm({ ...form, nomor_surat: e.target.value })}
            className="w-full p-3 border border-slate-300 rounded-lg"
            required
          />

          <label className="block text-sm font-medium text-gray-700">Tanggal Surat</label>
          <input
            type="date"
            value={form.tanggal_surat}
            onChange={(e) =>
              setForm({ ...form, tanggal_surat: e.target.value })
            }
            className="w-full p-3 border border-slate-300 rounded-lg"
            required
          />

          <label className="block text-sm font-medium text-gray-700">Tanggal Terima</label>
          <input
            type="date"
            value={form.tanggal_terima}
            onChange={(e) =>
              setForm({ ...form, tanggal_terima: e.target.value })
            }
            className="w-full p-3 border border-slate-300 rounded-lg"
            required
          />

          <input
            type="text"
            placeholder="Asal Surat"
            value={form.asal_surat}
            onChange={(e) => setForm({ ...form, asal_surat: e.target.value })}
            className="w-full p-3 border border-slate-300 rounded-lg"
            required
          />

          <input
            type="text"
            placeholder="Perihal"
            value={form.perihal}
            onChange={(e) => setForm({ ...form, perihal: e.target.value })}
            className="w-full p-3 border border-slate-300 rounded-lg"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload File (PDF/IMG)
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full p-2 border border-slate-300 rounded-lg"
              required={!editId}
            />
          </div>

          {/* BUTTONS — sudah sama seperti Surat Keluar */}
          <div className="flex gap-3 pt-3">
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

export default ModalSuratForm;
