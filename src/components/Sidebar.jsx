// src/components/Sidebar.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useAdmin } from '../context/AdminContext';
import AdminInModal from './AdminInModal';

const Sidebar = ({ onSearchClick, onShowInventory, onShowStatusChange, refreshTrigger }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInModal, setShowInModal] = useState(false);
  const { admin } = useAdmin();

  const BASE_URL = process.env.REACT_APP_API_BASE_URL; // ✅ 추가

  const fetchInventory = useCallback(() => {
    setLoading(true);
    fetch(`${BASE_URL}/api/search/all`) // ✅ 수정
      .then((res) => res.json())
      .then((data) => {
        setInventory(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('재고 현황 불러오기 실패:', err);
        setError('재고 정보를 불러오는 데 실패했습니다. (' + err.message + ')');
        setLoading(false);
      });
  }, [BASE_URL]); // ✅ BASE_URL 의존성 추가

  console.log('🌍 API 주소:', process.env.REACT_APP_API_BASE_URL);
  
  useEffect(() => {
    fetchInventory();
  }, [fetchInventory, refreshTrigger]);

  const handleModalClose = () => {
    setShowInModal(false);
    fetchInventory(); // ✅ 입고 모달 닫을 때 최신 데이터 불러오기
  };

  return (
    <div className="w-60 h-screen bg-blue-200 p-4 flex flex-col gap-4">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={onSearchClick}
      >
        검색
      </button>

      <button
        onClick={onShowInventory}
        className="bg-white text-blue-500 text-center px-4 py-2 rounded border border-blue-500 hover:bg-blue-100"
      >
        리스트 확인
      </button>

      {admin && (
        <>
          <button
            onClick={() => setShowInModal(true)}
            className="bg-purple-600 text-white text-center px-4 py-2 rounded hover:bg-green-700"
          >
            재고 입고
          </button>

          <button
            onClick={onShowStatusChange}
            className="bg-purple-500 text-white text-center px-4 py-2 rounded hover:bg-yellow-600"
          >
            재고 상태 변경
          </button>
        </>
      )}

      {showInModal && <AdminInModal onClose={handleModalClose} />}

      <div className="bg-white p-2 rounded shadow text-sm">
        <div className="font-bold mb-1">재고 현황</div>

        {loading ? (
          <p className="text-xs text-gray-500">불러오는 중...</p>
        ) : error ? (
          <p className="text-xs text-red-500">{error}</p>
        ) : (
          <table className="w-full text-left border border-gray-300 text-xs">
            <thead>
              <tr>
                <th>차량번호</th>
                <th>수량</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item._id}>
                  <td>{item.carNumber}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Sidebar;