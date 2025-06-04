import React, { useEffect, useState } from "react";
import { Col, Row, Table } from "antd";
import dayjs from "dayjs";

const HistoriesView = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [histories, setHistories] = useState([]);

  const columns = [
    { title: "회사", dataIndex: "company", key: "company", align: "center", width: "8.3%" },
    { title: "입고일", dataIndex: "dateIn", key: "dateIn", align: "center", render: (text) => new Date(text).toLocaleDateString(), width: "8.3%" },
    { title: "차량번호", dataIndex: "carNumber", key: "carNumber", align: "center", width: "8.3%" },
    { title: "수량", dataIndex: "quantity", key: "quantity", align: "center", width: "8.3%" },
    { title: "타이어종류", dataIndex: "type", key: "type", align: "center", width: "8.3%" },
    { title: "창고", dataIndex: "warehouse", key: "warehouse", align: "center", render: (text) => convertWarehouseName(text), width: "8.3%" },
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
    { title: "출고일", dataIndex: "dateOut", key: "dateOut", align: "center", render: (text) => (text ? new Date(text).toLocaleDateString() : ""), width: "8.3%" },
    { title: "메모", dataIndex: "memo", key: "memo", align: "center", width: "8.3%" },
    { title: "생성자", dataIndex: "creator", key: "creator", align: "center", width: "8.3%" },
    { title: "이력타입", dataIndex: "historyType", key: "historyType", align: "center", render: (text) => convertHistoryType(text), width: "8.3%" },
    { title: "이력일", dataIndex: "createdAt", key: "createdAt", align: "center", render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm"), width: "8.3%" },
  ];

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchWarehouses = async () => {
      const res = await fetch(`${BASE_URL}/api/warehouse/warehouses`);
      const data = await res.json();
      setWarehouses(data);
    };
    const fetchHistories = async () => {
      const res = await fetch(`${BASE_URL}/api/history/histories`);
      const data = await res.json();
      setHistories(data);
    };
    fetchWarehouses();
    fetchHistories();
  }, [BASE_URL]);

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
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-bold">이력 확인</h2>
      <Table size="small" columns={columns} dataSource={histories} rowKey={(record) => record._id} locale={{ emptyText: "등록된 이력이 없습니다." }} />
    </div>
  );
};

export default HistoriesView;
