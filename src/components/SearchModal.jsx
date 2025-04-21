import React, { useState } from 'react';
import SearchBar from './SearchBar';
import SearchResult from './SearchResult';

const SearchModal = ({ onClose }) => {
  const [results, setResults] = useState([]);

  // ✅ 환경변수로 API 주소 가져오기
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleSearch = async (query) => {
    console.log('🔍 모달에서 입력한 검색어:', query);
    try {
      const response = await fetch(`${BASE_URL}/api/search?keyword=${query}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('검색 중 오류:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[500px] max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="float-right text-gray-500 hover:text-black">X</button>
        <h2 className="text-lg font-bold mb-4">타이어 검색</h2>
        <SearchBar onSearch={handleSearch} />
        <SearchResult results={results} />
      </div>
    </div>
  );
};

export default SearchModal;