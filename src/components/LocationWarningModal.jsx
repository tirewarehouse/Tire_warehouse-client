// src/components/LocationWarningModal.jsx
import React from 'react';

const LocationWarningModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow w-80 text-center">
      <p className="text-red-600 font-semibold mb-4">
        ❌ 이미 사용 중인 위치가 있습니다.
      </p>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={onClose}
      >
        확인
      </button>
    </div>
  </div>
);

export default LocationWarningModal;