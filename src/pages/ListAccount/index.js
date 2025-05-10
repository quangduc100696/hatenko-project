import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import RestList from 'components/RestLayout/RestList';
import LeadFilter from './Filter';
import useGetList from "hooks/useGetList";
import { dateFormatOnSubmit, f5List } from 'utils/dataUtils';
import { HASH_MODAL } from 'configs';
import { InAppEvent } from 'utils/FuseUtils';
import useGetMe from 'hooks/useGetMe';
import { Button, Col, Form, Row } from 'antd';
import ModaleStyles from 'pages/lead/style';
import { useForm } from 'antd/es/form/Form';
import FormInput from 'components/form/FormInput';
import RequestUtils from 'utils/RequestUtils';
import { cloneDeep } from 'lodash';

const ListUser = () => {

  const { user: profile } = useGetMe();
  const [title] = useState("Danh sách tài khoản");
  const [isOpen, setIsOpen] = useState(false);
  const [detailWareHouse, setDetailWareHouse] = useState({});
  const [form] = useForm();

  const CUSTOM_ACTION = [
    {
      title: "Hộ và tên",
      ataIndex: 'Fullname',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.fullName}
          </div>
        )
      }
    },
    {
      title: "Số điện thoại",
      ataIndex: 'mobile',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.phone || 'N/A'}
          </div>
        )
      }
    },
    {
      title: "Email",
      ataIndex: 'email',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.email || 'N/A'}
          </div>
        )
      }
    },
    {
      title: "Địa chỉ",
      ataIndex: 'address',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.address || 'N/A'}
          </div>
        )
      }
    },
    // {
    //   title: "Thao tác",
    //   width: 120,
    //   fixed: 'right',
    //   render: (record) => (
    //     <div>
    //       <Button color="primary" variant="dashed" size='small' onClick={() => {
    //         setIsOpen(true)
    //       }}>
    //         Update
    //       </Button>
    //     </div>
    //   )
    // }
  ];

  const onData = useCallback((values) => {
    const newData = { embedded: values.embedded, page: { pageSize: 10, total: 1 } }
    return newData;
  }, []);

  const beforeSubmitFilter = useCallback((values) => {
    dateFormatOnSubmit(values, ['from', 'to']);
    return values;
  }, []);

  const onCreateLead = () => {
    let title = 'Tạo tài khoản';
    let hash = '#draw/userAccount.edit';
    let data = {}
    InAppEvent.emit(HASH_MODAL, { hash, title, data });
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
        apiPath={'user/list'}
        customClickCreate={onCreateLead}
        columns={CUSTOM_ACTION}
      />
    </div>
  )
}

export default ListUser

