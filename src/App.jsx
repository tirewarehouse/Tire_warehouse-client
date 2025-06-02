import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLoginButton from './components/AdminLoginButton';
import { AdminProvider } from './context/AdminContext';
import MainLayout from './components/MainLayout';

function AppLayout() {
  return (
    <>
      <AdminLoginButton />
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
