import React, { useCallback, useEffect, useState } from 'react';
import RestList from "components/RestLayout/RestList";
import useGetList from "hooks/useGetList";
import { Helmet } from "react-helmet";
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import Filter from './Filter'
import { Button, Image } from 'antd';
import { InAppEvent } from "utils/FuseUtils";
import { HASH_MODAL } from 'configs';
import { arrayEmpty, dateFormatOnSubmit, formatMoney, formatTime } from 'utils/dataUtils';
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

const Listwarehouse = () => {
  const [listStatus, setListStatus] = useState([])

  const onEdit = (item) => {
    let title = 'Xuất kho không theo đơn # ';
    let hash = '#draw/warehouseAction.edit';
    let data = cloneDeep(item);
    InAppEvent.emit(HASH_MODAL, { hash, title, data });
  }

  const onCreateProduct = () => InAppEvent.emit(HASH_MODAL, {
    hash: '#draw/product.edit',
    title: 'Tạo mới sản phẩm',
    data: {}
  });

  useEffect(() => {
    (async() => {
      const { data } = await RequestUtils.Get('/warehouse-export/fetch-status');
      setListStatus(data)
    })()
  },[])

  const [title] = useState("Danh sách sản phẩm");
  const CUSTOM_ACTION = [
    {
      title: "Thời gian",
      dataIndex: 'updateTime',
      width: 120,
      ellipsis: true,
      render: (updateTime) => formatTime(updateTime)
    },
    {
      title: "Status",
      dataIndex: 'status',
      ellipsis: true,
      width: 120,
      render: (status) => !status ? 'N/A' : status
    },
    {
      title: "Ghi chú",
      dataIndex: 'note',
      ellipsis: true,
      width: 120,
      render: (note) => {
        return (
          <div>{note}</div>
        )
      }
    },
    {
      title: "Action",
      width: 50,
      fixed: 'right',
      render: (record) => (
        <Button color="primary" variant="dashed" size='small' onClick={() => onEdit(record)}>Cập nhật</Button>
      )
    }
  ];

  const beforeSubmitFilter = useCallback((values) => {
    dateFormatOnSubmit(values, ['from', 'to']);
    return values;
  }, []);

  const onData = useCallback((values) => {
    if (arrayEmpty(values.embedded)) {
      return values;
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
        expandable={{
          expandedRowRender: (record) => {
            return (
              <div style={{ padding: "10px", background: "#f9f9f9", borderRadius: "8px" }}>
                {
                  record?.items?.length > 0 ? (
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
                          <th style={thStyle}>Tên Sản phẩm</th>
                          <th style={thStyle}>Trạng thái</th>
                          <th style={thStyle}>Giá</th>
                          <th style={thStyle}>Số lượng</th>
                          <th style={thStyle}>Tổng tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {record?.items?.map((item) => {
                          const nameWarehouseStatus = listStatus.find(f => f.id === item.status)
                          return (
                            item.detaiItems.map((v, i) => {
                              return (
                                <tr key={v} style={{ borderBottom: "1px solid #ddd" }}>
                                  <td style={tdStyle}>
                                    {v.name || 'N/A'}
                                  </td>
                                  <td style={tdStyle}>
                                    {nameWarehouseStatus?.name}
                                  </td>
                                  <td style={tdStyle}>
                                    {formatMoney(v.price)}
                                  </td>
                                  <td style={tdStyle}>
                                    {v.quantity}
                                  </td>
                                  <td style={tdStyle}>
                                    {formatMoney(v.total)}
                                  </td>
                                </tr>
                              )
                            })
                          )
                        })}
                      </tbody>
                    </table>
                  ) : 'N/A'
                }
              </div>
            )
          },
        }}
        apiPath={'warehouse-export/fetch'}
        customClickCreate={onCreateProduct}
        columns={CUSTOM_ACTION}
      />
    </>
  )
}

export default Listwarehouse;