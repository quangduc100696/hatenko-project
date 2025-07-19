import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import RestList from 'components/RestLayout/RestList';
import LeadFilter from './Filter';
import useGetList from "hooks/useGetList";
import { Button } from 'antd';
import { arrayEmpty, dateFormatOnSubmit, formatTime } from 'utils/dataUtils';
import { HASH_MODAL } from 'configs';
import { InAppEvent } from 'utils/FuseUtils';

const ListCustomerRetail = () => {

  const [ title ] = useState("Khách lẻ");
  const CUSTOM_ACTION = [
    {
      title: "Tên khách hàng",
      ddataIndex: 'name',
      width: 150
    },
    {
      title: "Số điện thoại",
      dataIndex: 'mobile',
      width: 200,
      ellipsis: true
    },
    {
      title: "Email",
      dataIndex: 'email',
      width: 200,
      ellipsis: true,
      render: (email) => email || '(Chưa có)'
    },
    {
      title: "Ngày tạo",
      dataIndex: 'createdAt',
      width: 200,
      ellipsis: true,
      render: (createdAt) => dateFormatOnSubmit(createdAt)
    },
    {
      title: "Ngày sinh",
      dataIndex: 'dateOfBirth',
      width: 200,
      ellipsis: true,
      render: (dateOfBirth) => formatTime(dateOfBirth)
    },
    {
      title: "Sale",
      dataIndex: 'sale',
      width: 100,
      ellipsis: true
    },
    {
      title: "Giới tính",
      dataIndex: 'gender',
      width: 200,
      ellipsis: true
    },
    {
      title: "Thao tác",
      width: 120,
      fixed: 'right',
      ellipsis: true,
      render: (record) => (
        <Button color="primary" variant="dashed" onClick={() => onHandleEdit(record)} size='small'>
          Chi tiết
        </Button>
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
    hash: '#draw/warehouse.edit',
    title: 'Tạo mới kho',
    data: {}
  });

  const onHandleEdit = (record) => {
    let title = 'Thông tin khách hàng';
    let hash = '#draw/cutomerRetail.edit';
    InAppEvent.emit(HASH_MODAL, { hash, title, data: record });
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
        apiPath={'customer/fetch-customer-personal'}
        customClickCreate={onCreateLead}
        columns={CUSTOM_ACTION}
      />
    </div>
  )
}

export default ListCustomerRetail
