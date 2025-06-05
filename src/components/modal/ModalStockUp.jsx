import React, { useEffect, useState } from "react";
import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, notification, Row, Select, Table } from "antd";
import ModalCarAdd from "./ModalCarAdd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import locale from "antd/es/date-picker/locale/ko_KR";

dayjs.extend(relativeTime);
dayjs.locale("ko");

const ModalStockUp = ({ open, onCancel }) => {
  const [companies, setCompanies] = useState([]);
  const [types, setTypes] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [showCarAddModal, setShowCarAddModal] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [disabledComponent, setDisabledComponent] = useState(false);

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
    });
  };

  const columns = [
    {
      title: "회사",
      dataIndex: "company",
      align: "center",
      width: "9%",
      render: (text) => convertCompanyName(text),
    },
    {
      title: "입고일",
      dataIndex: "dateIn",
      align: "center",
      width: "9%",
      render: (text) => dayjs(text).format("YYYY-MM-DD"),
    },
    {
      title: "차량번호",
      dataIndex: "carNumber",
      align: "center",
      width: "9%",
    },
    {
      title: "수량",
      dataIndex: "quantity",
      align: "center",
      width: "9%",
      render: (text, record, index) => <InputNumber value={record.quantity} min={1} max={100} onChange={(e) => handleChangeQuantity(e, index)} />,
    },

    {
      title: "타이어",
      dataIndex: "type",
      align: "center",
      width: "11%",
      render: (text) => convertTypeName(text),
    },
    {
      title: "창고",
      dataIndex: "warehouse",
      align: "center",
      width: "11%",
      render: (text, record, index) => (
        <Select value={record.warehouse} style={{ width: "100%" }} onChange={(value) => handleChangeWarehouse(value, index)}>
          {warehouses.map((warehouse) => (
            <Select.Option value={warehouse._id}>{warehouse.name}</Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "위치",
      dataIndex: "locations",
      align: "center",
      width: "19%",
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
    },
    {
      title: "출고일",
      dataIndex: "dateOut",
      align: "center",
      width: "11%",
      render: (_, record, index) => (
        <DatePicker allowClear={false} locale={locale} value={record.dateOut ? dayjs(record.dateOut) : null} onChange={(value) => handleChangeDateOut(value, index)} />
      ),
    },
    {
      title: "메모",
      dataIndex: "memo",
      align: "center",
      width: "11%",
      render: (_, record, index) => <Input value={record.memo} onChange={(e) => handleChangeMemo(e.target.value, index)} />,
    },
  ];

  const handleChangeQuantity = (value, index) => {
    const newInventory = [...inventory];
    const beforeValue = newInventory[index].quantity;
    newInventory[index].quantity = value;
    if (beforeValue > value) {
      newInventory[index].locations.pop();
    } else {
      newInventory[index].locations.push({ x: 1, y: 1, z: 1 });
    }
    setInventory(newInventory);
  };

  const handleChangeMemo = (value, index) => {
    const newInventory = [...inventory];
    newInventory[index].memo = value;
    setInventory(newInventory);
  };

  const handleChangeWarehouse = (value, index) => {
    const newInventory = [...inventory];
    newInventory[index].warehouse = value;
    setInventory(newInventory);
  };

  const handleChangeLocation = (value, id, record, field) => {
    const newInventory = [...inventory];
    const itemToEdit = newInventory.find((item) => item._id === record._id);
    const locationToEdit = itemToEdit.locations.find((loc) => loc._id === id);
    locationToEdit[field] = value;
    setInventory(newInventory);
  };

  const handleChangeDateOut = (value, index) => {
    const newInventory = [...inventory];
    newInventory[index].dateOut = dayjs(value).format("YYYY-MM-DD");
    setInventory(newInventory);
  };

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const resCompanies = await fetch(`${BASE_URL}/api/options/companies`);
        const resTypes = await fetch(`${BASE_URL}/api/options/types`);
        const resWarehouses = await fetch(`${BASE_URL}/api/warehouse/warehouses`);
        const companiesData = await resCompanies.json();
        const typesData = await resTypes.json();
        const warehousesData = await resWarehouses.json();
        setCompanies(companiesData);
        setTypes(typesData);
        setWarehouses(warehousesData);
      } catch (err) {
        console.error("옵션 불러오기 실패:", err);
      }
    };

    fetchOptions();
  }, [BASE_URL]);

  const handleAddCar = (carNumber, quantity) => {
    const locationAdd = [];
    for (let i = 0; i < parseInt(quantity); i++) {
      locationAdd.push({ x: 1, y: 1, z: 1 });
    }
    setInventory([
      ...inventory,
      { carNumber, quantity: parseInt(quantity), company: selectedCompany, type: selectedType, dateIn: dayjs(), warehouse: "", locations: locationAdd, dateOut: "", memo: "" },
    ]);
    openNotificationWithIcon("success", "차량 추가 성공", "차량이 추가되었습니다.");
  };

  const isSubmitDisabled = !selectedCompany || !selectedType;

  const convertCompanyName = (id) => {
    const company = companies.find((company) => company._id === id);
    return company ? company.name : "";
  };

  const convertTypeName = (id) => {
    const type = types.find((type) => type._id === id);
    return type ? type.name : "";
  };

  const handleSubmit = () => {
    handleCheckLocation();
    inventory.forEach((item) => {
      fetch(`${BASE_URL}/api/admin/in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
    });
    openNotificationWithIcon("success", "재고 추가 성공", "재고가 추가되었습니다.");
  };

  const handleCheckLocation = async () => {
    for (const item of inventory) {
      for (const loc of item.locations) {
        const res = await fetch(`${BASE_URL}/api/admin/check-locations?x=${loc.x}&y=${loc.y}&z=${loc.z}&warehouse=${item.warehouse}`);
        const data = await res.json();
        if (data.exists) {
          openNotificationWithIcon("error", "위치 중복", `${item.carNumber} 차량의 X:${loc.x}, Y:${loc.y}, Z:${loc.z} 위치가 중복되었습니다.`);
          return;
        }
      }
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="재고 추가"
        open={open}
        onCancel={onCancel}
        keyboard={false}
        footer={[
          <Button key="submit" type="primary" onClick={handleSubmit}>
            저장
          </Button>,
        ]}
        width={1600}
      >
        <Form name="stockUp" layout="inline">
          <Form.Item label="회사" name="company" rules={[{ required: true, message: "회사를 선택하세요" }]}>
            <Select style={{ width: "200px" }} value={selectedCompany} disabled={disabledComponent} onChange={(value) => setSelectedCompany(value)}>
              <Select.Option value="">회사 선택</Select.Option>
              {companies.map((company) => (
                <Select.Option value={company._id}>{company.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="타이어" name="tire" rules={[{ required: true, message: "타이어를 선택하세요" }]}>
            <Select style={{ width: "200px" }} value={selectedType} disabled={disabledComponent} onChange={(value) => setSelectedType(value)}>
              <Select.Option value="">타이어 선택</Select.Option>
              {types.map((type) => (
                <Select.Option value={type._id}>{type.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => setDisabledComponent(true)} disabled={disabledComponent}>
              확인
            </Button>
          </Form.Item>
          {disabledComponent && (
            <Form.Item>
              <Button type="primary" onClick={() => setShowCarAddModal(true)} disabled={isSubmitDisabled}>
                추가
              </Button>
            </Form.Item>
          )}
        </Form>
        <Table size="small" dataSource={inventory} columns={columns} rowKey={(record, index) => index} locale={{ emptyText: "등록된 차량이 없습니다." }} pagination={false} />
      </Modal>
      {showCarAddModal && <ModalCarAdd open={showCarAddModal} onCancel={() => setShowCarAddModal(false)} onAddCar={handleAddCar} />}
    </>
  );
};

export default ModalStockUp;
