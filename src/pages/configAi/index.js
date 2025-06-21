import React, { useState, useCallback } from 'react'
import { Helmet } from 'react-helmet'
import { Button, Tooltip } from 'antd';
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import RestList from 'components/RestLayout/RestList';
import { arrayEmpty, dateFormatOnSubmit } from 'utils/dataUtils';
import LeadFilter from './filter';
import useGetList from 'hooks/useGetList';
import { InAppEvent } from 'utils/FuseUtils';
import { HASH_MODAL } from 'configs';

const ConfigAi = () => {
  const [title] = useState("Cấu hình Ai");

  const onData = useCallback((values) => {
    if (arrayEmpty(values)) {
      return values;
    }
    const newData = { embedded: values, page: { pageSize: 10, total: 1 } }
    return newData;
  }, []);

  const beforeSubmitFilter = useCallback((values) => {
    dateFormatOnSubmit(values, ['from', 'to']);
    return values;
  }, []);

  const onCreateLead = () => InAppEvent.emit(HASH_MODAL, {
    hash: '#draw/tranfer.edit',
    title: 'Tạo mới tranfer',
    data: {}
  });

  const onEdit = (record) => InAppEvent.emit(HASH_MODAL, {
    hash: '#draw/tranfer.edit',
    title: 'Cập nhật tranfer',
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
          placement="topLeft"
          overlayStyle={{ maxWidth: 400, maxHeight: 'auto', overflowY: 'auto', whiteSpace: 'pre-wrap' }}
          title={text}>
          <div style={{ cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: 'description',
      width: 250,
      ellipsis: true,
      render: (text) => (
        <Tooltip
          placement="topLeft"
          overlayStyle={{ maxWidth: 400, maxHeight: 'auto', overflowY: 'auto', whiteSpace: 'pre-wrap' }}
          title={<pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{text}</pre>}>
          <div style={{ cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Giới thiệu",
      dataIndex: 'intro',
      width: 250,
      ellipsis: true,
      render: (text) => (
        <Tooltip
          placement="topLeft"
          overlayStyle={{ maxWidth: 400, maxHeight: 'auto', overflowY: 'auto', whiteSpace: 'pre-wrap' }}
          title={<pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{text}</pre>}>
          <div style={{ cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Đầu vào",
      dataIndex: 'input',
      width: 250,
      ellipsis: true,
      render: (text) => (
        <Tooltip
          placement="topLeft"
          overlayStyle={{ maxWidth: 400, maxHeight: 'auto', overflowY: 'auto', whiteSpace: 'pre-wrap' }}
          title={<pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{text}</pre>}>
          <div style={{ cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Đầu ra",
      dataIndex: 'output',
      width: 350,
      ellipsis: true,
      render: (text) => (
        <Tooltip
          placement='left'
          overlayStyle={{ maxWidth: 400, maxHeight: 'auto', overflowY: 'auto', whiteSpace: 'pre-wrap' }}
          title={<pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{text}</pre>}>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {text}
          </div>
        </Tooltip>
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
        apiPath={`context-type/fetch`}
        customClickCreate={onCreateLead}
        columns={CUSTOM_ACTION}
      />
    </div>
  )
}

export default ConfigAi
