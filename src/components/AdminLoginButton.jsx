// src/components/AdminLoginButton.jsx
import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import AdminLoginModal from './AdminLoginModal';

const AdminLoginButton = () => {
  const { admin, logout } = useAdmin();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="absolute top-4 right-4">
      {admin ? (
        <button
          onClick={logout}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {admin} 로그아웃
        </button>
      ) : (
        <>
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            관리자계정 로그인
          </button>
          {showModal && (
            <AdminLoginModal onClose={() => setShowModal(false)} />
          )}
        </>
      )}
    </div>
  );
};

export default AdminLoginButton;