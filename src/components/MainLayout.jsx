import React, { useCallback, useState } from 'react';
import { SearchOutlined, FileSearchOutlined, PlusOutlined, SyncOutlined, ReconciliationOutlined } from '@ant-design/icons';
import { Layout, Menu, Spin, theme } from 'antd';
import { useAdmin } from '../context/AdminContext';
import SearchModal from './SearchModal';
import InventoriesView from './InventoriesView';
import AdminInModal from './AdminInModal';
import InventoryStatusChangeView from './InventoryStatusChangeView';
import CompanyManagementModal from './CompanyManagementModal';

const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  const { admin } = useAdmin();
  const items = [
    { key: 1, icon: <SearchOutlined />, label: '검색', visible_column: 'true', onClick: () => setShowSearchModal(true) },
    { key: 2, icon: <FileSearchOutlined />, label: '리스트 확인', visible_column: 'true', onClick: () => handleShowInventoriesView() },
    { key: 3, icon: <PlusOutlined />, label: '재고 입고', visible_column: admin ? 'true' : 'false', onClick: () => setShowInModal(true) },
    { key: 4, icon: <SyncOutlined />, label: '재고 상태 변경', visible_column: admin ? 'true' : 'false', onClick: () => handleShowInventoryStatusChangeView() },
    { key: 5, icon: <ReconciliationOutlined />, label: '회사 관리', visible_column: admin ? 'true' : 'false', onClick: () => setShowCompanyModal(true) },
  ];
  const filterItems = items.filter((item) => item.visible_column === 'true');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showInventoriesView, setShowInventoriesView] = useState(false);
  const [showInModal, setShowInModal] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showInventoryStatusChangeView, setShowInventoryStatusChangeView] = useState(false);

  const handleModalClose = () => {
    setShowInModal(false);
    fetchInventory();
  };

  const handleShowInventoriesView = () => {
    setShowInventoriesView(true);
    setShowInventoryStatusChangeView(false);
  };

  const handleShowInventoryStatusChangeView = () => {
    setShowInventoryStatusChangeView(true);
    setShowInventoriesView(false);
  };

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchInventory = useCallback(() => {
    setLoading(true);
    fetch(`${BASE_URL}/api/search/all`)
      .then((res) => res.json())
      .then((data) => {
        setInventory(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('재고 현황 불러오기 실패:', err);
        setError('재고 정보를 불러오는 데 실패했습니다. (' + err.message + ')');
        setLoading(false);
      });
  }, [BASE_URL]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout style={{ height: '100vh', width: '100vw' }}>
      <Sider breakpoint="lg" collapsedWidth="0" style={{ backgroundColor: "#bfdbfe" }}>
        <Menu mode="inline" items={filterItems} />
        {showSearchModal && <SearchModal onClose={() => setShowSearchModal(false)} />}
        {showInModal && <AdminInModal onClose={handleModalClose} />}
        {showCompanyModal && <CompanyManagementModal onClose={() => setShowCompanyModal(false)} />}
        <div className="bg-white p-2 rounded shadow text-sm">
          <div className="font-bold mb-1">재고 현황</div>

          {loading ? (
            <Spin size="small">불러오는 중...</Spin>
          ) : error ? (
            <p className="text-xs text-red-500">{error}</p>
          ) : (
            <table className="w-full text-left border border-gray-300 text-xs">
              <thead>
                <tr>
                  <th>차량번호</th>
                  <th>수량</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item._id}>
                    <td>{item.carNumber}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {!showInventoriesView && !showInventoryStatusChangeView && '왼쪽 버튼을 눌러 재고 리스트나 상태 변경을 확인하세요.'}
            {showInventoriesView && <InventoriesView />}
            {showInventoryStatusChangeView && <InventoryStatusChangeView onInventoryUpdate={fetchInventory} />}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>타이어 창고 재고 관리 시스템</Footer>
      </Layout>
    </Layout>
  );
};
export default App;
