import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import RestList from 'components/RestLayout/RestList';
import LeadFilter from './LeadFilter';
import useGetList from "hooks/useGetList";
import { Button, Tag } from 'antd';
import { arrayEmpty, dateFormatOnSubmit, formatTime } from 'utils/dataUtils';
import { getSource, getStatusLead } from 'configs/constant';
import { HASH_MODAL } from 'configs';
import { InAppEvent } from 'utils/FuseUtils';

const LeadPage = () => {

  const [title] = useState("Danh sách Lead");

  const onEdit = (item) => {
    // let title = 'Sửa sản phẩm # ' + item.id;
    // let hash = '#draw/product.edit';
    // let data = cloneDeep(item);
    // let skus = [], listProperties = [];
  }

  const CUSTOM_ACTION = [
    {
      title: "NV",
      dataIndex: 'staff',
      width: 100
    },
    {
      title: "Hình thức",
      ataIndex: 'productId',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            <Tag color="orange">{item?.productId || 'N/A'}</Tag>
          </div>
        )
      }
    },
    {
      title: "Dịch vụ",
      ataIndex: 'serviceId',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.serviceId || 'N/A'}
          </div>
        )
      }
    },
    {
      title: "Ngày",
      ataIndex: 'inTime',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {formatTime(item?.inTime)}
          </div>
        )
      }
    },
    {
      title: "Nguồn",
      ataIndex: 'source',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {getSource(item?.source)}
          </div>
        )
      }
    },
    {
      title: "Khách hàng",
      ataIndex: 'customerName',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.customerName}
          </div>
        )
      }
    },
    {
      title: "Số đ/t",
      ataIndex: 'customerMobile',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.customerMobile}
          </div>
        )
      }
    },
    {
      title: "Trạng thái",
      ataIndex: 'status',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {getStatusLead(item?.status)}
          </div>
        )
      }
    },
    {
      title: "Sale",
      ataIndex: 'saleId',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.saleId || 'N/A'}
          </div>
        )
      }
    },
    {
      title: "Thao tác",
      width: 100,
      fixed: 'right',
      render: (record) => (
        <Button color="danger" variant="dashed" onClick={() => onEdit(record)} size='small'>Detail</Button>
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

  const onCreateLead = () => InAppEvent.emit(HASH_MODAL, {
    hash: '#draw/lead.edit',
    title: 'Tạo mới Lead',
    data: {}
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
        beforeSubmitFilter={beforeSubmitFilter}
        useGetAllQuery={useGetList}
        apiPath={'data/lists'}
        customClickCreate={onCreateLead}
        columns={CUSTOM_ACTION}
      />
    </div>
  )
}

export default LeadPage
