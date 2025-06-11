import React, { useState, useEffect } from "react";
import { Col, Row, Table } from "antd";
import { getSearchWarehouseInventory } from "../../js/api/search";
import { getCompanies, getTypes } from "../../js/api/options";

const InventoriesView = ({ selectedWarehouse }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);

  const columns = [
    {
      title: "회사",
      dataIndex: "company",
      key: "company",
      align: "center",
      render: (value) => convertCompanyName(value),
      filters: companies.map((company) => ({ text: company.name, value: company._id })),
      onFilter: (value, record) => record.company === value,
    },
    { title: "입고일", dataIndex: "dateIn", key: "dateIn", align: "center", render: (text) => new Date(text).toLocaleDateString() },
    { title: "차량번호", dataIndex: "carNumber", key: "carNumber", align: "center" },
    { title: "수량", dataIndex: "quantity", key: "quantity", align: "center" },
    {
      title: "타이어 종류",
      dataIndex: "type",
      key: "type",
      align: "center",
      render: (value) => convertTypeName(value),
      filters: typeOptions.map((type) => ({ text: type.name, value: type._id })),
      onFilter: (value, record) => record.type === value,
    },
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
    { title: "출고일", dataIndex: "dateOut", key: "dateOut", align: "center", render: (text) => (text ? new Date(text).toLocaleDateString() : "") },
    { title: "메모", dataIndex: "memo", key: "memo", align: "center" },
  ];

  useEffect(() => {
    getSearchWarehouseInventory(selectedWarehouse)
      .then((data) => setData(data))
      .catch((err) => {
        console.error("데이터 불러오기 실패:", err);
        setError("재고 정보를 불러오는 데 실패했습니다.");
      });

    getCompanies()
      .then((data) => setCompanies(data))
      .catch((err) => console.error("❌ 회사 옵션 불러오기 실패:", err));

    getTypes()
      .then((data) => setTypeOptions(data))
      .catch((err) => console.error("❌ 타입 옵션 불러오기 실패:", err));
  }, [selectedWarehouse]);

  const convertCompanyName = (id) => {
    const company = companies.find((item) => item._id === id);
    const companyName = companies.find((item) => item.name === id);
    return company ? company.name : companyName ? companyName.name : id;
  };

  const convertTypeName = (id) => {
    const type = typeOptions.find((item) => item._id === id);
    return type ? type.name : id;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">재고 리스트 확인</h2>
      {error ? (
        <div className="bg-red-100 text-red-600 p-4 mb-4 rounded shadow">
          {error} <br /> (Failed to fetch)
        </div>
      ) : (
        <Table
          id="printArea"
          size="small"
          columns={columns}
          dataSource={data}
          rowKey={(record) => record._id}
          scroll={{ y: 60 * 10 }}
          locale={{ emptyText: "등록된 재고가 없습니다." }}
        />
      )}
    </div>
  );
};

export default InventoriesView;
