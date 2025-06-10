import React from "react";
import { useAdmin } from "../context/AdminContext";
import ModalAdminManagement from "./modal/ModalAdminManagement";
import ModalWarehouse from "./modal/ModalWarehouse";
import ModalLogin from "./modal/ModalLogin";

const AdminHeader = () => {
  const { admin } = useAdmin();

  return (
    <div className="absolute top-4 right-4">
      <ModalLogin />
      {admin && (
        <>
          <ModalAdminManagement />
          <ModalWarehouse />
        </>
      )}
    </div>
  );
};

export default AdminHeader;
