import React from "react";
import Sidebar from "../../Components/sidebar";

const Home: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR FIXED / STICKY */}
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>
      <h1 className="text-2xl font-semibold text-gray-700">Halaman Kosong</h1>
    </div>
  );
};

export default Home;
