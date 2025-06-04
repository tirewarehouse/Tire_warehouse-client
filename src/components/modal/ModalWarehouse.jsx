import React, { useEffect, useState } from "react";
import { Button, Input, Modal, notification, Table } from "antd";
import { useAdmin } from "../../context/AdminContext";
import { PlusOutlined } from "@ant-design/icons";

const ModalWarehouse = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { login } = useAdmin();
  const [api, contextHolder] = notification.useNotification();

  const columns = [
    {
      title: "창고명",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: "20%",
      render: (text, record, index) => <Input value={text} onChange={(e) => onChangeName(e.target.value, record, index)} />,
    },
    {
      title: "주소",
      dataIndex: "address",
      key: "address",
      align: "center",
      width: "35%",
      render: (text, record, index) => <Input value={text} onChange={(e) => onChangeAddress(e.target.value, record, index)} />,
    },
    {
      title: "메모",
      dataIndex: "memo",
      key: "memo",
      align: "center",
      width: "35%",
      render: (text, record, index) => <Input value={text} onChange={(e) => onChangeMemo(e.target.value, record, index)} />,
    },
    {
      title: "",
      dataIndex: "button",
      key: "button",
      align: "center",
      width: "10%",
      render: (_, record, index) => (
        <Button color="blue" variant="solid" size="small" onClick={() => onSave(record, index)}>
          저장
        </Button>
      ),
    },
  ];

  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
    });
  };

  const onChangeName = (value, record, index) => {
    setWarehouses(warehouses.map((item, i) => (i === index ? { ...item, name: value } : item)));
  };

  const onChangeAddress = (value, record, index) => {
    setWarehouses(warehouses.map((item, i) => (i === index ? { ...item, address: value } : item)));
  };

  const onChangeMemo = (value, record, index) => {
    setWarehouses(warehouses.map((item, i) => (i === index ? { ...item, memo: value } : item)));
  };

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const getWarehouses = async () => {
      if (!isModalOpen || !login) return;
      const res = await fetch(`${BASE_URL}/api/warehouse/warehouses`);
      const data = await res.json();
      setWarehouses(data);
    };
    getWarehouses();
  }, [isModalOpen, login, BASE_URL]);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onSave = async (record, index) => {
    console.log("🚀 ~ onSave ~ index:", index);
    if (record._id) {
      const res = await fetch(`${BASE_URL}/api/warehouse/warehouses/${record._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      const data = await res.json();
      if (data.success) {
        openNotificationWithIcon("success", data.message, "창고 정보가 수정되었습니다.");
      } else {
        openNotificationWithIcon("error", data.message, "문의 바랍니다.");
      }
    } else {
      const res = await fetch(`${BASE_URL}/api/warehouse/warehouses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(warehouses[index]),
      });
      const data = await res.json();
      if (data.success) {
        openNotificationWithIcon("success", data.message, "창고 정보가 등록되었습니다.");
      } else {
        openNotificationWithIcon("error", data.message, "문의 바랍니다.");
      }
    }
  };
  const addRow = () => {
    setWarehouses([...warehouses, { name: "", address: "", memo: "" }]);
  };
  return (
    <>
      {contextHolder}
      <Button className="ml-2" color="magenta" variant="solid" size="large" onClick={showModal}>
        창고 관리
      </Button>
      <Modal title="창고 관리" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={1000} keyboard={false} footer={null}>
        <Button icon={<PlusOutlined />} onClick={addRow}>
          추가
        </Button>
        <Table size="small" columns={columns} dataSource={warehouses} locale={{ emptyText: "등록된 창고가 없습니다." }} />
      </Modal>
    </>
  );
};

export default ModalWarehouse;
