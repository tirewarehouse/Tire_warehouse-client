import React, { useState } from "react";
import { Button, Form, Input, Modal, notification } from "antd";

const ModalAdminAdd = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const showModal = () => {
    setIsModalOpen(true);
  };
  const onClose = () => {
    setIsModalOpen(false);
  };
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
    });
  };
  const onSave = async () => {
    const request = { name, phone, password: "1234" };
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    try {
      const res = await fetch(`${BASE_URL}/api/admin/add-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      const data = await res.json();
      if (data.success) {
        onClose();
        openNotificationWithIcon("success", data.message, "초기 비밀번호는 1234입니다. 수정 후 사용해주세요.");
      } else {
        openNotificationWithIcon("error", data.message, "문의 바랍니다.");
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={showModal}>
        신규관리자
      </Button>
      <Modal
        title="관리자 추가"
        zIndex={1001}
        open={isModalOpen}
        onOk={onClose}
        onCancel={onClose}
        footer={[
          <Button key="save" type="primary" onClick={onSave}>
            추가
          </Button>,
        ]}
      >
        <Form name="basic" labelCol={{ span: 4 }}>
          <Form.Item label="이름" name="name" rules={[{ required: true, message: "이름을 입력하세요" }]}>
            <Input value={name} placeholder="이름" onChange={(e) => setName(e.target.value)} />
          </Form.Item>
          <Form.Item label="휴대폰" name="phone" rules={[{ required: true, message: "010-0000-0000 형식으로 입력하세요" }]}>
            <Input value={phone} maxLength={13} placeholder="010-0000-0000" onChange={(e) => setPhone(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAdminAdd;
