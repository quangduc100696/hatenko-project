import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import RestList from 'components/RestLayout/RestList';
import LeadFilter from './Filter';
import useGetList from "hooks/useGetList";
import { dateFormatOnSubmit, f5List, formatTime } from 'utils/dataUtils';
import { HASH_MODAL } from 'configs';
import { InAppEvent } from 'utils/FuseUtils';
import useGetMe from 'hooks/useGetMe';
import { Button } from 'antd';
import { formatTimeStr } from 'antd/es/statistic/utils';
import { getTypeGroup } from 'configs/constant';
import RequestUtils from 'utils/RequestUtils';

const ListUserGroup = () => {

  const { user: profile } = useGetMe();
  const [title] = useState("Danh sách tài khoản Team");
  const [listMember, setListMember] = useState([])

  useEffect(() => {
    (async () => {
      await RequestUtils.Get('/user/list-name-id').then(list => {
        setListMember(list.data)
      })
    })()
  }, [])

  const CUSTOM_ACTION = [
    {
      title: "Tên",
      ataIndex: 'name',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.name}
          </div>
        )
      }
    },
    {
      title: "Tên Leader",
      ataIndex: 'leaderName',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.leaderName || 'N/A'}
          </div>
        )
      }
    },
    {
      title: "Thời gian",
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
      title: "D/s thành viên",
      ataIndex: 'listMember',
      width: 200,
      ellipsis: true,
      render: (item) => {
        const nameUser = listMember.filter(f => item?.listMember.includes(f?.id))
        return (
          <div>
            {nameUser.map(item => item.name).join(",") || 'N/A'}
          </div>
        )
      }
    },
    {
      title: "S/L thành viên",
      ataIndex: 'memberNumber',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.memberNumber || 'N/A'}
          </div>
        )
      }
    },
    {
      title: "Loại tài khoản",
      ataIndex: 'address',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {getTypeGroup(item?.type)}
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
    const newData = { embedded: values, page: { pageSize: 10, total: 1 } }
    return newData;
  }, []);

  const beforeSubmitFilter = useCallback((values) => {
    dateFormatOnSubmit(values, ['from', 'to']);
    return values;
  }, []);

  const onCreateLead = () => {
    let title = 'Tạo tài khoản Group';
    let hash = '#draw/userGroup.edit';
    let data = { listMember: listMember }
    InAppEvent.emit(HASH_MODAL, { hash, title, data });
  }

  const onHandleUpdateUser = (datas) => {
    let title = 'Sửa tài khoản Group';
    let hash = '#draw/userGroup.edit';
    let data = { listMember: listMember, datas };
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
        apiPath={'user-group/fetch'}
        customClickCreate={onCreateLead}
        columns={CUSTOM_ACTION}
      />
    </div>
  )
}

export default ListUserGroup


