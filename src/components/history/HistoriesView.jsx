import React, { useEffect, useState, useCallback } from "react";
import { Button, Col, notification, Row, Table } from "antd";
import dayjs from "dayjs";
import { useAdmin } from "../../context/AdminContext";
import { deleteHistory, getHistories, putHistory } from "../../js/api/history";

const HistoriesView = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [histories, setHistories] = useState([]);
  const { admin } = useAdmin();

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message,
      description,
    });
  };

  const columns = [
    { title: "회사", dataIndex: "company", key: "company", align: "center", width: "7.6%" },
    { title: "입고일", dataIndex: "dateIn", key: "dateIn", align: "center", render: (text) => new Date(text).toLocaleDateString(), width: "7.6%" },
    { title: "차량번호", dataIndex: "carNumber", key: "carNumber", align: "center", width: "7.6%" },
    { title: "수량", dataIndex: "quantity", key: "quantity", align: "center", width: "7.6%" },
    { title: "타이어종류", dataIndex: "type", key: "type", align: "center", width: "7.6%" },
    { title: "창고", dataIndex: "warehouse", key: "warehouse", align: "center", render: (text) => convertWarehouseName(text), width: "7.6%" },
    {
      title: "위치",
      dataIndex: "locations",
      key: "locations",
      align: "center",
      render: (text) =>
        text?.map((loc, i) => (
          <Row key={`${loc.x}-${loc.y}-${loc.z}-${i}`}>
            <Col span={8}>X: {loc.x}</Col>
            <Col span={8}>Y: {loc.y}</Col>
            <Col span={8}>Z: {loc.z}</Col>
          </Row>
        )),
    },
    { title: "출고일", dataIndex: "dateOut", key: "dateOut", align: "center", render: (text) => (text ? new Date(text).toLocaleDateString() : ""), width: "7.6%" },
    { title: "메모", dataIndex: "memo", key: "memo", align: "center", width: "7.6%" },
    { title: "생성자", dataIndex: "creator", key: "creator", align: "center", width: "7.6%" },
    { title: "이력타입", dataIndex: "historyType", key: "historyType", align: "center", render: (text) => convertHistoryType(text), width: "7.6%" },
    { title: "이력일", dataIndex: "createdAt", key: "createdAt", align: "center", render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm"), width: "7.6%" },
    {
      title: "",
      dataIndex: "rollback",
      key: "rollback",
      align: "center",
      render: (_, record) => (
        <span>
          <Button size="small" color="orange" variant="solid" onClick={() => handleRollback(record._id)}>
            원복
          </Button>
          <Button size="small" color="red" variant="solid" onClick={() => handleDelete(record._id)}>
            삭제
          </Button>
        </span>
      ),
      width: "7.6%",
    },
  ];

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchHistories = useCallback(async () => {
    const data = await getHistories();
    setHistories(data);
  }, []);

  useEffect(() => {
    const fetchWarehouses = async () => {
      const res = await fetch(`${BASE_URL}/api/warehouse/warehouses`);
      const data = await res.json();
      setWarehouses(data);
    };
    fetchWarehouses();
    fetchHistories();
  }, [BASE_URL, fetchHistories]);

  const convertWarehouseName = (id) => {
    return warehouses.find((w) => w._id === id)?.name;
  };
  const convertHistoryType = (value) => {
    if (value === "NEW") {
      return "신규";
    } else if (value === "UPDATE") {
      return "수정";
    } else if (value === "DELETE") {
      return "삭제";
    } else if (value === "ROLLBACK") {
      return "원복";
    }
  };

  const handleRollback = async (id) => {
    try {
      const data = await putHistory(id, { creator: admin });
      if (data.success) {
        openNotificationWithIcon("success", data.message, "데이터가 원복 되었습니다.");
        fetchHistories();
      } else {
        openNotificationWithIcon("error", data.message, "문의 바랍니다.");
      }
    } catch (err) {
      openNotificationWithIcon("error", err.message, "문의 바랍니다.");
    }
  };
  const handleDelete = async (id) => {
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmed) return;
    const data = await deleteHistory(id);
    if (data.success) {
      openNotificationWithIcon("success", data.message, "데이터가 삭제 되었습니다.");
      fetchHistories();
    } else {
      openNotificationWithIcon("error", data.message, "문의 바랍니다.");
    }
  };
  return (
    <>
      {contextHolder}
      <div>
        <h2 className="text-2xl font-bold">이력 확인</h2>
        <Table size="small" columns={columns} dataSource={histories} rowKey={(record) => record._id} scroll={{ y: 60 * 10 }} locale={{ emptyText: "등록된 이력이 없습니다." }} />
      </div>
    </>
  );
};

export default HistoriesView;
