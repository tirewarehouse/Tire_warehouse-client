import React, { useState } from "react";
import { Button, Modal, Form, Input, notification } from "antd";
import { postLogin } from "../../js/api/admin";
import { useAdmin } from "../../context/AdminContext";

const ModalLogin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const { admin, logout, login } = useAdmin();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const onClose = () => {
    setIsModalOpen(false);
    setId("");
    setPassword("");
  };
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
    });
  };
  const onLogin = async () => {
    const request = { id, password };
    const data = await postLogin(request);
    if (data.success) {
      openNotificationWithIcon("success", data.message, "로그인 성공");
      onClose();
      login(data.name);
      setId("");
      setPassword("");
    } else {
      openNotificationWithIcon("error", data.message, "로그인 실패");
    }
  };
  const [form] = Form.useForm();
  const onFinish = (values) => {
    setId(values.id);
    setPassword(values.password);
    onLogin();
  };
  return (
    <>
      {contextHolder}
      {admin ? (
        <Button className="ml-2" type="primary" size="large" onClick={logout}>
          {admin} 로그아웃
        </Button>
      ) : (
        <Button className="ml-2" type="primary" size="large" onClick={showModal}>
          관리자 로그인
        </Button>
      )}
      <Modal
        title="관리자 로그인"
        open={isModalOpen}
        onOk={onClose}
        onCancel={onClose}
        footer={[
          <Button key="login" type="primary" onClick={onLogin}>
            로그인
          </Button>,
        ]}
      >
        <Form form={form} onFinish={onFinish} labelCol={{ span: 4 }}>
          <Form.Item name="id" label="아이디" rules={[{ required: true, message: "아이디를 입력해주세요." }]}>
            <Input value={id} onChange={(e) => setId(e.target.value)} />
          </Form.Item>
          <Form.Item name="password" label="비밀번호" rules={[{ required: true, message: "비밀번호를 입력해주세요." }]}>
            <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalLogin;
