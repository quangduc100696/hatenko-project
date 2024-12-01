import React, { useCallback, useState } from 'react';
import RestList from "components/RestLayout/RestList";
import useGetList from "hooks/useGetList";
import { Helmet } from "react-helmet";
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import Filter from './Filter';
import { Button } from 'antd';
import { InAppEvent } from "utils/FuseUtils";
import { HASH_MODAL } from 'configs';
import { arrayEmpty, dateFormatOnSubmit, formatMoney, formatTime } from 'utils/dataUtils';
import { cloneDeep } from 'lodash';

const Order = () => {

  const onEdit = (item) => {
    let title = 'Sửa đơn hàng # ' + item.id;
    let hash = '#draw/order.edit';
    let data = cloneDeep(item);
    InAppEvent.emit(HASH_MODAL, { hash, title, data });
  }

  const onCreateProduct = () => InAppEvent.emit(HASH_MODAL, {
    hash: '#draw/order.edit',
    title: 'Tạo mới đơn hàng',
    data: {}
  });

	const [ title ] = useState("Danh sách đơn hàng");
	const CUSTOM_ACTION = [
		{
      title:"Mã đơn",
      dataIndex:'code',
      width:150
    },
		{
      title:"Nhân viên",
      dataIndex:'userCreateUsername',
      width:120,
      ellipsis: true
    },
    {
      title:"K.Hàng",
      dataIndex:'customerReceiverName',
      width:200,
      ellipsis: true
    },
		{
      title:"Số ĐT",
      dataIndex:'customerMobilePhone',
      width:150,
      ellipsis: true
    },
		{
      title:"Sản Phẩm",
      dataIndex:'userAppoved',
      width:150,
      ellipsis: true
    },
		{
      title:"Đơn giá",
      dataIndex:'subtotal',
      width:150,
      ellipsis: true,
      render: (subtotal) => formatMoney(subtotal)
    },
    {
      title:"Giảm giá",
      dataIndex:'priceOff',
      width:150,
      ellipsis: true,
      render: (priceOff) => formatMoney(priceOff)
    },
    {
      title:"VAT",
      dataIndex:'vat',
      width:80,
      ellipsis: true
    },
    {
      title:"Tổng đơn",
      dataIndex:'total',
      width:150,
      ellipsis: true,
      render: (total) => formatMoney(total)
    },
    {
      title:"Thanh toán",
      dataIndex:'paid',
      width:150,
      ellipsis: true,
      render: (paid) => formatMoney(paid)
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

  const onData = useCallback((values) => {
    if(arrayEmpty(values.embedded)) {
      return [];
    }
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
        onData={onData}
				initialFilter={{ limit: 10, page: 1 }}
				filter={<Filter />}
        beforeSubmitFilter={beforeSubmitFilter}
				useGetAllQuery={ useGetList }
				apiPath={'order/fetch'}
        customClickCreate={onCreateProduct}
				columns={CUSTOM_ACTION}
			/>
		</>
	)
}

export default Order;