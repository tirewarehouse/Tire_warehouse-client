import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminHeader from "./components/AdminHeader";
import { AdminProvider } from "./context/AdminContext";
import MainLayout from "./components/MainLayout";
import "@ant-design/v5-patch-for-react-19";

function AppLayout() {
  const [selectedWarehouse, setSelectedWarehouse] = useState("");

  const handleWarehouseChange = (warehouse) => {
    setSelectedWarehouse(warehouse);
  };

  return (
    <>
      <AdminHeader onWarehouseChange={handleWarehouseChange} />
      <Routes>
        <Route path="/" element={<MainLayout selectedWarehouse={selectedWarehouse} />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AdminProvider>
  );
}

export default App;
