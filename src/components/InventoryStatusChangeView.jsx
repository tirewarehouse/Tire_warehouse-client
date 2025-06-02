import { useEffect, useState } from 'react';
import { Button, Col, Input, InputNumber, Row, Select, Table } from 'antd';
import LocationWarningModal from './LocationWarningModal';

const InventoryStatusChangeView = ({ onInventoryUpdate }) => {
  const [data, setData] = useState([]);
  const [editedData, setEditedData] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const columns = [
    { title: '차량번호', dataIndex: 'carNumber', key: 'carNumber', render: (_, record) => <Input value={record.carNumber} disabled style={{ width: '120px' }} /> },
    { title: '회사', dataIndex: 'company', key: 'company', render: (_, record) => <Input value={record.company} disabled style={{ width: '120px' }} /> },
    {
      title: '입고일',
      dataIndex: 'dateIn',
      key: 'dateIn',
      render: (_, record) => <input type="date" value={record.dateIn} onChange={(e) => handleChange(record._id, 'dateIn', e.target.value)} />,
    },
    {
      title: '수량',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_, record) => <InputNumber value={record.quantity} min={1} onChange={(value) => handleChangeQuantity(value, record._id)} />,
    },
    {
      title: '타이어',
      dataIndex: 'type',
      key: 'type',
      render: (_, record) => (
        <Select
          className="text-xs border px-1 py-0.5 w-full"
          value={record.type}
          disabled
          onChange={(value) => handleChangeType(value, record._id)}
          options={typeOptions.map((opt) => ({ label: opt.name, value: opt._id }))}
        ></Select>
      ),
    },
    {
      title: '위치',
      dataIndex: 'locations',
      key: 'locations',
      render: (_, record) =>
        _?.map((loc, i) => (
          <Row key={`${loc.x}-${loc.y}-${loc.z}-${i}`}>
            <Col span={8}>
              X:
              <InputNumber value={loc.x} min={1} style={{ width: '50px' }} onChange={(value) => handleChangeLocation(value, loc._id, record, 'x')} />
            </Col>
            <Col span={8}>
              Y:
              <InputNumber value={loc.y} min={1} style={{ width: '50px' }} onChange={(value) => handleChangeLocation(value, loc._id, record, 'y')} />
            </Col>
            <Col span={8}>
              Z:
              <InputNumber value={loc.z} min={1} style={{ width: '50px' }} onChange={(value) => handleChangeLocation(value, loc._id, record, 'z')} />
            </Col>
          </Row>
        )),
    },
    {
      title: '출고일',
      dataIndex: 'dateOut',
      key: 'dateOut',
      render: (_, record) => <input type="date" value={record.dateOut} onChange={(e) => handleChange(record._id, 'dateOut', e.target.value)} />,
    },
    { title: '메모', dataIndex: 'memo', key: 'memo', render: (_, record) => <Input value={record.memo} onChange={(e) => handleChange(record._id, 'memo', e.target.value)} /> },
    {
      title: '저장',
      dataIndex: 'save',
      key: 'save',
      render: (_, record) => (
        <span>
          <Button type="primary" variant="solid" disabled={!hasChanges(record._id)} onClick={() => handleSave(record._id)}>
            저장
          </Button>
          <Button color="danger" variant="solid" onClick={() => handleDelete(record.carNumber)}>
            삭제
          </Button>
        </span>
      ),
    },
  ];

  const BASE_URL = process.env.REACT_APP_API_BASE_URL; // ✅ 추가

  useEffect(() => {
    fetch(`${BASE_URL}/api/search/all`) // ✅ 수정
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setEditedData(
          resData.map((item) => ({
            _id: item._id,
            carNumber: item.carNumber,
            company: item.company,
            dateIn: item.dateIn?.slice(0, 10) || '',
            dateOut: item.dateOut?.slice(0, 10) || '',
            quantity: item.quantity,
            type: item.type,
            locations: item.locations,
            memo: item.memo || '',
          }))
        );
      })
      .catch((err) => console.error('❌ 상태 변경용 데이터 불러오기 실패:', err));

    fetch(`${BASE_URL}/api/options/types`) // ✅ 수정
      .then((res) => res.json())
      .then((data) => setTypeOptions(data))
      .catch((err) => console.error('❌ 타입 옵션 불러오기 실패:', err));
  }, [BASE_URL]);

  const handleChange = (id, field, value) => {
    const newData = [...editedData];
    newData.find((item) => item._id === id)[field] = value;
    setEditedData(newData);
  };
  const handleChangeQuantity = (value, id) => {
    const newData = [...editedData];
    const item = newData.find((item) => item._id === id);
    const beforeValue = item.quantity;
    item.quantity = value;

    if (beforeValue > value) {
      item.locations.pop();
    } else {
      item.locations.push({ x: 1, y: 1, z: 1 });
    }

    setEditedData(newData);
  };
  const handleChangeType = (value, id) => {
    const newData = [...editedData];
    const typeOption = typeOptions.find((item) => item._id === value);
    newData.find((item) => item._id === id).type = typeOption.name;
    setEditedData(newData);
  };
  const handleChangeLocation = (value, id, record, field) => {
    const newData = [...editedData];
    newData.find((item) => item._id === record._id).locations.find((loc) => loc._id === id)[field] = value;

    setEditedData(newData);
  };

  const hasChanges = (id) => {
    const original = data.find((item) => item._id === id);
    const edited = editedData.find((item) => item._id === id);
    return (
      original.dateIn?.slice(0, 10) !== edited.dateIn ||
      original.dateOut?.slice(0, 10) !== edited.dateOut ||
      original.quantity !== Number(edited.quantity) ||
      original.memo !== edited.memo ||
      original.type !== edited.type ||
      original.locations !== edited.locations
    );
  };

  const handleSave = async (id) => {
		const original = data.find((item) => item._id === id)
    const { carNumber, dateIn, dateOut, quantity, type, memo, locations } = editedData.find((item) => item._id === id);
    if (locations.some((loc) => !loc.x || !loc.y || !loc.z)) return;
    try {
      for (const loc of locations) {
				const originalLoc = original.locations.find((oriLoc) => oriLoc._id === loc._id)
				console.log('🚀 ~ handleSave ~ originalLoc:', originalLoc)
				if (originalLoc.x === loc.x && originalLoc.y === loc.y && originalLoc.z === loc.z) {
					continue;
				}
        const res = await fetch(`${BASE_URL}/api/admin/check-location?x=${loc.x}&y=${loc.y}&z=${loc.z}`);
        const data = await res.json();
        if (data.exists) {
          setShowWarningModal(true);
          return;
        }
      }
      try {
        const res = await fetch(`${BASE_URL}/api/admin/update-stock`, {
          // ✅ 수정
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ carNumber, dateIn, dateOut, quantity, type, memo, locations }),
        });

        const result = await res.json();
        alert(result.message);
        if (onInventoryUpdate) onInventoryUpdate();
      } catch (err) {
        alert('❌ 저장 실패');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (carNumber) => {
    const confirmed = window.confirm(`정말 삭제하시겠습니까?\n차량번호: ${carNumber}`);
    if (!confirmed) return;

    try {
      const res = await fetch(`${BASE_URL}/api/admin/delete-stock?carNumber=${carNumber}`, {
        // ✅ 수정
        method: 'DELETE',
      });

      const result = await res.json();
      alert(result.message);

      setData((prev) => prev.filter((item) => item.carNumber !== carNumber));
      setEditedData((prev) => prev.filter((item) => item.carNumber !== carNumber));
      if (onInventoryUpdate) onInventoryUpdate();
    } catch (err) {
      alert('❌ 삭제 실패');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">📦 재고 상태 변경</h2>
      <Table align="center" columns={columns} dataSource={editedData} rowKey={(record) => record._id} />
      {showWarningModal && <LocationWarningModal onClose={() => setShowWarningModal(false)} />}
    </div>
  );
};

export default InventoryStatusChangeView;
