import React, { useEffect, useState } from 'react';
import StockLocationModal from './StockLocationModal';

const AdminInModal = ({ onClose }) => {
  const [companies, setCompanies] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [carNumber, setCarNumber] = useState('');
  const [carNumberError, setCarNumberError] = useState('');
  const [carExistsError, setCarExistsError] = useState('');
  const [quantity, setQuantity] = useState(2);
  const [quantityWarning, setQuantityWarning] = useState('');
  const [memo, setMemo] = useState('');
  const [dateIn, setDateIn] = useState('');
  const [dateOut, setDateOut] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [confirmedPayload, setConfirmedPayload] = useState(null);

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // ✅ 회사 및 타이어 종류 최신 정보 불러오기
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const resCompanies = await fetch(`${BASE_URL}/api/options/companies`);
        const resTypes = await fetch(`${BASE_URL}/api/options/types`);
        const companiesData = await resCompanies.json();
        const typesData = await resTypes.json();
        setCompanies(companiesData);
        setTypes(typesData);
      } catch (err) {
        console.error('옵션 불러오기 실패:', err);
      }
    };

    fetchOptions();
  }, [BASE_URL]);

  const validateCarNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const regex = /^[0-9]{2}[가-힣]{1}[0-9]{4}$/;
    return regex.test(cleaned);
  };

  const handleCarNumberChange = async (value) => {
    setCarNumber(value);
    const cleaned = value.replace(/\s/g, '');

    if (!validateCarNumber(value)) {
      setCarNumberError('번호판 양식에 맞춰 써 주세요.');
    } else {
      setCarNumberError('');
      try {
        const res = await fetch(`${BASE_URL}/api/admin/check-car?carNumber=${cleaned}`);
        const data = await res.json();
        setCarExistsError(data.exists ? '이미 등록된 차량입니다.' : '');
      } catch (err) {
        console.error('차량 중복 확인 실패:', err);
      }
    }
  };

  const handleQuantityChange = (value) => {
    const num = Number(value);
    setQuantity(num);

    if (num !== 2 && num !== 4) {
      setQuantityWarning('ℹ 입력한 갯수가 맞는지 확인해주세요. 진행은 가능합니다.');
    } else {
      setQuantityWarning('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateCarNumber(carNumber)) {
      alert('🚨 차량번호 양식이 올바르지 않습니다.');
      return;
    }

    if (carExistsError) {
      alert('🚨 이미 등록된 차량입니다.');
      return;
    }

    const payload = {
      carNumber: carNumber.replace(/\s/g, ''),
      company: selectedCompany,
      type: selectedType,
      quantity,
      memo,
      dateIn: dateIn || undefined,
      dateOut: dateOut || undefined
    };

    setConfirmedPayload(payload);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    setShowLocationModal(true);
  };

  const handleFinalSubmit = (locations) => {
    const finalPayload = {
      ...confirmedPayload,
      locations
    };

    fetch(`${BASE_URL}/api/admin/in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalPayload),
    })
      .then((res) => res.json())
      .then(() => {
        alert('✅ 입고 성공');
        setShowLocationModal(false);
        onClose();
      })
      .catch(() => alert('❌ 입고 실패'));
  };

  const isSubmitDisabled = !carNumber || !selectedCompany || !selectedType || !quantity;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow w-[400px]">
        <h2 className="text-lg font-bold mb-4">입고 처리</h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            placeholder="차량번호"
            value={carNumber}
            onChange={(e) => handleCarNumberChange(e.target.value)}
            className="border p-2 w-full rounded"
          />
          {carNumberError && <p className="text-xs text-red-500">{carNumberError}</p>}
          {carExistsError && <p className="text-xs text-red-500">{carExistsError}</p>}

          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="border p-2 w-full rounded"
          >
            <option value="">회사 선택</option>
            {companies.length === 0 ? (
              <option disabled>회사 데이터 없음</option>
            ) : (
              companies.map((c) => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))
            )}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border p-2 w-full rounded"
          >
            <option value="">타이어 종류 선택</option>
            {types.map((t) => (
              <option key={t._id} value={t.name}>{t.name}</option>
            ))}
          </select>

          <div>
            <label className="text-sm font-medium text-black">타이어 수량 :</label>
            <input
              type="number"
              min="1"
              placeholder="수량"
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="border p-2 w-full rounded"
            />
            {quantityWarning && (
              <p className="text-xs text-yellow-500 mt-1">{quantityWarning}</p>
            )}
          </div>

          <div className="border p-3 rounded mt-2">
            <p className="text-sm text-gray-700 mb-2">선택사항</p>

            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">입고일</span>
              <span className="text-xs text-red-500">※ 미입력 시 등록일로 자동 처리됩니다.</span>
            </div>
            <input
              type="date"
              value={dateIn}
              onChange={(e) => setDateIn(e.target.value)}
              className="border p-2 w-full rounded mb-2"
            />

            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">출고일</span>
              <span className="text-xs text-red-500">※ 미입력 시 없음으로 자동 처리됩니다.</span>
            </div>
            <input
              type="date"
              value={dateOut}
              onChange={(e) => setDateOut(e.target.value)}
              className="border p-2 w-full rounded mb-2"
            />

            <textarea
              placeholder="메모 (선택)"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              입고
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:underline"
            >
              취소
            </button>
          </div>
        </form>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-[360px] shadow">
            <h3 className="text-lg font-bold mb-4">확인해주세요</h3>
            <ul className="text-sm space-y-1 mb-4">
              <li>차량번호: {confirmedPayload.carNumber}</li>
              <li>회사: {confirmedPayload.company}</li>
              <li>타이어 종류: {confirmedPayload.type}</li>
              <li>타이어 수량: {confirmedPayload.quantity}</li>
              <li>입고일: {confirmedPayload.dateIn || new Date().toISOString().split('T')[0]}</li>
              <li>출고일: {confirmedPayload.dateOut || '미정'}</li>
              <li>메모: {confirmedPayload.memo || '없음'}</li>
            </ul>
            <div className="flex justify-between">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleConfirm}
              >
                예
              </button>
              <button
                className="text-gray-500 hover:underline"
                onClick={() => setShowConfirmModal(false)}
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}

      {showLocationModal && (
        <StockLocationModal
          stockInfo={confirmedPayload}
          onSubmit={handleFinalSubmit}
          onCancel={() => setShowLocationModal(false)}
        />
      )}
    </div>
  );
};

export default AdminInModal;