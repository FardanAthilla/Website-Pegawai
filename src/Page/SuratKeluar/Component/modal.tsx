import React from "react";

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute right-3 top-3">
          ❌
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">
          {editId ? "Edit Surat Keluar" : "Tambah Surat Keluar"}
        </h2>

        <form onSubmit={onSubmit} className="space-y-3">
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
            onChange={(e) => setForm({ ...form, perihal: e.target.value })}
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
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md"
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-2 text-white rounded-md ${
                submitting ? "bg-blue-300" : "bg-blue-600"
              }`}
            >
              {submitting ? "Mengirim..." : editId ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalSuratKeluarForm;
