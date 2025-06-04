import React, { useState } from "react";
import { Button, Form, Input, Modal, notification } from "antd";
import { useAdmin } from "../../context/AdminContext";

const ModalAdminPasswordModify = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [beforePassword, setBeforePassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { admin } = useAdmin();

  const onClose = () => {
    setIsModalOpen(false);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
    });
  };
  const onUpdate = async () => {
    const request = { password: beforePassword, newPassword, name: admin };
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    try {
      const res = await fetch(`${BASE_URL}/api/admin/update-admin`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      const data = await res.json();
      if (data.success) {
        onClose();
        openNotificationWithIcon("success", "변경 완료", data.message);
      } else {
        openNotificationWithIcon("error", "변경 실패", data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      {contextHolder}
      <Button onClick={showModal}>비밀번호 변경</Button>
      <Modal
        title="비밀번호 변경"
        open={isModalOpen}
        onCancel={onClose}
        footer={[
          <Button key="update" type="primary" onClick={onUpdate}>
            변경
          </Button>,
        ]}
      >
        <Form name="basic" labelCol={{ span: 4 }}>
          <Form.Item label="변경전" name="beforePassword" rules={[{ required: true, message: "기존 비밀번호를 입력하세요" }]}>
            <Input.Password value={beforePassword} placeholder="기존 비밀번호" onChange={(e) => setBeforePassword(e.target.value)} />
          </Form.Item>
          <Form.Item label="변경후" name="newPassword" rules={[{ required: true, message: "새 비밀번호를 입력하세요" }]}>
            <Input.Password value={newPassword} placeholder="새 비밀번호" onChange={(e) => setNewPassword(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAdminPasswordModify;
