import React, { useEffect, useState } from 'react';

const CompanyManagementModal = ({ onClose }) => {
  const [companies, setCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState('');
  const [error, setError] = useState('');

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/api/admin/companies`)
      .then(res => res.json())
      .then(data => setCompanies(data))
      .catch(err => console.error('회사 목록 불러오기 실패:', err));
  }, [BASE_URL]);

  const handleAdd = async () => {
    const trimmed = newCompany.trim();
    if (!trimmed) {
      setError('회사명을 입력해주세요.');
      return;
    }

    if (companies.some(c => c.name === trimmed)) {
      setError('이미 등록된 회사입니다.');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/admin/companies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed })
      });

      const data = await res.json();
      if (res.ok) {
        setCompanies(prev => [...prev, data]);
        setNewCompany('');
        setError('');
      } else {
        setError(data.message || '추가 실패');
      }
    } catch (err) {
      console.error('추가 중 오류:', err);
      setError('서버 오류');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      await fetch(`${BASE_URL}/api/admin/companies/${id}`, { method: 'DELETE' });
      setCompanies(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error('삭제 실패:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-[400px]">
        <h2 className="text-lg font-bold mb-4">회사 관리</h2>

        <div className="space-y-2 mb-4">
          {companies.length > 0 ? (
            companies.map(c => (
              <div key={c._id} className="flex justify-between items-center border px-3 py-1 rounded">
                <span>{c.name}</span>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  삭제
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">등록된 회사가 없습니다.</p>
          )}
        </div>

        <input
          type="text"
          placeholder="새 회사명 입력"
          value={newCompany}
          onChange={(e) => setNewCompany(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
          className="border p-2 w-full rounded mb-2"
        />
        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

        <div className="flex justify-between">
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            추가
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:underline"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyManagementModal;