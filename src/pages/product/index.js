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
    data: { 
      "status": 1,
      "name": "Hữu Long",
      "serviceId": 10008,
      "providerId": 10008,
      "listProperties": [
        { "attributedId": 10008, "attributedValueId": [ 10009 ] },
        { "attributedId": 10009, "attributedValueId": [ 10010, 10011 ] }
      ],
      "skus": [
        {
          "listPriceRange": [
            { "start": 1, "end": 2, "price": 500000 }
          ],
          "sku": [
            [ 10008, 10009 ],
            [ 10009, 10011 ]
          ]
        }
      ],
      "listOpenInfo": [
        { "name": "Môi trường", "value": "Ánh sáng dưới 30C" }
      ]
    }
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