import React, { useEffect, useState } from "react";
import { Button, Input, Modal, notification, Table } from "antd";
import { useAdmin } from "../../context/AdminContext";
import { PlusOutlined } from "@ant-design/icons";
import { getWarehouses, postWarehouse, putWarehouse } from "../../js/api/warehouse";

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

  useEffect(() => {
    const getWarehouse = async () => {
      if (!isModalOpen || !login) return;
      getWarehouses().then((data) => setWarehouses(data));
    };
    getWarehouse();
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
  const onSave = async (record, index) => {
    if (record._id) {
      const res = await putWarehouse(record._id, record);
      if (res.success) {
        openNotificationWithIcon("success", res.message, "창고 정보가 수정되었습니다.");
      } else {
        openNotificationWithIcon("error", res.message, "문의 바랍니다.");
      }
    } else {
      const res = await postWarehouse(warehouses[index]);
      if (res.success) {
        openNotificationWithIcon("success", res.message, "창고 정보가 등록되었습니다.");
      } else {
        openNotificationWithIcon("error", res.message, "문의 바랍니다.");
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
        <Table size="small" columns={columns} dataSource={warehouses} locale={{ emptyText: "등록된 창고가 없습니다." }} rowKey={(record, index) => `warehouse-${index}`} />
      </Modal>
    </>
  );
};

export default ModalWarehouse;
