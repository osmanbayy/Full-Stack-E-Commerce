import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Finance from "./pages/Finance";
import HeroSlides from "./pages/HeroSlides";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";

export const backendUrl = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");
export const currency = '₺';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
                <Route path="/finance" element={<Finance token={token} />} />
                <Route path="/hero-slides" element={<HeroSlides token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
