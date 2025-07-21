import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import RestList from 'components/RestLayout/RestList';
import LeadFilter from './Filter';
import useGetList from "hooks/useGetList";
import { Image } from 'antd';
import { arrayEmpty, dateFormatOnSubmit } from 'utils/dataUtils';
import { GATEWAY, HASH_MODAL } from 'configs';
import { InAppEvent } from 'utils/FuseUtils';
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

const ListInStocK = () => {

  const [ title ] = useState("Trong kho");
  const [ page ] = useState(1);
  const [ listProvince, setListProvince ] = useState([]);

  useEffect(() => {
    (async () => {
      const [province] = await Promise.all([
        await RequestUtils.Get(`/provider/fetch?page=${page}&limit=10`)
      ])
      if (province) {
        setListProvince(province?.data?.embedded);
      }
    })()
  }, [page])

  const CUSTOM_ACTION = [
    {
      title: "Mã S/P",
      ataIndex: 'status',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.product?.code}
          </div>
        )
      }
    },
    {
      title: "Tên mã S/P",
      ataIndex: 'status',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.skuName}
          </div>
        )
      }
    },
    {
      title: "Tên sản phẩm",
      ataIndex: 'status',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.product?.name}
          </div>
        )
      }
    },
    {
      title: "Hình ảnh",
      ataIndex: 'status',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <Image
            width={70}
            src={`${item.product?.image ? `${GATEWAY}${item.product?.image}` : '/img/image_not_found.png'}`}
            alt='image'
          />
        )
      }
    },
    {
      title: "Ngày nhập",
      ataIndex: 'inTime',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {dateFormatOnSubmit(item?.product?.updatedTime)}
          </div>
        )
      }
    },
    {
      title: "Tên kho",
      ataIndex: 'stockName',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.stockName || 'N/A'}
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
      title: "Số lượng",
      ataIndex: 'quantity',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.quantity}
          </div>
        )
      }
    },
    {
      title: "Sku",
      width: 350,
      ellipsis: true,
      render: (item) => {
        const skuDetail = item.product.skus.find(f => f.id === item.skuId);

        return (
          <div>
            <p style={{ marginRight: "10px" }}>
              <strong>{skuDetail?.skuDetail[0]?.name}:</strong> {skuDetail?.skuDetail[0]?.value}
            </p>
            {skuDetail?.skuDetail?.length > 1 && <span> ...</span>}
          </div>
        )
      }
    },
    // {
    //   title: "Chi phí",
    //   ataIndex: 'fee',
    //   width: 200,
    //   ellipsis: true,
    //   render: (item) => {
    //     return (
    //       <div>
    //         {formatMoney(item?.fee)}
    //       </div>
    //     )
    //   }
    // },
    // {
    //   title: "Thao tác",
    //   width: 190,
    //   fixed: 'right',
    //   ellipsis: true,
    //   render: (record) => {
    //     return (
    //       <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
    //         {approveOrder && record.status === 3 && (
    //           <Button color="danger" variant="dashed" onClick={() => onHandleApproveStatus(record)} size='small'>
    //             Duyệt lệnh
    //           </Button>
    //         )}
    //         <Button color="primary" variant="dashed" onClick={() => onHandleEdit(record)} size='small'>
    //           Chi tiết
    //         </Button>
    //       </div>
    //     )
    //   }
    // }
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

  });

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
        hasCreate={false}
        beforeSubmitFilter={beforeSubmitFilter}
        useGetAllQuery={useGetList}
        apiPath={'warehouse/fetch'}
        expandable={{
          expandedRowRender: (record) => {
            const nameStatus = listProvince.find(f => f?.id === record?.product?.providerId);
            return (
              <div style={{ padding: "10px", background: "#f9f9f9", borderRadius: "8px" }}>
                {record.product ? (
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
                        <th style={thStyle}>Mã đơn</th>
                        <th style={thStyle}>Tên sản phẩm</th>
                        <th style={thStyle}>Hình ảnh</th>
                        <th style={thStyle}>Nhà cung cấp</th>
                        <th style={thStyle}>Đơn vị</th>
                        <th style={thStyle}>Thuộc tính</th>
                      </tr>
                    </thead>
                    <tbody>
                      <td style={tdStyle}>
                        {record.product?.code || "N/A"}
                      </td>
                      <td style={tdStyle}>
                        {record.product?.name || "N/A"}
                      </td>
                      <td style={tdStyle}>
                        <Image
                          width={70}
                          src={`${record.product?.image ? `${GATEWAY}${record.product?.image}` : '/img/image_not_found.png'}`}
                          alt='image'
                        />
                      </td>
                      <td style={tdStyle}>
                        {nameStatus?.name || "N/A"}
                      </td>
                      <td style={tdStyle}>
                        {record.product?.unit || "N/A"}
                      </td>
                      <td style={tdStyle}>
                        <p style={{ marginRight: "10px" }}>
                          <strong>{record.product.listProperties[0]?.name}:</strong> {record.product.listProperties[0]?.value}
                        </p>
                        {record.product.listProperties?.length > 1 && <span> ...</span>}
                      </td>
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

export default ListInStocK
