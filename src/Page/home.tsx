import React from "react";
import Sidebar from "../Components/sidebar";

const Home: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>
      <div className="flex-1 p-4 mt-16 lg:mt-0">
        <h1 className="text-2xl font-semibold text-gray-700">Halaman Kosong</h1>
      </div>
    </div>
  );
};

export default Home;
