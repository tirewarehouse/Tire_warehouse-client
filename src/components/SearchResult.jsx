// SearchResult.jsx (전체)
import React from 'react';

const SearchResult = ({ results }) => {
  console.log('📦 SearchResult에서 받은 데이터:', results);

  if (results.length === 0) {
    return <p className="text-gray-500 mt-4">검색 결과가 없습니다.</p>;
  }

  return (
    <div className="mt-4 space-y-2">
      {results.map((item) => (
        <div
          key={item._id}
          className="border p-4 rounded shadow-sm hover:bg-gray-50 transition"
        >
          <p><strong>회사:</strong> {item.company}</p>
          <p><strong>차량번호:</strong> {item.carNumber}</p>
          <p><strong>타입:</strong> {item.type}</p>
          <p><strong>수량:</strong> {item.quantity}</p>

          {/* ✅ 위치 정보 배열 출력 */}
          {item.locations && item.locations.length > 0 && (
            <div className="mt-4">
              <p className="font-bold mb-2">위치</p>
              <div className="space-y-2">
                {item.locations.map((loc, idx) => (
                  <div key={idx} className="flex justify-center items-center gap-2">
                    <div className="flex items-center border px-2 py-1 rounded bg-white text-sm">
                      <span className="font-bold mr-1 text-blue-600">X</span> {loc.x}
                    </div>
                    <div className="flex items-center border px-2 py-1 rounded bg-white text-sm">
                      <span className="font-bold mr-1 text-blue-600">Y</span> {loc.y}
                    </div>
                    <div className="flex items-center border px-2 py-1 rounded bg-white text-sm">
                      <span className="font-bold mr-1 text-blue-600">Z</span> {loc.z}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p><strong>입고일:</strong> {new Date(item.dateIn).toLocaleDateString()}</p>
          {item.dateOut ? (
            <p><strong>출고일:</strong> {new Date(item.dateOut).toLocaleDateString()}</p>
          ) : (
            <p><strong>출고일:</strong> 출고 안 됨</p>
          )}
          {item.memo && (
            <p><strong>메모:</strong> {item.memo}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default SearchResult;