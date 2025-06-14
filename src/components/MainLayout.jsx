import React, { useCallback, useEffect, useState } from "react";
import { Layout, Menu, notification, Spin, theme } from "antd";
import { SearchOutlined, FileSearchOutlined, PlusOutlined, SyncOutlined, ReconciliationOutlined, HistoryOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getSearchWarehouseInventory } from "../js/api/search";
import { useAdmin } from "../context/AdminContext";
import SearchModal from "./modal/SearchModal";
import InventoriesView from "./inventory/InventoriesView";
import InventoryStatusChangeView from "./inventoryStatusChange/InventoryStatusChangeView";
import CompanyManagementModal from "./modal/CompanyManagementModal";
import HistoriesView from "./history/HistoriesView";
import ModalStockUp from "./modal/ModalStockUp";

const { Header, Content, Footer, Sider } = Layout;

const App = ({ selectedWarehouse }) => {
  const { admin } = useAdmin();
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
    });
  };

  const items = [
    { key: 1, icon: <SearchOutlined />, label: "검색", visible_column: "true", onClick: () => handleShowSearchModal() },
    { key: 2, icon: <FileSearchOutlined />, label: "리스트 확인", visible_column: "true", onClick: () => handleShowInventoriesView() },
    { key: 3, icon: <PlusOutlined />, label: "재고 추가", visible_column: admin ? "true" : "false", onClick: () => handleShowStockUpModal() },
    { key: 4, icon: <SyncOutlined />, label: "재고 상태 변경", visible_column: admin ? "true" : "false", onClick: () => handleShowInventoryStatusChangeView() },
    { key: 5, icon: <ReconciliationOutlined />, label: "회사 관리", visible_column: admin ? "true" : "false", onClick: () => setShowCompanyModal(true) },
    { key: 6, icon: <HistoryOutlined />, label: "이력 관리", visible_column: admin ? "true" : "false", onClick: () => handleShowHistoryView(true) },
  ];
  const filterItems = items.filter((item) => item.visible_column === "true");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showInventoriesView, setShowInventoriesView] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showInventoryStatusChangeView, setShowInventoryStatusChangeView] = useState(false);
  const [showHistoryView, setShowHistoryView] = useState(false);
  const [showStockUpModal, setShowStockUpModal] = useState(false);

  const checkWarehouse = () => {
    if (!selectedWarehouse) {
      openNotificationWithIcon("warning", "창고를 선택해주세요.", "창고를 선택 후 진행가능합니다.");
      return false;
    }
    return true;
  };

  const handleShowStockUpModal = () => {
    if (!checkWarehouse()) return;
    setShowStockUpModal(true);
  };

  const handleShowSearchModal = () => {
    if (!checkWarehouse()) return;
    setShowSearchModal(true);
  };

  const handleShowInventoriesView = () => {
    if (!checkWarehouse()) return;
    setShowInventoriesView(true);
    setShowInventoryStatusChangeView(false);
    setShowHistoryView(false);
  };

  const handleShowInventoryStatusChangeView = () => {
    if (!checkWarehouse()) return;
    setShowInventoryStatusChangeView(true);
    setShowInventoriesView(false);
    setShowHistoryView(false);
  };

  const handleShowHistoryView = () => {
    if (!checkWarehouse()) return;
    setShowHistoryView(true);
    setShowInventoriesView(false);
    setShowInventoryStatusChangeView(false);
  };

  const fetchInventory = useCallback(() => {
    setLoading(true);
    getSearchWarehouseInventory(selectedWarehouse).then((data) => {
      setInventory(data);
      setLoading(false);
    });
  }, [selectedWarehouse]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const clickLayout = () => {
    const expiration = localStorage.getItem("expiration");
    if (expiration) {
      const now = dayjs();
      if (now.isAfter(dayjs(expiration))) {
        localStorage.removeItem("admin");
        localStorage.removeItem("expiration");
        window.location.reload();
        alert("로그인 시간이 만료되었습니다. 다시 로그인해주세요.");
      } else {
        localStorage.setItem("expiration", dayjs().add(30, "minutes").toDate());
      }
    }
  };
  return (
    <Layout style={{ height: "100vh", width: "100vw" }} onClick={clickLayout}>
      {contextHolder}
      <Sider breakpoint="lg" collapsedWidth="0" style={{ backgroundColor: "#bfdbfe" }}>
        <Menu mode="inline" items={filterItems} />
        {showSearchModal && <SearchModal onClose={() => setShowSearchModal(false)} />}
        {showCompanyModal && <CompanyManagementModal onClose={() => setShowCompanyModal(false)} />}
        {showStockUpModal && (
          <ModalStockUp
            open={showStockUpModal}
            onCancel={() => {
              setShowStockUpModal(false);
              fetchInventory();
            }}
          />
        )}
        <div className="bg-white p-2 rounded shadow text-sm">
          <div className="font-bold mb-1">재고 현황</div>

          {loading ? (
            <Spin size="small">불러오는 중...</Spin>
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
      <Layout style={{ height: "100vh" }}>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              height: "100%",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {!showInventoriesView && !showInventoryStatusChangeView && !showHistoryView && "왼쪽 버튼을 눌러 재고 리스트나 상태 변경을 확인하세요."}
            {showInventoriesView && <InventoriesView selectedWarehouse={selectedWarehouse} />}
            {showInventoryStatusChangeView && <InventoryStatusChangeView onInventoryUpdate={fetchInventory} selectedWarehouse={selectedWarehouse} />}
            {showHistoryView && <HistoriesView />}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>타이어 창고 재고 관리 시스템</Footer>
      </Layout>
    </Layout>
  );
};
export default App;
