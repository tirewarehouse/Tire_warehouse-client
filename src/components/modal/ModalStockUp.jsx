import React, { useEffect, useState } from "react";
import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, notification, Row, Select, Table } from "antd";
import ModalCarAdd from "./ModalCarAdd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import locale from "antd/es/date-picker/locale/ko_KR";
import { getCompanies, getTypes } from "../../js/api/options";
import { getWarehouses } from "../../js/api/warehouse";
import { getCheckLocations, postInventoryIn } from "../../js/api/inventory";

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

  const selectedWarehouse = localStorage.getItem("selectedWarehouse");
  const handleConvertWarehouse = () => {
    const warehouse = warehouses.find((warehouse) => warehouse._id === selectedWarehouse);
    return warehouse ? warehouse.name : "";
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
      render: () => <span>{handleConvertWarehouse()}</span>,
    },
    {
      title: "위치",
      dataIndex: "locations",
      align: "center",
      width: "19%",
      render: (_, record, index) =>
        _?.map((loc, i) => (
          <Row key={`${loc.x}-${loc.y}-${loc.z}-${i}`}>
            <Col span={8}>
              <InputNumber addonBefore="X" value={loc.x} min={1} max={100} style={{ width: "90px" }} onChange={(value) => handleChangeLocation(value, i, index, "x")} />
            </Col>
            <Col span={8}>
              <InputNumber addonBefore="Y" value={loc.y} min={1} max={100} style={{ width: "90px" }} onChange={(value) => handleChangeLocation(value, i, index, "y")} />
            </Col>
            <Col span={8}>
              <InputNumber addonBefore="Z" value={loc.z} min={1} max={100} style={{ width: "90px" }} onChange={(value) => handleChangeLocation(value, i, index, "z")} />
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

  const handleChangeLocation = (value, locIndex, recordIndex, field) => {
    const newInventory = [...inventory];
    const itemToEdit = newInventory[recordIndex];
    const locationToEdit = itemToEdit.locations[locIndex];
    locationToEdit[field] = value;
    setInventory(newInventory);
  };

  const handleChangeDateOut = (value, index) => {
    const newInventory = [...inventory];
    newInventory[index].dateOut = dayjs(value).format("YYYY-MM-DD");
    setInventory(newInventory);
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        getCompanies().then((data) => setCompanies(data));
        getTypes().then((data) => setTypes(data));
        getWarehouses().then((data) => setWarehouses(data));
      } catch (err) {
        console.error("옵션 불러오기 실패:", err);
      }
    };
    fetchOptions();
  }, []);

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
      item.warehouse = selectedWarehouse;
      postInventoryIn(item);
    });
    openNotificationWithIcon("success", "재고 추가 성공", "재고가 추가되었습니다.");
    setInventory([]);
  };

  const handleCheckLocation = async () => {
    for (const item of inventory) {
      for (const loc of item.locations) {
        const res = await getCheckLocations({ x: loc.x, y: loc.y, z: loc.z, warehouse: item.warehouse });
        if (res.exists) {
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
        <Table
          size="small"
          dataSource={inventory}
          columns={columns}
          rowKey={(record, index) => `carNumber-${index}`}
          locale={{ emptyText: "등록된 차량이 없습니다." }}
          pagination={false}
        />
      </Modal>
      {showCarAddModal && <ModalCarAdd open={showCarAddModal} onCancel={() => setShowCarAddModal(false)} onAddCar={handleAddCar} />}
    </>
  );
};

export default ModalStockUp;
