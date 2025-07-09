import React, { useCallback, useState } from 'react';
import { Table, Button, InputNumber, Select, message } from 'antd';
import { formatMoney } from 'utils/dataUtils';
import { formatterInputNumber, parserInputNumber } from 'utils/tools';
import { HASH_POPUP } from 'configs/constant';
import { InAppEvent } from 'utils/FuseUtils';
import {
  SaveOutlined,
  TagOutlined,
  ShoppingCartOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckOutlined
} from '@ant-design/icons';

const warehouseOptions = [
  { label: 'KHO HL1', value: 1 },
  { label: 'KHO HL2', value: 2 },
  { label: 'KHO HL3', value: 3 }
];

const warrantyOptions = [
  { label: '6 Tháng', value: 6 },
  { label: '12 Tháng', value: 12 },
  { label: '24 Tháng', value: 24 }
];

const EditButton = ({ editable, onEdit, onClose, onDelete }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Button size="small" onClick={editable ? onClose : onEdit}>
      {editable ? <CheckOutlined /> : 'Sửa'}
    </Button>
    <Button
      size="small"
      danger
      icon={<DeleteOutlined />}
      style={{ marginLeft: 6 }}
      onClick={onDelete}
    />
  </div>
);

const BanHangPage = (props) => {

  const onAddProduct = useCallback(() => {
    const onSave = (values) => {
      console.log('Save new product', values);
    };
    InAppEvent.emit(HASH_POPUP, {
      hash: "sku.add",
      title: "Thêm sản phẩm",
      data: { onSave }
    });
  }, []);

  const columns = [
    {
      title: 'Mã hàng hóa',
      dataIndex: 'skuDetailCode',
      key: 'skuDetailCode',
      width: 120,
    },
    {
      title: 'Diễn giải',
      dataIndex: 'description',
      key: 'description',
      width: 260,
      ellipsis: true,
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      key: 'unit',
      width: 90,
    },
    {
      title: 'Bảo hành',
      dataIndex: 'warrantyPeriod',
      key: 'warrantyPeriod',
      width: 110,
      editable: true
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      editable: true,
      width: 90
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      editable: true
    },
    {
      title: 'Tỷ lệ CK (%)',
      dataIndex: 'discountRate',
      key: 'discountRate',
      width: 110,
      editable: true,
    },
    {
      title: 'Tiền CK',
      dataIndex: 'discountAmount',
      key: 'discountAmount',
      width: 120,
      editable: true
    },
    {
      title: 'Thành tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 130
    },
    {
      title: 'Kho',
      dataIndex: 'warehouse',
      key: 'warehouse',
      editable: true,
      width: 120,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      width: 100,
    },
    {
      title: 'Sửa',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      width: 110,
      render: (_, record) => (
        <EditButton
          editable={record.editable}
          onEdit={() => editRow(record.key)}
          onClose={closeEdit}
          onDelete={() => deleteRow(record.key)}
        />
      )
    }
  ];

  const dataSource = [
    {
      key: '1',
      skuDetailCode: 'BIOZ69035',
      description: 'MAIN BIOSTAR Z690A SILVER',
      unit: 'Chiếc',
      warrantyPeriod: '36 Tháng',
      quantity: 1,
      price: 3650000,
      totalPrice: 3650000,
      warehouse: 'KHO HL3',
      stock: 50,
      discountRate: 0,
      discountAmount: 0,
      editable: false,
    },
    {
      key: '2',
      skuDetailCode: '14600KFT',
      description: 'CPU INTEL CORE I5 14600KF (UP TO 5.3',
      unit: 'Chiếc',
      warrantyPeriod: '36 Tháng',
      quantity: 1,
      price: 4300000,
      totalPrice: 4300000,
      warehouse: 'KHO HL2',
      stock: 50,
      discountRate: 0,
      discountAmount: 0,
      editable: false
    },
    {
      key: '3',
      skuDetailCode: 'OCPRI6G144',
      description: 'RAM OCPC XT II 16GB (1x16GB) BUS 32',
      unit: 'Chiếc',
      warrantyPeriod: '36 Tháng',
      quantity: 2,
      price: 690000,
      totalPrice: 1380000,
      warehouse: 'KHO HL3',
      stock: 50,
      discountRate: 0,
      discountAmount: 0,
      editable: false
    }
  ];

  const [data, setData] = useState(dataSource);
  const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);
  const totalDiscount = data.reduce((sum, item) => sum + item.discountAmount, 0);
  const totalAfterDiscount = data.reduce((sum, item) => sum + item.totalPrice - item.discountAmount, 0);

  const editRow = (key) => {
    const newData = data.map(item => ({
      ...item,
      editable: item.key === key,
    }));
    setData(newData);
  };

  const closeEdit = () => {
    setData(data.map(item => ({ ...item, editable: false })));
  };

  const handleChange = (key, field, value) => {
    const newData = [...data];
    const target = newData.find((item) => item.key === key);
    if (!target) {
      return;
    }

    if (field === 'quantity') {
      if (parseFloat(value) > target.stock) {
        message.warning('Số lượng không được lớn hơn tồn kho!');
        return;
      }
      target[field] = parseFloat(value || 0);
    } else if (['price', 'discountRate', 'discountAmount'].includes(field)) {
      target[field] = parseFloat(value || 0);
    } else if (field === 'warehouse') {
      target[field] = warehouseOptions.find(option => option.value === value)?.label || '';
    } else if (field === 'warrantyPeriod') {
      target[field] = warrantyOptions.find(option => option.value === value)?.label || '';
    }

    /* Calculate dependent fields */
    if (field === 'quantity' || field === 'price') {
      target.totalPrice = target.quantity * target.price;
    }
    if (field === 'discountRate') {
      target.discountAmount = (target.price * target.quantity * target.discountRate) / 100;
    }
    if (field === 'discountAmount') {
      target.discountRate = ((target.discountAmount / (target.price * target.quantity)) * 100).toFixed(2);
    }
    setData(newData);
  };

  const renderCell = (text, record, index, column) => {
    if (record.editable && column.editable) {
      if (column.dataIndex === 'warehouse') {
        return (
          <Select
            placeholder="Chọn kho"
            disabled={!record.editable}
            value={text}
            options={warehouseOptions}
            onChange={value => handleChange(record.key, column.dataIndex, value)}
            style={{ width: '100%' }}
          />
        );
      }
      if (column.dataIndex === 'warrantyPeriod') {
        return (
          <Select
            placeholder="Chọn bảo hành"
            disabled={!record.editable}
            value={text}
            options={warrantyOptions}
            onChange={value => handleChange(record.key, column.dataIndex, value)}
            style={{ width: '100%' }}
          />
        );
      }
      if (column.dataIndex === 'quantity') {
        return (
          <InputNumber
            min={0}
            max={record.stock}
            value={text}
            onChange={value => handleChange(record.key, column.dataIndex, value)}
            style={{ width: '100%' }}
            formatter={formatterInputNumber}
            parser={parserInputNumber}
          />
        );
      }
      return (
        <InputNumber
          min={0}
          value={text}
          onChange={value => handleChange(record.key, column.dataIndex, value)}
          style={{ width: '100%' }}
          formatter={formatterInputNumber}
          parser={parserInputNumber}
        />
      );
    } else {
      const isFormatted = ['price', 'discountAmount', 'totalPrice'].includes(column.dataIndex);
      return isFormatted ? formatMoney(text) : text;
    }
  };

  const deleteRow = (key) => {
    setData(data.filter(item => item.key !== key));
  };

  return (
    <>
      <Table
        bordered
        scroll={{ x: 1500 }}
        dataSource={data}
        columns={columns.map(col => ({
          ...col,
          onCell: () => ({ editable: col.editable }),
          render: col.dataIndex !== 'operation'
            ? (text, record, index) => renderCell(text, record, index, col)
            : col.render
        }))}
        pagination={false}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={4}>Tổng cộng</Table.Summary.Cell>
            <Table.Summary.Cell index={4}>{totalQuantity}</Table.Summary.Cell>
            <Table.Summary.Cell index={5}></Table.Summary.Cell>
            <Table.Summary.Cell index={6}>{totalDiscount.toLocaleString()}</Table.Summary.Cell>
            <Table.Summary.Cell index={7}>{totalAfterDiscount.toLocaleString()}</Table.Summary.Cell>
            <Table.Summary.Cell index={8}></Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
      <div style={{ marginTop: 25 }}>
        <Button icon={<SaveOutlined />}>Lưu đơn hàng</Button>
        <Button
          onClick={onAddProduct}
          style={{ marginLeft: 8 }}
          icon={<PlusOutlined />}
        >
          Thêm sản phẩm
        </Button>
        <Button style={{ marginLeft: 8 }} icon={<ShoppingCartOutlined />}>Nhập kho</Button>
        <Button style={{ marginLeft: 8 }} icon={<TagOutlined />}>Chương trình khuyến mãi</Button>
      </div>
    </>
  );
}

export default BanHangPage;