import React, { useEffect, useState } from "react";
import { Button, Modal, notification, Table } from "antd";
import { useAdmin } from "../../context/AdminContext";
import ModalAdminAdd from "./ModalAdminAdd";
import ModalAdminPasswordModify from "./ModalAdminPasswordModify";

const ModalAdminManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const { login, admin } = useAdmin();

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
    });
  };

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const getMembers = async () => {
      if (!isModalOpen || !login) return;
      const res = await fetch(`${BASE_URL}/api/admin/get-admins`);
      const data = await res.json();
      setMembers(data);
    };
    getMembers();
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

  const onDelete = async (name) => {
    const res = await fetch(`${BASE_URL}/api/admin/delete-admin?name=${name}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) {
      setMembers(members.filter((member) => member.name !== name));
      openNotificationWithIcon("success", "삭제 완료", data.message);
    } else {
      openNotificationWithIcon("error", "삭제 실패", data.message);
    }
  };

  const columns = [
    { title: "이름", dataIndex: "name", key: "name", align: "center", width: "30%" },
    { title: "휴대폰", dataIndex: "phone", key: "phone", align: "center", width: "40%" },
    {
      title: "",
      dataIndex: "button",
      key: "button",
      align: "center",
      width: "30%",
      render: (_, record) =>
        admin === "관리자" && (
          <Button size="small" color="red" variant="solid" onClick={() => onDelete(record.name)}>
            삭제
          </Button>
        ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Button className="ml-2" color="cyan" variant="solid" size="large" onClick={showModal}>
        관리자센터
      </Button>
      <Modal
        title="관리자관리"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[admin === "관리자" && <ModalAdminAdd key="addAdmin" />, <ModalAdminPasswordModify key="password" />]}
      >
        <Table size="small" columns={columns} dataSource={members} locale={{ emptyText: "등록된 관리자가 없습니다." }} />
      </Modal>
    </>
  );
};
export default ModalAdminManagement;
