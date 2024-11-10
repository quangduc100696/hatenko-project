import React, { useCallback, useState } from 'react';
import RestList from "components/RestLayout/RestList";
import useGetList from "hooks/useGetList";
import { Helmet } from "react-helmet";
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import Filter from './Filter';
import { Button } from 'antd';
import { InAppEvent } from "utils/FuseUtils";
import { HASH_MODAL } from 'configs';
import { dateFormatOnSubmit, formatTime } from 'utils/dataUtils';

const Index = () => {

  const onEdit = (item) => {
    let title = 'Sửa sản phẩm # ' + item.id;
    let hash = '#draw/product.edit';
    InAppEvent.emit(HASH_MODAL, { hash, title, data: item });
  }

  const onCreateProduct = () => InAppEvent.emit(HASH_MODAL, {
    hash: '#draw/product.edit',
    title: 'Tạo mới sản phẩm',
    data: { createdAt: new Date() }
  });

	const [ title ] = useState("Danh sách sản phẩm");
	const CUSTOM_ACTION = [
		{
      title:"Id",
      dataIndex:'id',
      width:100
    },
		{
      title:"Employe",
      dataIndex:'userCreate',
      width:120,
      ellipsis: true
    },
    {
      title:"Type",
      dataIndex:'type',
      width:200,
      ellipsis: true
    },
		{
      title:"Review",
      dataIndex:'userCheck',
      width:150,
      ellipsis: true
    },
		{
      title:"Appoved",
      dataIndex:'userAppoved',
      width:150,
      ellipsis: true
    },
		{
      title:"Begin",
      dataIndex:'startedAt',
      width:150,
      ellipsis: true
    },
    {
      title:"End",
      dataIndex:'endAt',
      width:150,
      ellipsis: true
    },
    {
      title:"Created",
      dataIndex:'createdAt',
      width:120,
      ellipsis: true,
			render: (createdAt) => formatTime(createdAt)
    },
		{
      title:"Status",
      dataIndex:'status',
      ellipsis: true
    },
		{
      title:"",
      width:100,
      fixed:'right',
      render: (record) => (
        <Button color="danger" variant="dashed" onClick={() => onEdit(record)} size='small'>Detail</Button>
      )
    }
	];

  const beforeSubmitFilter = useCallback((values) => {
    dateFormatOnSubmit(values, ['from', 'to']);
    return values;
  }, []);

	return (
		<>
			<Helmet>
				<title>{title}</title>
			</Helmet>
			<CustomBreadcrumb
				data={[ { title: 'Trang chủ' }, { title: title} ]}
			/>
			<RestList
				xScroll={1200}
				initialFilter={{ limit: 10, page: 1 }}
				filter={<Filter />}
        beforeSubmitFilter={beforeSubmitFilter}
				useGetAllQuery={ useGetList }
				apiPath={'product/fetch'}
        customClickCreate={onCreateProduct}
				columns={CUSTOM_ACTION}
			/>
		</>
	)
}

export default Index;