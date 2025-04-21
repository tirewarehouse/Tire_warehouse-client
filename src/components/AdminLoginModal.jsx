import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

const AdminLoginModal = ({ onClose }) => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const { login } = useAdmin();

  // ✅ 환경 변수로 API 주소 가져오기
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const res = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, password: pw })
      });
  
      const data = await res.json();
  
      if (res.ok) {
        login(data.name); // ✅ 전화번호 대신 이름 저장
        onClose();
      } else {
        setError(data.message || '❌ 로그인 실패');
      }
    } catch (err) {
      console.error('로그인 요청 실패:', err);
      setError('❌ 서버 연결 실패');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow w-80 relative">
        <button onClick={onClose} className="absolute top-2 left-2 text-xl">✕</button>
        <h2 className="text-lg font-bold text-center mb-4">관리자 로그인</h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            placeholder="전화번호 형식 ID (예: 000-0000-0000)"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="border p-2 w-full rounded"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="bg-purple-600 text-white w-full py-2 rounded">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;