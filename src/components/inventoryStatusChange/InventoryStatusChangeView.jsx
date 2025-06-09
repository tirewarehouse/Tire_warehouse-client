import { useEffect, useState } from "react";
import { Button, Col, DatePicker, Input, InputNumber, notification, Row, Select, Table } from "antd";
import LocationWarningModal from "../LocationWarningModal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko"; // 한국어 가져오기
import locale from "antd/es/date-picker/locale/ko_KR";
import { useAdmin } from "../../context/AdminContext";

dayjs.extend(relativeTime);
dayjs.locale("ko");

const InventoryStatusChangeView = ({ onInventoryUpdate }) => {
  const [editedData, setEditedData] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const { admin } = useAdmin();

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
    });
  };

  const columns = [
    { title: "차량번호", dataIndex: "carNumber", key: "carNumber", align: "center", width: "8%" },
    { title: "회사", dataIndex: "company", key: "company", align: "center", render: (value) => convertCompanyName(value), width: "8%" },
    {
      title: "입고일",
      dataIndex: "dateIn",
      key: "dateIn",
      align: "center",
      render: (_, record) => <DatePicker allowClear={false} locale={locale} value={dayjs(record.dateIn)} onChange={(value) => handleChangeDateIn(value, record._id)} />,
      width: "10%",
    },
    {
      title: "수량",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (_, record) => <InputNumber value={record.quantity} min={1} max={100} onChange={(value) => handleChangeQuantity(value, record._id)} />,
      width: "8%",
    },
    {
      title: "타이어",
      dataIndex: "type",
      key: "type",
      align: "center",
      render: (_, record) => (
        <Select
          className="text-xs border px-1 py-0.5 w-full"
          value={record.type}
          disabled
          onChange={(value) => handleChangeType(value, record._id)}
          options={typeOptions.map((opt) => ({ label: opt.name, value: opt._id }))}
        ></Select>
      ),
      width: "10%",
    },
    {
      title: "창고",
      dataIndex: "warehouse",
      key: "warehouse",
      align: "center",
      render: (_, record) => <Select value={record.warehouse} style={{ width: "120px" }} options={warehouseOptions.map((opt) => ({ label: opt.name, value: opt._id }))}></Select>,
      width: "10%",
    },
    {
      title: "위치",
      dataIndex: "locations",
      key: "locations",
      align: "center",
      render: (_, record) =>
        _?.map((loc, i) => (
          <Row key={`${loc.x}-${loc.y}-${loc.z}-${i}`}>
            <Col span={8}>
              <InputNumber addonBefore="X" value={loc.x} min={1} max={100} style={{ width: "90px" }} onChange={(value) => handleChangeLocation(value, loc._id, record, "x")} />
            </Col>
            <Col span={8}>
              <InputNumber addonBefore="Y" value={loc.y} min={1} max={100} style={{ width: "90px" }} onChange={(value) => handleChangeLocation(value, loc._id, record, "y")} />
            </Col>
            <Col span={8}>
              <InputNumber addonBefore="Z" value={loc.z} min={1} max={100} style={{ width: "90px" }} onChange={(value) => handleChangeLocation(value, loc._id, record, "z")} />
            </Col>
          </Row>
        )),
      width: "18%",
    },
    {
      title: "출고일",
      dataIndex: "dateOut",
      key: "dateOut",
      align: "center",
      render: (_, record) => (
        <DatePicker allowClear={false} locale={locale} value={record.dateOut ? dayjs(record.dateOut) : null} onChange={(value) => handleChangeDateOut(value, record._id)} />
      ),
      width: "10%",
    },
    {
      title: "메모",
      dataIndex: "memo",
      key: "memo",
      align: "center",
      render: (_, record) => <Input value={record.memo} onChange={(e) => handleChange(record._id, "memo", e.target.value)} />,
      width: "10%",
    },
    {
      title: "저장",
      dataIndex: "save",
      key: "save",
      align: "center",
      render: (_, record) => (
        <span>
          <Button type="primary" size="small" variant="solid" onClick={() => handleSave(record._id)}>
            저장
          </Button>
          <Button color="danger" size="small" variant="solid" onClick={() => handleDelete(record.carNumber, record._id)}>
            삭제
          </Button>
        </span>
      ),
      width: "8%",
    },
  ];

  const BASE_URL = process.env.REACT_APP_API_BASE_URL; // ✅ 추가

  useEffect(() => {
    fetch(`${BASE_URL}/api/search/all`) // ✅ 수정
      .then((res) => res.json())
      .then((resData) => {
        setEditedData(
          resData.map((item) => ({
            _id: item._id,
            carNumber: item.carNumber,
            company: item.company,
            dateIn: item.dateIn,
            dateOut: item.dateOut || null,
            quantity: item.quantity,
            type: item.type,
            warehouse: item.warehouse,
            locations: item.locations,
            memo: item.memo || "",
          }))
        );
      })
      .catch((err) => console.error("❌ 상태 변경용 데이터 불러오기 실패:", err));

    fetch(`${BASE_URL}/api/options/types`) // ✅ 수정
      .then((res) => res.json())
      .then((data) => setTypeOptions(data))
      .catch((err) => console.error("❌ 타입 옵션 불러오기 실패:", err));

    fetch(`${BASE_URL}/api/warehouse/warehouses`)
      .then((res) => res.json())
      .then((data) => setWarehouseOptions(data))
      .catch((err) => console.error("❌ 창고 옵션 불러오기 실패:", err));

    fetch(`${BASE_URL}/api/options/companies`)
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error("❌ 회사 옵션 불러오기 실패:", err));
  }, [BASE_URL]);

  const handleChange = (id, field, value) => {
    const newData = [...editedData];
    newData.find((item) => item._id === id)[field] = value;
    setEditedData(newData);
  };
  const handleChangeDateIn = (value, id) => {
    const newData = [...editedData];
    newData.find((item) => item._id === id).dateIn = dayjs(value).format("YYYY-MM-DD");
    setEditedData(newData);
  };
  const handleChangeDateOut = (value, id) => {
    const newData = [...editedData];
    newData.find((item) => item._id === id).dateOut = dayjs(value).format("YYYY-MM-DD");
    setEditedData(newData);
  };
  const handleChangeQuantity = async (value, id) => {
    const newData = [...editedData];
    const item = newData.find((item) => item._id === id);
    const originData = await fetch(`${BASE_URL}/api/admin/get-detail?id=${id}`)
      .then((res) => res.json())
      .then((res) => res);

    const beforeValue = item.quantity;
    const beforeLocations = originData.locations;
    item.quantity = value;

    if (beforeValue > value) {
      item.locations.pop();
    } else {
      if (beforeValue < beforeLocations.length) {
        const before = beforeLocations[beforeValue];
        item.locations.push({ x: before.x, y: before.y, z: before.z });
      } else {
        item.locations.push({ x: 1, y: 1, z: 1 });
      }
    }

    setEditedData(newData);
  };
  const handleChangeType = (value, id) => {
    const newData = [...editedData];
    const typeOption = typeOptions.find((item) => item._id === value);
    newData.find((item) => item._id === id).type = typeOption.name;
    setEditedData(newData);
  };
  const handleChangeLocation = (value, id, record, field) => {
    const newData = [...editedData];
    const itemToEdit = newData.find((item) => item._id === record._id);
    const locationToEdit = itemToEdit.locations.find((loc) => loc._id === id);
    locationToEdit[field] = value;
    setEditedData(newData);
  };

  const checkDisabled = async (id) => {
    const originData = await fetch(`${BASE_URL}/api/admin/get-detail?id=${id}`)
      .then((res) => res.json())
      .then((res) => res);
    const edited = editedData.find((item) => item._id === id);
    let locationsCompare = true;
    if (originData.locations.length === edited.locations.length) {
      for (let i = 0; i < originData.locations.length; i++) {
        if (originData.locations[i].x !== edited.locations[i].x || originData.locations[i].y !== edited.locations[i].y || originData.locations[i].z !== edited.locations[i].z) {
          locationsCompare = false;
        }
      }
    } else {
      locationsCompare = false;
    }
    const dateInCompare = dayjs(originData.dateIn).format("YYYY-MM-DD") === dayjs(edited.dateIn).format("YYYY-MM-DD");
    const dateOutCompare = dayjs(originData.dateOut).format("YYYY-MM-DD") === dayjs(edited.dateOut).format("YYYY-MM-DD");
    const quantityCompare = originData.quantity === Number(edited.quantity);
    const memoCompare = originData.memo === edited.memo;
    const typeCompare = originData.type === edited.type;

    return dateInCompare && dateOutCompare && quantityCompare && memoCompare && typeCompare && locationsCompare;
  };

  const handleSave = async (id) => {
    const res = await checkDisabled(id);
    if (res) {
      openNotificationWithIcon("warning", "저장 실패", "변경된 내용이 없습니다.");
      return;
    }
    const { carNumber, dateIn, dateOut, quantity, type, memo, locations } = editedData.find((item) => item._id === id);
    const originData = await fetch(`${BASE_URL}/api/admin/get-detail?id=${id}`)
      .then((res) => res.json())
      .then((res) => res);
    if (locations.some((loc) => !loc.x || !loc.y || !loc.z)) return;
    try {
      for (const loc of locations) {
        const location = originData.locations.find((item) => item._id === loc._id);
        if (location.x === loc.x && location.y === loc.y && location.z === loc.z) continue;
        const res = await fetch(`${BASE_URL}/api/admin/check-location?x=${loc.x}&y=${loc.y}&z=${loc.z}`);
        const data = await res.json();
        if (data.exists) {
          setShowWarningModal(true);
          return;
        }
      }
      try {
        const res = await fetch(`${BASE_URL}/api/admin/update-stock`, {
          // ✅ 수정
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ carNumber, dateIn, dateOut, quantity, type, memo, locations }),
        });

        const result = await res.json();
        alert(result.message);
        onSaveHistory(id, "UPDATE");
        if (onInventoryUpdate) onInventoryUpdate();
      } catch (err) {
        alert("❌ 저장 실패");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onSaveHistory = async (id, historyType) => {
    const originData = await fetch(`${BASE_URL}/api/admin/get-detail?id=${id}`)
      .then((res) => res.json())
      .then((res) => res);
    const request = {
      carNumber: originData.carNumber,
      dateIn: originData.dateIn,
      dateOut: originData.dateOut,
      quantity: originData.quantity,
      type: originData.type,
      locations: originData.locations,
      warehouse: originData.warehouse,
      memo: originData.memo,
      historyType,
      creator: admin,
      company: originData.company,
    };
    fetch(`${BASE_URL}/api/history/histories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
  };

  const handleDelete = async (carNumber, id) => {
    const confirmed = window.confirm(`정말 삭제하시겠습니까?\n차량번호: ${carNumber}`);
    if (!confirmed) return;
    try {
      onSaveHistory(id, "DELETE");
      const res = await fetch(`${BASE_URL}/api/admin/delete-stock?carNumber=${carNumber}`, {
        // ✅ 수정
        method: "DELETE",
      });

      const result = await res.json();
      alert(result.message);

      setEditedData((prev) => prev.filter((item) => item.carNumber !== carNumber));
      if (onInventoryUpdate) onInventoryUpdate();
    } catch (err) {
      alert("❌ 삭제 실패");
    }
  };

  const convertCompanyName = (value) => {
    const company = companies.find((item) => item._id === value);
    const companyName = companies.find((item) => item.name === value);
    return company ? company.name : companyName ? companyName.name : value;
  };

  return (
    <>
      {contextHolder}
      <h2 className="text-2xl font-bold">📦 재고 상태 변경</h2>
      <Table size="small" columns={columns} dataSource={editedData} rowKey={(record) => record._id} scroll={{ y: 60 * 10 }} locale={{ emptyText: "등록된 재고가 없습니다." }} />
      {showWarningModal && <LocationWarningModal onClose={() => setShowWarningModal(false)} />}
    </>
  );
};

export default InventoryStatusChangeView;
