import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminHeader from "./components/AdminHeader";
import { AdminProvider } from "./context/AdminContext";
import MainLayout from "./components/MainLayout";
import "@ant-design/v5-patch-for-react-19";

function AppLayout() {
  return (
    <>
      <AdminHeader />
      <Routes>
        <Route path="/" element={<MainLayout />} />
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
