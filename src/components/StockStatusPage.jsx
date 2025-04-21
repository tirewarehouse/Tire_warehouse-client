import React, { useEffect, useState } from 'react';

const StockStatusPage = ({ onInventoryUpdate }) => {
  const [data, setData] = useState([]);
  const [editedData, setEditedData] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);

  const BASE_URL = process.env.REACT_APP_API_BASE_URL; // ✅ 추가

  useEffect(() => {
    fetch(`${BASE_URL}/api/search/all`) // ✅ 수정
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setEditedData(
          resData.map((item) => ({
            carNumber: item.carNumber,
            dateIn: item.dateIn?.slice(0, 10) || '',
            dateOut: item.dateOut?.slice(0, 10) || '',
            quantity: item.quantity,
            type: item.type,
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

  const handleChange = (index, field, value) => {
    const newData = [...editedData];
    newData[index][field] = value;
    setEditedData(newData);
  };

  const hasChanges = (index) => {
    const original = data[index];
    const edited = editedData[index];
    return (
      original.dateIn?.slice(0, 10) !== edited.dateIn ||
      original.dateOut?.slice(0, 10) !== edited.dateOut ||
      original.quantity !== Number(edited.quantity) ||
      original.memo !== edited.memo ||
      original.type !== edited.type
    );
  };

  const handleSave = async (index) => {
    const { carNumber, dateIn, dateOut, quantity, type, memo } = editedData[index];

    try {
      const res = await fetch(`${BASE_URL}/api/admin/update-stock`, { // ✅ 수정
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carNumber, dateIn, dateOut, quantity, type, memo }),
      });

      const result = await res.json();
      alert(result.message);
      if (onInventoryUpdate) onInventoryUpdate();
    } catch (err) {
      alert('❌ 저장 실패');
    }
  };

  const handleDelete = async (carNumber) => {
    const confirmed = window.confirm(`정말 삭제하시겠습니까?\n차량번호: ${carNumber}`);
    if (!confirmed) return;

    try {
      const res = await fetch(`${BASE_URL}/api/admin/delete-stock?carNumber=${carNumber}`, { // ✅ 수정
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
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">📦 재고 상태 변경</h2>

      <table className="w-full border text-sm text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">차량번호</th>
            <th className="border p-2">회사</th>
            <th className="border p-2">입고일</th>
            <th className="border p-2">수량</th>
            <th className="border p-2">타이어 종류</th>
            <th className="border p-2">위치</th>
            <th className="border p-2">출고일</th>
            <th className="border p-2">메모</th>
            <th className="border p-2">저장</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={item._id}>
              <td className="border p-1 bg-gray-100">{item.carNumber}</td>
              <td className="border p-1 bg-gray-100">{item.company}</td>
              <td className="border p-1">
                <input
                  type="date"
                  className="text-xs border px-1 py-0.5"
                  value={editedData[i]?.dateIn || ''}
                  onChange={(e) => handleChange(i, 'dateIn', e.target.value)}
                />
              </td>
              <td className="border p-1">
                <input
                  type="number"
                  className="text-xs border px-1 py-0.5 w-16"
                  value={editedData[i]?.quantity || ''}
                  onChange={(e) => handleChange(i, 'quantity', e.target.value)}
                />
              </td>
              <td className="border p-1">
                <select
                  className="text-xs border px-1 py-0.5 w-full"
                  value={editedData[i]?.type || ''}
                  onChange={(e) => handleChange(i, 'type', e.target.value)}
                >
                  <option value="">선택</option>
                  {typeOptions.map((opt) => (
                    <option key={opt._id} value={opt.name}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border p-1">
                <div className="flex flex-col items-center">
                  {item.locations.map((loc, j) => (
                    <div key={j} className="text-xs">
                      X{loc.x} Y{loc.y} Z{loc.z}
                    </div>
                  ))}
                </div>
              </td>
              <td className="border p-1">
                <input
                  type="date"
                  className="text-xs border px-1 py-0.5"
                  value={editedData[i]?.dateOut || ''}
                  onChange={(e) => handleChange(i, 'dateOut', e.target.value)}
                />
              </td>
              <td className="border p-1">
                <input
                  type="text"
                  className="text-xs border px-1 py-0.5 w-full"
                  value={editedData[i]?.memo || ''}
                  onChange={(e) => handleChange(i, 'memo', e.target.value)}
                />
              </td>
              <td className="border p-1 space-y-1">
                <button
                  onClick={() => handleSave(i)}
                  disabled={!hasChanges(i)}
                  className={`text-xs px-2 py-1 rounded w-full ${
                    hasChanges(i)
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  저장
                </button>

                <button
                  onClick={() => handleDelete(item.carNumber)}
                  className="text-xs px-2 py-1 rounded w-full bg-red-500 text-white hover:bg-red-600"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockStatusPage;