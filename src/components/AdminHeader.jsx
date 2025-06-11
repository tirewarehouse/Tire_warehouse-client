import React, { useEffect, useState, useCallback } from "react";
import { useAdmin } from "../context/AdminContext";
import ModalAdminManagement from "./modal/ModalAdminManagement";
import ModalWarehouse from "./modal/ModalWarehouse";
import ModalLogin from "./modal/ModalLogin";
import { Select } from "antd";
import { getWarehouses } from "../js/api/warehouse";

const AdminHeader = ({ onWarehouseChange }) => {
  const { admin } = useAdmin();
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(localStorage.getItem("selectedWarehouse"));

  const getWarehouseList = async () => {
    getWarehouses().then((data) => {
      setWarehouses(data);
    });
  };

  const handleChangeWarehouse = useCallback((value) => {
    if (value) {
      localStorage.setItem("selectedWarehouse", value);
      setSelectedWarehouse(value);
      onWarehouseChange(value);
    } else {
      const warehouse = localStorage.getItem("selectedWarehouse");
      if (warehouse) {
        setSelectedWarehouse(warehouse);
        onWarehouseChange(warehouse);
      } else {
        setSelectedWarehouse("");
        onWarehouseChange("");
      }
    }
  }, [onWarehouseChange]);

  useEffect(() => {
    getWarehouseList();
    handleChangeWarehouse(selectedWarehouse);
  }, [handleChangeWarehouse, selectedWarehouse]);

  return (
    <>
      <div className="absolute top-4 right-4">
        <Select
          options={warehouses.map((warehouse) => ({ label: warehouse.name, value: warehouse._id }))}
          size="large"
          style={{ width: 150 }}
          locale={{ emptyText: "등록된 창고가 없습니다." }}
          onChange={handleChangeWarehouse}
          value={selectedWarehouse}
        />
        <ModalLogin />
        {admin && (
          <>
            <ModalAdminManagement />
            <ModalWarehouse />
          </>
        )}
      </div>
    </>
  );
};

export default AdminHeader;
