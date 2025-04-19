// src/pages/InventoryList.jsx
import React, { useEffect, useState } from 'react';

const InventoryList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/search/all')
      .then((res) => res.json())
      .then((resData) => setData(resData))
      .catch((err) => console.error('데이터 불러오기 실패:', err));
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">재고 리스트 확인</h2>

      <table className="w-full border text-sm text-center table-fixed">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">회사</th>
            <th className="border p-2">입고일</th>
            <th className="border p-2">차량번호</th>
            <th className="border p-2">수량</th>
            <th className="border p-2">타이어 종류</th>
            <th className="border p-2">위치</th>
            <th className="border p-2">출고일</th>
            <th className="border p-2">메모</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={item._id}>
              <td className="border p-2">{item.company}</td>
              <td className="border p-2">{new Date(item.dateIn).toLocaleDateString()}</td>
              <td className="border p-2">{item.carNumber}</td>
              <td className="border p-2">{item.quantity}</td>
              <td className="border p-2">{item.type}</td>
              <td className="border p-2">
                <div className="flex flex-col items-center space-y-1">
                  {item.locations?.map((loc, i) => (
                    <div key={i} className="flex border border-gray-400 text-xs">
                      <span className="px-1 border-r">X</span>
                      <span className="px-1 border-r">{loc.x}</span>
                      <span className="px-1 border-r">Y</span>
                      <span className="px-1 border-r">{loc.y}</span>
                      <span className="px-1 border-r">Z</span>
                      <span className="px-1">{loc.z}</span>
                    </div>
                  ))}
                </div>
              </td>
              <td className="border p-2">
                {item.dateOut ? new Date(item.dateOut).toLocaleDateString() : '미정'}
              </td>
              <td className="border p-2">{item.memo || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryList;