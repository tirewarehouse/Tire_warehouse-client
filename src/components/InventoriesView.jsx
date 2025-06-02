import { Col, Row, Table } from 'antd';
import React, { useState, useEffect } from 'react';

const columns = [
  { title: '회사', dataIndex: 'company', key: 'company' },
  { title: '입고일', dataIndex: 'dateIn', key: 'dateIn', render: (text) => new Date(text).toLocaleDateString() },
  { title: '차량번호', dataIndex: 'carNumber', key: 'carNumber' },
  { title: '수량', dataIndex: 'quantity', key: 'quantity' },
  { title: '타이어 종류', dataIndex: 'type', key: 'type' },
  {
    title: '위치',
    dataIndex: 'locations',
    key: 'locations',
    render: (text) =>
      text?.map((loc, i) => (
				<Row key={`${loc.x}-${loc.y}-${loc.z}-${i}`}>
					<Col span={8}>X: {loc.x}</Col>
					<Col span={8}>Y: {loc.y}</Col>
					<Col span={8}>Z: {loc.z}</Col>
				</Row>
      )),
  },
  { title: '출고일', dataIndex: 'dateOut', key: 'dateOut', render: (text) => text ? new Date(text).toLocaleDateString() : '' },
  { title: '메모', dataIndex: 'memo', key: 'memo' },
];

const InventoryList = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/api/search/all`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('서버 응답 실패');
        }
        return res.json();
      })
      .then((resData) => setData(resData))
      .catch((err) => {
        console.error('데이터 불러오기 실패:', err);
        setError('재고 정보를 불러오는 데 실패했습니다.');
      });
  }, [BASE_URL]);

  return (
    <div>
			<h2 className="text-2xl font-bold">재고 리스트 확인</h2>
      {error ? (
        <div className="bg-red-100 text-red-600 p-4 mb-4 rounded shadow">
          {error} <br /> (Failed to fetch)
        </div>
      ) : (
        <Table align="center" columns={columns} dataSource={data} rowKey={(record) => record._id} />
      )}
    </div>
  );
};

export default InventoryList;
