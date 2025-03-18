import React, { useCallback, useState } from 'react';
import RestList from "components/RestLayout/RestList";
import useGetList from "hooks/useGetList";
import { Helmet } from "react-helmet";
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import Filter from './Filter';
import { Button, Typography } from 'antd';
import { InAppEvent } from "utils/FuseUtils";
import { HASH_MODAL } from 'configs';
import { arrayEmpty, dateFormatOnSubmit, formatMoney, formatTime } from 'utils/dataUtils';
import { cloneDeep } from 'lodash';
import OrderService from 'services/OrderService';
import { DetailsStyle } from './styles';

const thStyle = {
  padding: "8px 12px",
  borderBottom: "2px solid #ddd",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "8px 12px",
  borderBottom: "1px solid #ddd",
};

const Order = () => {

  const onEdit = (item) => {
    let title = 'Chi tiết đơn hàng #';
    let hash = '#draw/order.edit';
    let data = cloneDeep(item);
    InAppEvent.emit(HASH_MODAL, { hash, title, data });
  }

  const onCreateProduct = () => InAppEvent.emit(HASH_MODAL, {
    hash: '#draw/order.edit',
    title: 'Tạo mới đơn hàng',
    data: {}
  });

  const [title] = useState("Danh sách đơn hàng");
  const CUSTOM_ACTION = [
    {
      title: "Mã đơn",
      dataIndex: 'code',
      width: 150
    },
    {
      title: "Nhân viên",
      dataIndex: 'userCreateUsername',
      width: 120,
      ellipsis: true
    },
    {
      title: "K.Hàng",
      dataIndex: 'customerReceiverName',
      width: 200,
      ellipsis: true
    },
    {
      title: "Số ĐT",
      dataIndex: 'customerMobilePhone',
      width: 150,
      ellipsis: true
    },
    {
      title: "Sản Phẩm",
      dataIndex: 'details',
      width: 150,
      ellipsis: true,
      render: (details) => <ProductInOder details={details} action="name" />
    },
    {
      title: "Đơn giá",
      dataIndex: 'subtotal',
      width: 150,
      ellipsis: true,
      render: (subtotal) => formatMoney(subtotal)
    },
    {
      title: "Giảm giá",
      dataIndex: 'priceOff',
      width: 150,
      ellipsis: true,
      render: (priceOff) => formatMoney(priceOff)
    },
    {
      title: "VAT",
      dataIndex: 'vat',
      width: 80,
      ellipsis: true
    },
    {
      title: "Tổng đơn",
      dataIndex: 'total',
      width: 150,
      ellipsis: true,
      render: (total) => formatMoney(total)
    },
    {
      title: "Thanh toán",
      dataIndex: 'paid',
      width: 150,
      ellipsis: true,
      render: (paid) => formatMoney(paid)
    },
    {
      title: "Created",
      dataIndex: 'createdAt',
      width: 120,
      ellipsis: true,
      render: (createdAt) => formatTime(createdAt)
    },
    {
      title: "Trạng thái",
      dataIndex: 'details',
      width: 150,
      ellipsis: true,
      render: (details) => <ProductInOder details={details} action="status" />
    },
    {
      title: "",
      width: 100,
      fixed: 'right',
      render: (record) => (
        <Button color="danger" variant="dashed" onClick={() => onEdit(record)} size='small'>Detail</Button>
      )
    }
  ];

  const beforeSubmitFilter = useCallback((values) => {
    dateFormatOnSubmit(values, ['from', 'to']);
    return values;
  }, []);

  const onData = useCallback((values) => {
    if (arrayEmpty(values.embedded)) {
      return [];
    }
    return values;
  }, []);

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <CustomBreadcrumb
        data={[{ title: 'Trang chủ' }, { title: title }]}
      />
      <RestList
        xScroll={1200}
        onData={onData}
        initialFilter={{ limit: 10, page: 1 }}
        filter={<Filter />}
        hasCreate={false}
        beforeSubmitFilter={beforeSubmitFilter}
        useGetAllQuery={useGetList}
        apiPath={'order/fetch'}
        expandable={{
          expandedRowRender: (record) => {
            return (
              <div style={{ padding: "10px", background: "#f9f9f9", borderRadius: "8px" }}>
                {record.details && record.details.length > 0 ? (
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      background: "#fff",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <thead>
                      <tr style={{ background: "#f0f0f0", textAlign: "left" }}>
                        <th style={thStyle}>Mã sản phẩm</th>
                        <th style={thStyle}>Tên Sản phẩm</th>
                        <th style={thStyle}>Đơn vị tính</th>
                        <th style={thStyle}>Chi tiết</th>
                        <th style={thStyle}>Giá bán</th>
                        <th style={thStyle}>Số lượng</th>
                        <th style={thStyle}>Tổng tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {record.details.map((sku) =>
                        sku.items.map((item, index) => (
                          <tr key={`${sku.id}-${item.id || index}`} style={{ borderBottom: "1px solid #ddd" }}>
                            {/* Chỉ hiển thị sku.code ở hàng đầu tiên của detail */}
                            <td style={tdStyle}>
                              {index === 0 ? sku?.code : ""}
                            </td>
                            <td style={tdStyle}>
                              {item?.name || "N/A"}
                            </td>
                            <td></td> {/* Cột trống */}
                            <td style={tdStyle}>
                              {(() => {
                                let parsedSkuInfo = [];
                                try {
                                  if (item?.skuInfo) {
                                    parsedSkuInfo = JSON.parse(item.skuInfo);
                                  }
                                } catch (error) {
                                  console.error("Lỗi parse JSON:", error);
                                }
                                return parsedSkuInfo.map((detail) => (
                                  <p key={detail.id} style={{ marginRight: "10px" }}>
                                    <strong>{detail.name}:</strong> {detail.value}
                                  </p>
                                ));
                              })()}
                            </td>
                            <td style={tdStyle}>
                              {formatMoney(item?.price) || "N/A"}
                            </td>
                            <td style={tdStyle}>
                              {item?.quantity || "N/A"}
                            </td>
                            <td style={tdStyle}>
                              {formatMoney(item?.total) || "N/A"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                ) : (
                  <p>Không có SKU nào</p>
                )}
              </div>
            )
          },
        }}
        customClickCreate={onCreateProduct}
        columns={CUSTOM_ACTION}
      />
    </>
  )
}

const ProductInOder = ({ details, action }) => {
  if (arrayEmpty(details)) {
    return '(No Content)';
  }
  return details.map((item, key) => (
    <DetailsStyle key={key}>
      <Typography.Paragraph>
        <Typography.Text style={{ color: OrderService.statusColor(item.status) }}>
          {action === 'status' ? OrderService.statusName(item.status) : `${key + 1} - ${item.productName}`}
        </Typography.Text>
      </Typography.Paragraph>
    </DetailsStyle>
  ));
}

export default Order;