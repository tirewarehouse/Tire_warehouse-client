import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import SearchResult from '../components/SearchResult';

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const BASE_URL = process.env.REACT_APP_API_BASE_URL; // ✅ 환경 변수로 설정

  const handleSearch = async (query) => {
    console.log('🔍 사용자가 입력한 검색어:', query);
    try {
      const response = await fetch(`${BASE_URL}/api/search?keyword=${query}`); // ✅ 수정
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">타이어 검색</h1>
      <SearchBar onSearch={handleSearch} />
      <SearchResult results={results} />
    </div>
  );
};

export default SearchPage;