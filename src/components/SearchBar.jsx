// SearchBar.jsx
import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('🔎 검색 버튼 클릭됨, 입력값:', input); // ✅ 여기에 로그 추가
    if (!input.trim()) return; // 빈 검색어 방지
    onSearch(input); // 부모로 검색어 전달
  };

  return (
    
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="차량번호, 타이어 위치 등 검색"
        className="border border-gray-300 px-3 py-2 rounded w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        찾기
      </button>
    </form>
  );
};

export default SearchBar;