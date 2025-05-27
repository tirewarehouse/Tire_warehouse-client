import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import SearchModal from './components/SearchModal'; // ✅ 모달로 변경
import InventoryList from './components/InventoryList';
import AdminLoginButton from './components/AdminLoginButton';
import { AdminProvider, useAdmin } from './context/AdminContext';
import AdminInModal from './components/AdminInModal';
import StockStatusPage from './components/StockStatusPage';

function AppLayout() {
  const location = useLocation();

  return (
    <>
      <AdminLoginButton />
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </>
  );
}

function MainPage() {
  const [showInventory, setShowInventory] = useState(false);
  const [showStatusChange, setShowStatusChange] = useState(false);
  const [showAdminInModal, setShowAdminInModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false); // ✅ 검색 모달 상태
  const [refreshKey, setRefreshKey] = useState(0);
  const { isLoggedIn } = useAdmin();

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <div className="flex">
      <Sidebar
        refreshTrigger={refreshKey}
        onSearchClick={() => {
          setShowSearchModal(true); // ✅ 팝업 대신 모달 열기
        }}
        onShowInventory={() => {
          setShowInventory(true);
          setShowStatusChange(false);
        }}
        onShowStatusChange={() => {
          setShowStatusChange(true);
          setShowInventory(false);
        }}
      />

      <div className="flex-1 p-8">
        <h1 className="text-xl font-bold mb-4">타이어 창고 관리 웹서비스</h1>

        {isLoggedIn && (
          <button
            onClick={() => setShowAdminInModal(true)}
            className="mb-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            ➕ 재고 입고
          </button>
        )}

        {showAdminInModal && (
          <AdminInModal
            onClose={() => setShowAdminInModal(false)}
            onInventoryUpdate={triggerRefresh}
          />
        )}

        {showSearchModal && (
          <SearchModal onClose={() => setShowSearchModal(false)} />
        )}

        {showInventory ? (
          <div>
            <div className="flex justify-start mb-2">
              <button
                className="text-sm text-red-500 hover:underline"
                onClick={() => setShowInventory(false)}
              >
                ❌ 닫기
              </button>
            </div>
            <InventoryList />
          </div>
        ) : showStatusChange ? (
          <div>
            <div className="flex justify-start mb-2">
              <button
                className="text-sm text-red-500 hover:underline"
                onClick={() => setShowStatusChange(false)}
              >
                ❌ 닫기
              </button>
            </div>
            <StockStatusPage onInventoryUpdate={triggerRefresh} />
          </div>
        ) : (
          <p className="text-gray-500">왼쪽 버튼을 눌러 재고 리스트나 상태 변경을 확인하세요.</p>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AdminProvider>
  );
}

export default App;