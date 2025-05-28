import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import RestList from 'components/RestLayout/RestList';
import LeadFilter from './Filter';
import useGetList from "hooks/useGetList";
import { Button, Tag } from 'antd';
import { arrayEmpty, dateFormatOnSubmit, formatMoney, formatTime } from 'utils/dataUtils';
import { getColorStatusLead, getSource, getStatusLead } from 'configs/constant';
import { HASH_MODAL } from 'configs';
import { InAppEvent } from 'utils/FuseUtils';
import { cloneDeep } from 'lodash';
import RequestUtils from 'utils/RequestUtils';

const thStyle = {
  padding: "8px 12px",
  borderBottom: "2px solid #ddd",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "8px 12px",
  borderBottom: "1px solid #ddd",
};

const DuyetTienPage = () => {
  const [title] = useState("Danh sách duyệt tiền");
  const onEdit = async (item) => {
    let title = 'Thanh toán đơn hàng' + item.code;
    const datas = await RequestUtils.Get(`/pay/list-by-order-id?orderId=${item.id}`)
    let hash = '#draw/duyetTien.edit';
    let data = datas?.data;
    InAppEvent.emit(HASH_MODAL, { hash, title, data });
  }

  const CUSTOM_ACTION = [
    {
      title: "Mã đơn hàng",
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
      title: "Khách hàng",
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
      title: "Sale",
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
      title: "Đã thanh toán",
      ataIndex: 'paid',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {formatMoney(item?.paid)}
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
            Thanh toán
          </Button>
        </div>
      )
    }
  ];

  const onData = useCallback((values) => {
    if (arrayEmpty(values)) {
      return values;
    }
    const newData = { embedded: values, page: { pageSize: 10, total: 1 } }
    return newData;
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
        initialFilter={{ limit: 10, page: 1, code: '', saleId: '', phone: '', from: '', to: '' }}
        filter={<LeadFilter />}
        beforeSubmitFilter={beforeSubmitFilter}
        useGetAllQuery={useGetList}
        hasCreate={false}
        apiPath={'pay/list-order-payment'}
        expandable={{
          expandedRowRender: (record) => {
            return (
              <div style={{ padding: "10px", background: "#f9f9f9", borderRadius: "8px" }}>
                {record.payments && record.payments.length > 0 ? (
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
                        <th style={thStyle}>Số lần</th>
                        <th style={thStyle}>Thời gian thanh toán</th>
                        <th style={thStyle}>Nội dung</th>
                        <th style={thStyle}>Trạng thái</th>
                        <th style={thStyle}>Phương thức</th>
                        <th style={thStyle}>Tổng tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {record?.payments?.map((item, i) =>
                        <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
                          {/* Chỉ hiển thị sku.code ở hàng đầu tiên của detail */}
                          <td style={tdStyle}>
                            {i + 1}
                          </td>
                          <td style={tdStyle}>
                            {dateFormatOnSubmit(item?.confirmTime)}
                          </td>
                          <td style={tdStyle}>
                            {(item?.content)}
                          </td>
                          <td style={tdStyle}>
                            {item?.isConfirm === 1 ? "Đã duyệt" : "Chưa duyệt"}
                          </td>
                          <td style={tdStyle}>
                            {item?.method}
                          </td>
                          <td style={tdStyle}>
                            {formatMoney(item?.amount) || "N/A"}
                          </td>

                        </tr>
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

export default DuyetTienPage
