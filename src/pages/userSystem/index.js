import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import RestList from 'components/RestLayout/RestList';
import LeadFilter from './Filter';
import useGetList from "hooks/useGetList";
import { dateFormatOnSubmit } from 'utils/dataUtils';
import { GATEWAY, HASH_MODAL } from 'configs';
import { InAppEvent } from 'utils/FuseUtils';
import { Button, Image } from 'antd';

const ListUserSystem = () => {
  const [ title ] = useState("Danh sách tài khoản hệ thống");
  const CUSTOM_ACTION = [
    {
      title: "Tên",
      ataIndex: 'fullName',
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
      title: "Avatar",
      ataIndex: 'avartar',
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            <Image
              width={70}
              src={`${item?.avartar ? `${GATEWAY}${item?.avartar}` : '/img/image_not_found.png'}`}
              alt='image'
            />
          </div>
        )
      }
    },
    {
      title: "Số điện thoại",
      ataIndex: 'phone',
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
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.email}

          </div>
        )
      }
    },
    {
      title: "Địa chỉ",
      ataIndex: 'address',
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.address || 'N/A'}
          </div>
        )
      }
    },
    {
      title: "Role tài khoản",
      ataIndex: 'userProfiles',
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.userProfiles?.map(f => f.type).join(",") || 'N/A'}
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
          <Button color="primary" variant="dashed" size='small' onClick={() => onHandleUpdateUser(record)}>
            Update
          </Button>
        </div>
      )
    }
  ];

  const onData = useCallback((values) => {
    return values;
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

  const onHandleUpdateUser = (datas) => {
    let title = 'Sửa tài khoản';
    let hash = '#draw/userAccount.edit';
    let data = datas;
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
        initialFilter={{ limit: 10, page: 1, fullName: '', ssoId: '' }}
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

export default ListUserSystem


