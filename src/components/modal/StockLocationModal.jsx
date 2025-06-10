import React, { useState } from 'react';
import LocationWarningModal from './LocationWarningModal';

const StockLocationModal = ({ stockInfo, onSubmit, onCancel }) => {
  const [locations, setLocations] = useState(
    Array.from({ length: stockInfo.quantity }, () => ({ x: '', y: '', z: '', duplicate: false }))
  );
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [overLimitWarning, setOverLimitWarning] = useState(false); // ✅ 추가

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleChange = (index, field, value) => {
    const numValue = Math.min(Number(value), 100); // ✅ 최대 100 제한
    const newLocations = [...locations];
    newLocations[index][field] = numValue;

    // 중복 좌표 체크
    const duplicates = newLocations.some((loc, i) => {
      if (i === index) return false;
      return (
        loc.x === newLocations[index].x &&
        loc.y === newLocations[index].y &&
        loc.z === newLocations[index].z
      );
    });

    newLocations[index].duplicate = duplicates;
    setLocations(newLocations);

    // ✅ 100 초과 경고 플래그
    setOverLimitWarning(Number(value) > 100);
  };

  const handleSubmit = async () => {
    if (locations.some((loc) => !loc.x || !loc.y || !loc.z)) return;
    try {
      for (const loc of locations) {
        const res = await fetch(
          `${BASE_URL}/api/admin/check-location?x=${loc.x}&y=${loc.y}&z=${loc.z}`
        );
        const data = await res.json();
        if (data.exists) {
          setShowWarningModal(true);
          return;
        }
      }
      onSubmit(locations);
    } catch (err) {
      console.error(err);
    }
  };

  const isSubmitDisabled = locations.some(
    (loc) => !loc.x || !loc.y || !loc.z || loc.duplicate
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded shadow w-[900px]">
        <h2 className="text-2xl font-bold mb-6">재고 위치 지정</h2>

        <table className="w-full border text-sm text-center table-fixed">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">회사</th>
              <th className="border p-2">입고일</th>
              <th className="border p-2">차량번호</th>
              <th className="border p-2">수량</th>
              <th className="border p-2">타이어 종류</th>
              <th className="border p-2 w-[240px]">위치</th>
              <th className="border p-2">출고일</th>
              <th className="border p-2">메모</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">{stockInfo.company}</td>
              <td className="border p-2">{stockInfo.dateIn || new Date().toLocaleDateString()}</td>
              <td className="border p-2">{stockInfo.carNumber}</td>
              <td className="border p-2">{stockInfo.quantity}</td>
              <td className="border p-2">{stockInfo.type}</td>
              <td className="border p-2 align-top">
                <div className="flex flex-col items-center space-y-1 max-h-[250px] overflow-y-auto pr-1">
                  {locations.map((loc, i) => (
                    <div key={i} className="flex items-center border border-gray-400 text-xs">
                      <span className="px-1 border-r">X</span>
                      <input
                        type="number"
                        min="1"
                        value={loc.x}
                        onChange={(e) => handleChange(i, 'x', e.target.value)}
                        className="w-10 px-1 border-r outline-none"
                      />
                      <span className="px-1 border-r">Y</span>
                      <input
                        type="number"
                        min="1"
                        value={loc.y}
                        onChange={(e) => handleChange(i, 'y', e.target.value)}
                        className="w-10 px-1 border-r outline-none"
                      />
                      <span className="px-1 border-r">Z</span>
                      <input
                        type="number"
                        min="1"
                        value={loc.z}
                        onChange={(e) => handleChange(i, 'z', e.target.value)}
                        className="w-10 px-1 outline-none"
                      />
                    </div>
                  ))}
                  {locations.some((loc) => loc.duplicate) && (
                    <p className="text-xs text-red-500 mt-1">
                      같은 자리를 중복해서 입력할 수 없습니다.
                    </p>
                  )}
                  {overLimitWarning && (
                    <p className="text-xs text-red-500 mt-1">
                      X, Y, Z 좌표는 100을 넘을 수 없습니다.
                    </p>
                  )}
                </div>
              </td>
              <td className="border p-2">{stockInfo.dateOut || '미정'}</td>
              <td className="border p-2">{stockInfo.memo || ''}</td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-between mt-6">
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            입고 완료
          </button>
          <button onClick={onCancel} className="text-gray-500 hover:underline">
            취소
          </button>
        </div>
      </div>

      {showWarningModal && <LocationWarningModal onClose={() => setShowWarningModal(false)} />}
    </div>
  );
};

export default StockLocationModal;