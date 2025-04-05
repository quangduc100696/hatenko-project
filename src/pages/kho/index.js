import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import RestList from 'components/RestLayout/RestList';
import LeadFilter from './Filter';
import useGetList from "hooks/useGetList";
import { Button, Form, Tag } from 'antd';
import { arrayEmpty, dateFormatOnSubmit, formatMoney } from 'utils/dataUtils';
import { HASH_MODAL } from 'configs';
import { InAppEvent } from 'utils/FuseUtils';
import RequestUtils from 'utils/RequestUtils';
import useGetMe from 'hooks/useGetMe';
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

const ListKho = () => {

  const { user: profile } = useGetMe();
  const [title] = useState("Nhập kho");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [listStatus, setListStatus] = useState([]);
  const [listProvince, setListProvince] = useState([]);
  const approveOrder = profile?.userProfiles.map(f => f.type).includes("ROLE_ADMIN")

  useEffect(() => {
    (async () => {
      const [status, province] = await Promise.all([
        await RequestUtils.Get(`/warehouse-history/fetch-status`),
        await RequestUtils.Get(`/provider/fetch?page=${page}&limit=${limit}`)
      ])
      if (status || province) {
        setListProvince(province?.data?.embedded);
        setListStatus(status?.data);
      }
    })()
  }, [])

  const CUSTOM_ACTION = [
    {
      title: "Người dùng",
      dataIndex: 'userName',
      width: 150
    },
    // {
    //   title: "Trạng thái",
    //   ataIndex: 'status',
    //   width: 200,
    //   ellipsis: true,
    //   render: (item) => {
    //     const nameStatus = listStatus.find(f => f?.id === item?.status);
    //     return (
    //       <div>
    //         <Tag color="orange">{nameStatus?.name}</Tag>
    //       </div>
    //     )
    //   }
    // },
    {
      title: "Ngày nhập",
      ataIndex: 'inTime',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {dateFormatOnSubmit(item?.inTime)}
          </div>
        )
      }
    },
    {
      title: "Giảm giá",
      ataIndex: 'discount',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.discount || 'N/A'}
          </div>
        )
      }
    },
    {
      title: "Nhà cung cấp",
      ataIndex: 'providerId',
      width: 200,
      ellipsis: true,
      render: (item) => {
        const nameStatus = listProvince.find(f => f?.id === item?.providerId);
        return (
          <div>
            {nameStatus?.name}
          </div>
        )
      }
    },
    {
      title: "Chi phí",
      ataIndex: 'fee',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {formatMoney(item?.fee)}
          </div>
        )
      }
    },
    {
      title: "Thao tác",
      width: 190,
      fixed: 'right',
      ellipsis: true,
      render: (record) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
            {approveOrder && record.status === 3 && (
              <Button color="danger" variant="dashed" onClick={() => onHandleApproveStatus(record)} size='small'>
                Duyệt lệnh
              </Button>
            )}
            <Button color="primary" variant="dashed" onClick={() => onHandleEdit(record)} size='small'>
              Chi tiết
            </Button>
          </div>
        )
      }
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

  const onCreateLead = () => InAppEvent.emit(HASH_MODAL, {
    hash: '#draw/warehouse.edit',
    title: 'Tạo mới kho',
    data: {}
  });

  const onHandleEdit = (record) => {
    let title = 'Chi tiết kho';
    let hash = '#draw/warehouse.edit';
    InAppEvent.emit(HASH_MODAL, { hash, title, data: record });
  }

  // duyệt lệnh
  const onHandleApproveStatus = async (record) => {
    await RequestUtils.Get(`/warehouse-history/fetch-status?id=${record?.id}`).then(data => {
      if(data?.errorCode === 200) {
        InAppEvent.normalSuccess("Duyệt lệnh thành công ?");
      }
    })
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
        apiPath={'warehouse-history/fetch'}
        expandable={{
          expandedRowRender: (record) => {
            return (
              <div style={{ padding: "10px", background: "#f9f9f9", borderRadius: "8px" }}>
                {record.items && record.items.length > 0 ? (
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
                        <th style={thStyle}>Tên sản phẩm</th>
                        <th style={thStyle}>Nhà cung cấp</th>
                        <th style={thStyle}>Số lượng</th>
                        <th style={thStyle}>Giá bán</th>
                        <th style={thStyle}>Tổng tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {record.items.map((sku, index) => {
                        const nameStatus = listProvince?.find(f => f?.id === sku?.providerId);
                        return (
                          <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                            {/* Chỉ hiển thị sku.code ở hàng đầu tiên của detail */}
                            <td style={tdStyle}>
                              {sku?.productName || "N/A"}
                            </td>
                            <td style={tdStyle}>
                              {nameStatus?.name || "N/A"}
                            </td>
                            <td style={tdStyle}>
                              {sku?.quality}
                            </td>
                            <td style={tdStyle}>
                              {formatMoney(sku?.price)}
                            </td>
                            <td style={tdStyle}>
                              {formatMoney(sku?.fee) || "N/A"}
                            </td>
                          </tr>
                        )
                      })}
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

export default ListKho
