import React, { useState } from "react";
import { useAdmin } from "../context/AdminContext";
import { Button } from "antd";
import AdminLoginModal from "./AdminLoginModal";
import ModalAdminManagement from "./modal/ModalAdminManagement";
import ModalWarehouse from "./modal/ModalWarehouse";

const AdminHeader = () => {
  const { admin, logout } = useAdmin();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="absolute top-4 right-4">
      {admin ? (
        <Button type="primary" size="large" onClick={logout}>
          {admin} 로그아웃
        </Button>
      ) : (
        <>
          <button onClick={() => setShowModal(true)} className="bg-purple-600 text-white px-4 py-2 rounded">
            관리자 로그인
          </button>
          {showModal && <AdminLoginModal onClose={() => setShowModal(false)} />}
        </>
      )}
      <ModalAdminManagement />
      <ModalWarehouse />
    </div>
  );
};

export default AdminHeader;
