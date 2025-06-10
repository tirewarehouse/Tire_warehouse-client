import React, { useState } from "react";
import { Form, Input, Button, Modal, notification } from "antd";
import { getCheckCarNumber } from "../../js/api/inventory";

const ModalCarAdd = ({ open, onCancel, onAddCar }) => {
  const [carNumber, setCarNumber] = useState("");
  const [quantity, setQuantity] = useState("0");

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
    });
  };

  const isSubmitDisabled = !carNumber || !quantity;

  const validateCarNumber = () => {
    const cleaned = carNumber.replace(/\s/g, "");
    const regex = /^[0-9]{2}[가-힣]{1}[0-9]{4}$/;
    return regex.test(cleaned);
  };
  const handleCarNumberChange = async () => {
    const cleaned = carNumber.replace(/\s/g, "");

    if (!validateCarNumber(carNumber)) {
      openNotificationWithIcon("error", "차량 추가 실패", "번호판 양식에 맞춰 써 주세요.");
    } else {
      try {
        const res = await getCheckCarNumber({ carNumber: cleaned });
        if (res.exists) {
          openNotificationWithIcon("error", "차량 추가 실패", "이미 등록된 차량입니다.");
        } else {
          onAddCar(cleaned, quantity);
          onCancel();
        }
      } catch (err) {
        console.error("차량 중복 확인 실패:", err);
      }
    }
  };
  return (
    <>
      {contextHolder}
      <Modal title="차량 추가" open={open} onCancel={onCancel} footer={null} width={800}>
        <Form name="carAdd" layout="inline">
          <Form.Item label="차량번호" name="carNumber">
            <Input value={carNumber} onChange={(e) => setCarNumber(e.target.value)} />
          </Form.Item>
          <Form.Item label="수량" name="quantity">
            <Input value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleCarNumberChange} disabled={isSubmitDisabled}>
              추가
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalCarAdd;
