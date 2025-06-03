import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import { useAdmin } from "../../context/AdminContext";

const ModalAdminManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const { login } = useAdmin();

  useEffect(() => {
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const getMembers = async () => {
      if (!isModalOpen || !login) return;
      const res = await fetch(`${BASE_URL}/api/admin/get-admin`);
      const data = await res.json();
      setMembers(data);
    };
    getMembers();
  }, [isModalOpen, login]);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    { title: "이름", dataIndex: "name", key: "name" },
    { title: "휴대폰", dataIndex: "phone", key: "phone" },
    {
      title: "",
      dataIndex: "button",
      key: "button",
      render: () => (
        <Button size="small" color="red" variant="solid">
          삭제
        </Button>
      ),
    },
  ];

  return (
    <>
      <Button className="ml-2" color="cyan" variant="solid" size="large" onClick={showModal}>
        관리자관리
      </Button>
      <Modal
        title="관리자관리"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[<Button type="primary">신규등록</Button>]}
      >
        <Table size="small" columns={columns} dataSource={members} />
      </Modal>
    </>
  );
};
export default ModalAdminManagement;
