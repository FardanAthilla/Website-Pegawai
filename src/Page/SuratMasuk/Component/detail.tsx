import React from "react";

interface SuratMasuk {
  id: string;
  nomor_surat: string;
  tanggal_surat: string;
  tanggal_terima: string;
  asal_surat: string;
  perihal: string;
  file_url?: string;
}

interface ModalSuratDetailProps {
  item: SuratMasuk;
  onClose: () => void;
  formatTanggal: (t: string) => string;
}

const ModalSuratDetail: React.FC<ModalSuratDetailProps> = ({
  item,
  onClose,
  formatTanggal,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute right-3 top-3">
          ❌
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Detail Surat</h2>

        <div className="space-y-2">
          <p>
            <strong>Nomor Surat:</strong> {item.nomor_surat}
          </p>
          <p>
            <strong>Tanggal Surat:</strong> {formatTanggal(item.tanggal_surat)}
          </p>
          <p>
            <strong>Tanggal Terima:</strong>{" "}
            {formatTanggal(item.tanggal_terima)}
          </p>
          <p>
            <strong>Asal Surat:</strong> {item.asal_surat}
          </p>
          <p>
            <strong>Perihal:</strong> {item.perihal}
          </p>

          <p className="font-semibold">File:</p>
          {item.file_url ? (
            item.file_url.endsWith(".pdf") ? (
              <iframe
                src={item.file_url}
                className="w-full h-64 border rounded-md"
              ></iframe>
            ) : (
              <img
                src={item.file_url}
                alt="File Surat"
                className="w-full max-h-64 object-contain rounded-md"
              />
            )
          ) : (
            <p>-</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalSuratDetail;
