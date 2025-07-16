import React, { useCallback, useState } from 'react';
import { Table, Button, InputNumber, Select, Typography } from 'antd';
import { ShowSkuDetail } from 'containers/Product/SkuView';
import { arrayEmpty, arrayNotEmpty, formatMoney } from 'utils/dataUtils';
import { formatterInputNumber, parserInputNumber } from 'utils/tools';
import { HASH_POPUP } from 'configs/constant';
import { InAppEvent } from 'utils/FuseUtils';
import {
  SaveOutlined,
  TagOutlined,
  ShoppingCartOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckOutlined,
  FilePptOutlined
} from '@ant-design/icons';
import _ from 'lodash';

const { Text } = Typography;
const warrantyOptions = [
  { name: '(Chưa có)', id: 1 },
  { name: '6 Tháng', id: 6 },
  { name: '12 Tháng', id: 12 },
  { name: '24 Tháng', id: 24 }
];

const ORDER_TEMPLATE = {
  key: "1",
  orderName: "",
  productId: null,
  skuDetailCode: "",
  unit: "(Chưa có)",
  warrantyPeriod: "(Chưa có)",
  quantity: 1,
  price: 0,
  totalPrice: 0,
  warehouse: "",
  stock: 0,
  discountRate: 0,
  discountAmount: 0,
  editable: false,
  mSkuDetails: []
}

const getWarehouseByProduct = (mSkuDetails, mProduct) => {
  if(arrayEmpty(mProduct?.warehouses)) {
    return []
  }
  let warehouseOptions = [];
  for(let warehouse of mProduct.warehouses) {
    const skuInfo = JSON.stringify(warehouse.skuInfo || {});
    const skuChoise = JSON.stringify(mSkuDetails);
    if(skuInfo === skuChoise) {
      warehouseOptions.push(warehouse);
    }
  }
  return warehouseOptions;
}

function randomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function findByQuantity(arr, quantity) {
  return arrayNotEmpty(arr) ? arr.find(
    item => quantity >= item.quantityFrom && quantity <= item.quantityTo
  ) || {} : {};
}

const EditButton = ({ 
  editable, 
  onEdit, 
  onClose, 
  onDelete 
}) => (
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

  const [ data, setData ] = useState([]);
  const onAddProduct = useCallback(() => {
    const onAfterChoiseProduct = (values) => {
      console.log('App Product', values);
      let order = _.cloneDeep(ORDER_TEMPLATE);
      const { mSkuDetails, mProduct, quantity, productId, skuId } = values;
      /* Tạo Item trong list sản phẩm */
      order.key = randomString();
      order.orderName = values?.orderName ?? "";
      order.productId = productId;
      order.unit = mProduct.unit ?? "N/A";
      order.mSkuDetails = mSkuDetails;
      order.skuDetailCode = String(skuId);
      order.quantity = quantity;
      order.warehouseOptions = getWarehouseByProduct(mSkuDetails, mProduct);

      const skus = mProduct?.skus ?? [];
      let listPriceRange = [];
      if(arrayNotEmpty(order.warehouseOptions)) {
        let warehouse = _.first(order.warehouseOptions);
        order.warehouse = warehouse?.stockName ?? '';
        order.stock = warehouse?.quantity ?? 0;
        listPriceRange = skus.find(s => s.id === warehouse?.skuId)?.listPriceRange ?? [];
      }
      
      const dataPrice = findByQuantity(listPriceRange, order.quantity);
      if(dataPrice?.priceRef) {
        order.price = dataPrice.priceRef;
        order.totalPrice = order.price * order.quantity;
      }
      setData(datas => ([...datas, order]));
    };

    InAppEvent.emit(HASH_POPUP, {
      hash: "sku.add",
      title: "Thêm sản phẩm",
      data: { onSave: onAfterChoiseProduct }
    });
  }, []);

  const onAddStock = useCallback(() => {
    const onAfterSubmit = (values) => {
      console.log('Save stock', values);
    };
    InAppEvent.emit(HASH_POPUP, {
      hash: "stock.add",
      title: "Nhập kho",
      data: { onSave: onAfterSubmit }
    });
  }, []);

  const columns = [
    {
      title: 'Mã',
      dataIndex: 'skuDetailCode',
      key: 'skuDetailCode',
      width: 80,
    },
    {
      title: 'Diễn giải',
      dataIndex: 'mSkuDetails',
      render: (mSkuDetails) => (<span />),
      width: 260,
      ellipsis: true,
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
      width: 130,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      width: 100,
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      key: 'unit',
      width: 90,
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

  const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);
  const totalDiscount = data.reduce((sum, item) => sum + item.discountAmount, 0);
  const totalSubOrder = data.reduce((sum, item) => sum + item.totalPrice - item.discountAmount, 0);

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

    if (['quantity', 'price', 'discountRate', 'discountAmount'].includes(field)) {
      target[field] = parseFloat(value || 0);
    } else if (field === 'warehouse') {
      target[field] = target.warehouseOptions.find(option => option.id === value)?.stockName || '';
    } else if (field === 'warrantyPeriod') {
      target[field] = warrantyOptions.find(option => option.id === value)?.name || '';
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
            disabled={arrayEmpty(record?.warehouseOptions)}
            value={text}
            options={(record?.warehouseOptions ?? []).map(opt => ({
              label: opt.stockName,
              value: opt.id
            }))}
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
            options={warrantyOptions.map(opt => ({
              label: opt.name,
              value: opt.id
            }))}
            onChange={value => handleChange(record.key, column.dataIndex, value)}
            style={{ width: '100%' }}
          />
        );
      }
      if (column.dataIndex === 'quantity') {
        return (
          <InputNumber
            min={1}
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
      if (column.dataIndex === 'warehouse') { 
        return <Text style={{ width: 120 }} ellipsis> {text || '(Chưa nhập)'} </Text>;
      }
      if (column.dataIndex === 'mSkuDetails') { 
        return <ShowSkuDetail skuInfo={record.mSkuDetails} width={260} />
      }
      const isFormatted = ['price', 'discountAmount', 'totalPrice'].includes(column.dataIndex);
      return isFormatted ? formatMoney(text) : text;
    }
  };

  const deleteRow = (key) => {
    setData(data.filter(item => item.key !== key));
  };

  const onSave = useCallback(() => {
    console.log('Order Save', data);
  }, [data]);

  return (
    <>
      <Table
        bordered
        scroll={{ x: 1500 }}
        dataSource={data}
        columns={columns.map(col => ({
          ...col,
          onCell: () => ({ editable: col.editable?.toString() }),
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
            <Table.Summary.Cell index={7}>{formatMoney(totalDiscount)}</Table.Summary.Cell>
            <Table.Summary.Cell index={8}>{formatMoney(totalSubOrder)}</Table.Summary.Cell>
            <Table.Summary.Cell index={9}></Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
      <div style={{ marginTop: 25, display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Button 
            disabled={arrayEmpty(data)}
            onClick={onSave}
            icon={<SaveOutlined />}
          >
            Lưu đơn hàng
          </Button>
          <Button
            onClick={onAddProduct}
            style={{ marginLeft: 8 }}
            icon={<PlusOutlined />}
          >
            Thêm sản phẩm
          </Button>
          <Button 
            onClick={onAddStock}
            style={{ marginLeft: 8 }} 
            icon={<ShoppingCartOutlined />}
          >
            Nhập kho
          </Button>
          <Button 
            style={{ marginLeft: 8 }} 
            icon={<TagOutlined />}
            disabled
          >
            VAT + K.Mãi + Thanh toán
          </Button>
          <Button 
            style={{ marginLeft: 8 }} 
            icon={<FilePptOutlined />}
            disabled
          >
            In hóa đơn
          </Button>
        </div>
        <div>
          <p>Tổng chưa VAT: {formatMoney(totalSubOrder)}</p>
          <p>VAT: {formatMoney(0)}</p>
          <p>C.Khấu Voucher: {formatMoney(0)}</p>
          <p><strong>Tổng tiền: {formatMoney(totalSubOrder)}</strong></p>
          <p><strong>Đã thanh toán: {formatMoney(0)}</strong></p>
          <p><strong>Còn lại: {formatMoney(totalSubOrder)}</strong></p>
        </div>
      </div>
    </>
  );
}

export default BanHangPage;