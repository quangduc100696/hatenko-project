import React, { useState, useCallback } from 'react'
import { Helmet } from 'react-helmet'
import { Button, Tooltip } from 'antd';
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import RestList from 'components/RestLayout/RestList';
import { arrayEmpty, dateFormatOnSubmit } from 'utils/dataUtils';
import LeadFilter from './Filter';
import useGetList from 'hooks/useGetList';
import { InAppEvent } from 'utils/FuseUtils';
import { HASH_MODAL } from 'configs';

const LoaiLienHePage = () => {
  const [title] = useState("Loại liên hệ");

  const onData = useCallback((values) => {
    if (arrayEmpty(values)) {
      return values;
    }
    return values;
  }, []);

  const beforeSubmitFilter = useCallback((values) => {
    dateFormatOnSubmit(values, ['from', 'to']);
    return values;
  }, []);

  const onCreateLead = () => InAppEvent.emit(HASH_MODAL, {
    hash: '#draw/typeContact.edit',
    title: 'Tạo mới liên hệ',
    data: {}
  });

  const onEdit = (record) => InAppEvent.emit(HASH_MODAL, {
    hash: '#draw/typeContact.edit',
    title: 'Cập nhật liên hệ',
    data: record
  });

  const CUSTOM_ACTION = [
    {
      title: "Tên",
      dataIndex: 'name',
      width: 250,
      ellipsis: true,
      render: (text) => (
        <Tooltip
          placement="left"
          overlayStyle={{ maxWidth: 700, maxHeight: 'auto', overflowY: 'auto', whiteSpace: 'pre-wrap' }}
          title={text}>
          <div style={{ cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: 'content',
      width: 250,
      ellipsis: true,
      render: (content) => (
        <Tooltip
          placement="topLeft"
          overlayStyle={{ maxWidth: 400, maxHeight: 'auto', overflowY: 'auto', whiteSpace: 'pre-wrap' }}
          title={<pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{content}</pre>}>
          <div style={{ cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {content}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: 'created',
      width: 250,
      ellipsis: true,
      render: (date) => (
        <div>
          {date}
        </div>
      ),
    },
    {
      title: "Thao tác",
      width: 120,
      fixed: 'right',
      render: (record) => (
        <div>
          <Button color="primary"variant="dashed" onClick={() => onEdit(record)} size='small'>
            Cập nhật
          </Button>
        </div>
      )
    }
  ];

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
        initialFilter={{ limit: 10, page: 1, }}
        filter={<LeadFilter />}
        beforeSubmitFilter={beforeSubmitFilter}
        useGetAllQuery={useGetList}
        apiPath={`context/fetch`}
        customClickCreate={onCreateLead}
        columns={CUSTOM_ACTION}
      />
    </div>
  )
}

export default LoaiLienHePage

