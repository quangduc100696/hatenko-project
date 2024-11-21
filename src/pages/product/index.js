import React, { useCallback, useState } from 'react';
import RestList from "components/RestLayout/RestList";
import useGetList from "hooks/useGetList";
import { Helmet } from "react-helmet";
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import Filter from './Filter';
import { Button } from 'antd';
import { InAppEvent } from "utils/FuseUtils";
import { HASH_MODAL } from 'configs';
import { arrayEmpty, dateFormatOnSubmit, formatTime } from 'utils/dataUtils';
import ProductAttrService from 'services/ProductAttrService';
import { cloneDeep } from 'lodash';

const Index = () => {

  const onEdit = (item) => {
    let title = 'Sửa sản phẩm # ' + item.id;
    let hash = '#draw/product.edit';
    let data = cloneDeep(item);
    let skus = [], listProperties = [];
    for(const property of item.listProperties) {
      let attr = listProperties.find(i => i.attributedId === property.attributedId);
      if(attr) {
        attr.attributedValueId.push(property.attributedValueId);
      } else {
        attr = { attributedId: property.attributedId, attributedValueId: [property.attributedValueId]}
        listProperties.push(attr);
      }
    }
    for(const iSkus of item.skus) {
      let item = { name: iSkus.name, listPriceRange: iSkus.listPriceRange }
      let details = [];
      for(const detail of iSkus.skuDetail) {
        details.push([detail.attributedId, detail.attributedValueId]);
      }
      item.sku = details;
      skus.push(item);
    }
    data.listProperties = listProperties;
    data.skus = skus;
    InAppEvent.emit(HASH_MODAL, { hash, title, data });
  }

  const onCreateProduct = () => InAppEvent.emit(HASH_MODAL, {
    hash: '#draw/product.edit',
    title: 'Tạo mới sản phẩm',
    data: {}
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

  const onData = useCallback((values) => {
    if(arrayEmpty(values.embedded)) {
      return values;
    }
    let attrsId = [], attrsValuesId = [];
    for(let item of values.embedded) {
      attrsId = item.listProperties.map(i => i.attributedId).filter(i => i && i > 0);
      attrsValuesId = item.listProperties.map(i => i.attributedValueId).filter(i => i && i > 0);
    }
    ProductAttrService.loadByIds(attrsId);
    ProductAttrService.loadValueByIds(attrsValuesId);
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
				apiPath={'product/fetch'}
        customClickCreate={onCreateProduct}
				columns={CUSTOM_ACTION}
			/>
		</>
	)
}

export default Index;