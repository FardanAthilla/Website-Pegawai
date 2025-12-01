import React, { useEffect, useState } from "react";
import Sidebar from "../Components/sidebar";
import { db } from "../API/firebase";
import { collection, getDocs } from "firebase/firestore";
import { TrendingUp, Send, Users } from "lucide-react";

const Home = () => {
  const [jumlahSuratMasuk, setJumlahSuratMasuk] = useState(0);
  const [jumlahSuratKeluar, setJumlahSuratKeluar] = useState(0);
  const [jumlahUser, setJumlahUser] = useState(0);
  const [loading, setLoading] = useState(true);
  const [aktivitas, setAktivitas] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const smSnap = await getDocs(collection(db, "suratMasuk"));
      const skSnap = await getDocs(collection(db, "suratKeluar"));
      const usSnap = await getDocs(collection(db, "users"));

      setJumlahSuratMasuk(smSnap.size);
      setJumlahSuratKeluar(skSnap.size);
      setJumlahUser(usSnap.size);

      // Ambil data + beri penanda asal
      const aktivitasList: any[] = [];

      smSnap.forEach((doc) => {
        aktivitasList.push({
          id: doc.id,
          ...doc.data(),
          jenis: "surat masuk",
        });
      });

      skSnap.forEach((doc) => {
        aktivitasList.push({
          id: doc.id,
          ...doc.data(),
          jenis: "surat keluar",
        });
      });

      // Sort berdasarkan created_at terbaru
      aktivitasList.sort((a, b) => {
        const t1 = a.created_at?.toDate?.() ?? new Date(0);
        const t2 = b.created_at?.toDate?.() ?? new Date(0);
        return t2.getTime() - t1.getTime();
      });

      // Ambil hanya 5 aktivitas terbaru
      setAktivitas(aktivitasList.slice(0, 5));

      setLoading(false);
    };

    fetchData();
  }, []);

  interface StatCardProps {
    label: string;
    value: number;
    icon: React.ElementType;
    bgColor: string;
    iconBg: string;
  }

  const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    icon: Icon,
    bgColor,
  }) => (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
      <div className="relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-sm font-medium tracking-wide">
              {label}
            </p>
            <div className={`p-3 rounded-xl ${bgColor} shadow-md`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>

          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
            {loading ? (
              <div className="h-10 bg-gray-200 rounded animate-pulse w-20" />
            ) : (
              value
            )}
          </h2>
        </div>
      </div>
    </div>
  );

  const timeAgo = (date: Date) => {
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000;

    if (diff < 60) return `${Math.floor(diff)} detik lalu`;
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    return `${Math.floor(diff / 86400)} hari lalu`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR tetap dari project-mu */}
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-col flex-1 overflow-hidden p-8 mt-16 lg:mt-0">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>

        {/* STATS SECTION */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Ringkasan Surat
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Statistik pengiriman surat terkini
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              label="Surat Masuk"
              value={jumlahSuratMasuk}
              icon={TrendingUp}
              bgColor="bg-blue-600"
              iconBg="bg-blue-600"
            />

            <StatCard
              label="Surat Keluar"
              value={jumlahSuratKeluar}
              icon={Send}
              bgColor="bg-emerald-600"
              iconBg="bg-emerald-600"
            />

            <StatCard
              label="Total Pengguna"
              value={jumlahUser}
              icon={Users}
              bgColor="bg-purple-600"
              iconBg="bg-purple-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Aktivitas Terbaru */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Aktivitas Terbaru
            </h3>

            <div className="space-y-3">
              {aktivitas.length === 0 && (
                <p className="text-sm text-gray-500">Belum ada aktivitas.</p>
              )}

              {aktivitas.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.jenis === "surat masuk"
                        ? "bg-blue-500"
                        : "bg-green-500"
                    }`}
                  />

                  <div>
                    <p className="text-sm text-gray-700 font-medium">
                      {item.jenis === "surat masuk"
                        ? "Surat Masuk baru ditambahkan"
                        : "Surat Keluar baru ditambahkan"}
                    </p>

                    <p className="text-xs text-gray-500">
                      Perihal:{" "}
                      {item.perihal
                        ? item.perihal.length > 30
                          ? item.perihal.slice(0, 30) + "..."
                          : item.perihal
                        : "-"}
                    </p>
                  </div>

                  <span className="text-xs text-gray-400 ml-auto">
                    {item.created_at?.toDate
                      ? timeAgo(item.created_at.toDate())
                      : "–"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
