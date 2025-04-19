import React, { useCallback, useState } from 'react';
import RestList from "components/RestLayout/RestList";
import useGetList from "hooks/useGetList";
import { Helmet } from "react-helmet";
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import Filter from './Filter'
import { Button, Image } from 'antd';
import { InAppEvent } from "utils/FuseUtils";
import { GATEWAY, HASH_MODAL } from 'configs';
import { arrayEmpty, dateFormatOnSubmit, formatMoney, formatTime } from 'utils/dataUtils';
import ProductAttrService from 'services/ProductAttrService';
import { cloneDeep } from 'lodash';
import SkuView, { PriceView } from 'containers/Product/SkuView';


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

  const onEdit = (item) => {
    let title = 'Sửa sản phẩm # ' + item.id;
    let hash = '#draw/product.edit';
    let data = cloneDeep(item);
    let skus = [], listProperties = [];
    for (const property of item.listProperties) {
      let attr = listProperties.find(i => i.attributedId === property.attributedId);
      if (attr) {
        attr.attributedValueId.push(property.attributedValueId);
      } else {
        attr = { attributedId: property.attributedId, attributedValueId: [property.attributedValueId] }
        listProperties.push(attr);
      }
    }
    for (const iSkus of item.skus) {
      let item = { id: iSkus?.id, name: iSkus.name, listPriceRange: iSkus.listPriceRange }
      let details = [];
      for (const detail of iSkus.skuDetail) {
        details.push({ id: detail?.id, attributedId: detail.attributedId, attributedValueId: detail.attributedValueId });
      }
      item.sku = details;
      skus.push(item);
    }
    data.listProperties = listProperties;
    data.skus = skus;
    InAppEvent.emit(HASH_MODAL, { hash, title, data });
  }

  const onCreateProduct = () => InAppEvent.emit(HASH_MODAL, {
    hash: '#draw/product.edit',
    title: 'Tạo mới sản phẩm',
    data: {}
  });

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
    // {
    //   title: "",
    //   width: 100,
    //   fixed: 'right',
    //   render: (record) => (
    //     <Button color="danger" variant="dashed" onClick={() => onEdit(record)} size='small'>Detail</Button>
    //   )
    // }
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
                          return (
                            item.detaiItems.map((v, i) => {
                              return (
                                <tr key={v} style={{ borderBottom: "1px solid #ddd" }}>
                                  <td style={tdStyle}>
                                    {v.name || 'N/A'}
                                  </td>
                                  <td style={tdStyle}>
                                    {v.status}
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