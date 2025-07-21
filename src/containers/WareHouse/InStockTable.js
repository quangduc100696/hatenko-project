import React, { useState } from 'react';
import { Table } from 'antd';
import { arrayNotEmpty } from 'utils/dataUtils';
import { ShowSkuDetail } from 'containers/Product/SkuView'

const InStockTable = ({ data, onChangeSelected }) => {

  const [ selectedRowKey, setSelectedRowKey ] = useState(null);
  const onChangeSelectedRow = (key, item) => {
    setSelectedRowKey(key);
    onChangeSelected(item);
  };

  const columns = [
    {
      title: "SKU",
      dataIndex: "skuName",
      key: "skuName",
      width: 100,
      ellipsis: true
    },
    {
      title: "Kho hàng",
      dataIndex: "stockName",
      key: "stockName",
      width: 150,
      ellipsis: true
    },
    {
      title: "SL",
      dataIndex: "quantity",
      key: "quantity",
      width: 60
    },
    {
      title: "Chi tiết",
      key: "detail",
      width: 350,
      ellipsis: true,
      render: (_, record) => <ShowSkuDetail skuInfo={record.skuInfo} />
    },
    {
      title: "Chọn",
      width: 80,
      fixed: 'right',
      dataIndex: "action",
      render: (_, record) => (
        <div onClick={(e) => e.stopPropagation()}>
          <input
            type="radio"
            checked={selectedRowKey === record.id}
            onChange={() => onChangeSelectedRow(record.id, record)}
          />
        </div>
      )
    }
  ];

  const onRow = (record) => {
    return {
      onClick: () => {
        setSelectedRowKey(record.id);
      }
    }
  };

  return arrayNotEmpty(data) ? (
    <Table
      bordered
      scroll={{ x: 750 }}
      rowKey="id"
      columns={columns}
      dataSource={data}
      pagination={data.length > 10}
      onRow={onRow}
      style={{ cursor: "pointer", marginBottom: 20 }}
    />
  ) : null;
};

export default InStockTable;