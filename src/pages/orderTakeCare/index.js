import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import RestList from 'components/RestLayout/RestList';
import LeadFilter from './Filter';
import useGetList from "hooks/useGetList";
import { Button, Tag } from 'antd';
import { arrayEmpty, dateFormatOnSubmit, formatMoney, formatTime } from 'utils/dataUtils';
import { HASH_MODAL } from 'configs';
import { InAppEvent } from 'utils/FuseUtils';
import { cloneDeep } from 'lodash';

const thStyle = {
  padding: "8px 12px",
  borderBottom: "2px solid #ddd",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "8px 12px",
  borderBottom: "1px solid #ddd",
};

const OrderTakeCarePage = () => {

  const [title] = useState("Danh sách Đơn hàng đã chăm sóc");

  const onEdit = (item) => {
    let title = 'Chăm sóc đơn hàng# ' + item.id;
    let hash = '#draw/chamsocdonhang.edit';
    let data = cloneDeep(item);
    InAppEvent.emit(HASH_MODAL, { hash, title, data });
  }

  const CUSTOM_ACTION = [
    {
      title: "Code",
      dataIndex: 'code',
      width: 200
    },
    {
      title: "Số điện thoại",
      ataIndex: 'customerMobilePhone',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item.customerMobilePhone}
          </div>
        )
      }
    },
    {
      title: "Email",
      ataIndex: 'customerEmail',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.customerEmail}
          </div>
        )
      }
    },
    {
      title: "Ngày tạo cơ hội",
      ataIndex: '',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {formatTime(item?.opportunityAt)}
          </div>
        )
      }
    },
    {
      title: "Tên người nhận",
      ataIndex: 'customerReceiverName',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.customerReceiverName}
          </div>
        )
      }
    },
    {
      title: "Người tạo",
      ataIndex: 'userCreateUsername',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.userCreateUsername}
          </div>
        )
      }
    },
    {
      title: "Tổng tiền",
      ataIndex: 'total',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {formatMoney(item?.total)}
          </div>
        )
      }
    },
    {
      title: "Thao tác",
      width: 120,
      fixed: 'right',
      render: (record) => (
        <div>
          <Button color="primary" variant="dashed" onClick={() => onEdit(record)} size='small'>
            Chăm sóc
          </Button>
        </div>
      )
    }
  ];

  const onData = useCallback((values) => {
    if (arrayEmpty(values.embedded)) {
      return values;
    }
    return values;
  }, []);

  const beforeSubmitFilter = useCallback((values) => {
    dateFormatOnSubmit(values, ['from', 'to']);
    return values;
  }, []);

  const onCreateLead = () => {

  }

  return (
    <div>
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
        filter={<LeadFilter />}
        beforeSubmitFilter={beforeSubmitFilter}
        useGetAllQuery={useGetList}
        hasCreate={false}
        apiPath={'customer-order/fetch-order-take-care'}
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
        customClickCreate={onCreateLead}
        columns={CUSTOM_ACTION}
      />
    </div>
  )
}

export default OrderTakeCarePage
