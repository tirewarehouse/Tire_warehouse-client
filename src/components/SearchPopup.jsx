import React, { useState } from 'react';

const SearchPopup = () => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  // ✅ 차량번호 유효성 검사 함수
  const isValidCarNumber = (value) => {
    const cleaned = value.replace(/\s/g, ''); // 띄어쓰기 제거
    return /^[0-9]{2}[가-힣]{1}[0-9]{4}$/.test(cleaned);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    const cleaned = value.replace(/\s/g, '');
    if (!isValidCarNumber(cleaned)) {
      setError('🚫 차량번호 형식이 아닙니다. 예: 12가1234');
    } else {
      setError('');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const cleaned = input.replace(/\s/g, '');

    if (!isValidCarNumber(cleaned)) return;

    try {
      const response = await fetch(`http://localhost:5001/api/search?keyword=${cleaned}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('검색 오류:', error);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-lg font-bold mb-4">검색창 팝업</h2>

      {/* 🔍 검색창 */}
      <form onSubmit={handleSearch} className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="차량번호 입력 (예: 12가1234)"
          className="border px-3 py-2 rounded"
        />
        {/* 🚨 에러 메시지 출력 */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={!!error}
          className={`px-4 py-2 rounded text-white ${error ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          검색
        </button>
      </form>

      {/* 결과 영역은 그대로 유지 */}
      {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((item) => (
              <div key={item._id} className="border rounded p-4 shadow bg-white">
                <p><strong>회사:</strong> {item.company}</p>
                <p><strong>차량번호:</strong> {item.carNumber}</p>
                <p><strong>타입:</strong> {item.type}</p>
                <p><strong>수량:</strong> {item.quantity}</p>

                {/* ✅ 위치 배열 출력 (깔끔한 박스 스타일) */}
                {item.locations && item.locations.length > 0 ? (
                  <div className="mt-2">
                    <p className="font-bold mb-1">위치:</p>
                    <div className="space-y-2">
                      {item.locations.map((loc, idx) => (
                        <div key={idx} className="flex justify-start gap-2">
                          <div className="flex items-center border px-3 py-1 rounded text-sm bg-white">
                            <span className="font-bold text-blue-600 mr-1">X</span> {loc.x}
                          </div>
                          <div className="flex items-center border px-3 py-1 rounded text-sm bg-white">
                            <span className="font-bold text-blue-600 mr-1">Y</span> {loc.y}
                          </div>
                          <div className="flex items-center border px-3 py-1 rounded text-sm bg-white">
                            <span className="font-bold text-blue-600 mr-1">Z</span> {loc.z}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p><strong>위치:</strong> 정보 없음</p>
                )}

                <p><strong>입고일:</strong> {new Date(item.dateIn).toLocaleDateString()}</p>
                <p><strong>출고일:</strong> {item.dateOut ? new Date(item.dateOut).toLocaleDateString() : '출고 안 됨'}</p>
                <p><strong>메모:</strong> {item.memo || '없음'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">검색 결과가 없습니다.</p>
        )}
    </div>
  );
};

export default SearchPopup;