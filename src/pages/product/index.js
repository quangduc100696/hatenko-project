import React, { useCallback, useState } from 'react';
import RestList from "components/RestLayout/RestList";
import useGetList from "hooks/useGetList";
import { Helmet } from "react-helmet";
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import Filter from './Filter';
import { Button, Image } from 'antd';
import { InAppEvent } from "utils/FuseUtils";
import { GATEWAY, HASH_MODAL } from 'configs';
import { arrayEmpty, dateFormatOnSubmit, formatTime } from 'utils/dataUtils';
import ProductAttrService from 'services/ProductAttrService';
import { cloneDeep } from 'lodash';
import SkuView, { PriceView } from 'containers/Product/SkuView';

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
      let item = {id: iSkus?.id, name: iSkus.name, listPriceRange: iSkus.listPriceRange }
      let details = [];
      for(const detail of iSkus.skuDetail) {
        details.push({id: detail?.id, attributedId: detail.attributedId, attributedValueId: detail.attributedValueId});
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
      title:"Mã",
      dataIndex:'code',
      width:100
    },
    {
      title:"Hình ảnh",
      dataIndex:'image',
      width: 150,
      ellipsis: true,
      render: (image) => {
        return (
          <Image
          width={70}
          src={`${image ? `${GATEWAY}${image}` : '/img/image_not_found.png'}`}
          alt='image'
        />
        )
      }
    },
		{
      title:"Sản phẩm",
      dataIndex:'name',
      width:200,
      ellipsis: true
    },
    {
      title:"SKus",
      dataIndex:'skus',
      width:400,
      ellipsis: true,
      render: (skus) => <SkuView skus={skus}/>
    },
    {
      title:"Giá bán",
      dataIndex:'skus',
      width:250,
      ellipsis: true,
      render: (skus) => <PriceView skus={skus}/>
    },
    {
      title:"Số lượng tổng",
      width: 150,
      ellipsis: true,
      render: (item) => {
        const totalQuantity = item?.warehouses.reduce((total, v) => total + v.quantity, 0);
        return (
          <div style={{textAlign: 'center'}}>{totalQuantity === 0 ? 'Chưa cập nhật' : totalQuantity}</div>
        )
      }
    },
    {
      title:"Created",
      dataIndex:'createdTime',
      width:120,
      ellipsis: true,
			render: (createdAt) => formatTime(createdAt)
    },
		{
      title:"Status",
      dataIndex:'status',
      ellipsis: true,
      width:120,
      render: (status) => (status || 0) === 0 ? 'Ngưng' : 'Kích hoạt'
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