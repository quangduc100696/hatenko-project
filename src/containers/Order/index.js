import React, { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import RestEditModal from 'components/RestLayout/RestEditModal';
import { InAppEvent } from 'utils/FuseUtils';
import RequestUtils from 'utils/RequestUtils';
import { arrayEmpty, encodeProperty, f5List } from 'utils/dataUtils';
import OrderForm from './OrderForm';
import ProductAttrService from 'services/ProductAttrService';
import { cloneDeep, merge } from 'lodash';
import { generateInForm } from './utils';

const log = (value) => console.log('[container.order.index] ', value);
const Order = ({ closeModal, data, title }) => {

  const [ record, setRecord ] = useState({});
  useEffect(() => {
    (async () => {
      let rForm = await generateInForm(data, 0);
      setRecord(rForm);
    })();
    return () => ProductAttrService.empty();
  }, [data]);
  
  const onSubmit = useCallback( async (data) => {
    const product = record.product;
    if(!product) {
      message.info("Can't create Order with empty Product .!");
      return;
    }
    if(!record?.customer) {
      message.info("Please Choise a Customer .!");
      return;
    }
    let values = cloneDeep(data);
    const { id, vat, discountUnit, discountValue, ...rest } = values;
    let discount = { discountUnit, discountValue };
    let input = { 
      id, 
      vat: vat || 0,
      customer: record?.customer
    };
    /* Loại bỏ detailCode, customerName */
    const { detailId, detailCode, customerName, ...detail } = rest;

    let details = record?.details ?? [];
    let entity = details.find(i => i.id === detailId) || {};
    if(!entity?.id && detailId !== "") {
      details.push(entity);
    }
    
    entity.productId = product.id;
    entity.skuInfo = product?.skus?.find(s => s.id === rest.skuId)?.skuDetail ?? [];
    entity.discount = discount;

    /* Xoá Id, code cho đơn thêm mới */
    if(detailId === "") {
      delete entity.id;
      delete entity.code;
    }

    encodeProperty(entity, ['skuInfo', 'discount']);
    merge(entity, detail); /* Copy detail to entity */
    if(!discountValue) {
      delete entity.discount;
    }

    input.details = details;
    log(input);
    if(arrayEmpty(input.details)) {
      message.info("Can't create Order with empty skus .!");
      return;
    }
    
    let params = (input?.id ?? '') === '' ? {} : { id: input.id };
    const { errorCode } = await RequestUtils.Post("/order/save", input, params);
    const isSuccess = errorCode === 200;
    if(isSuccess) {
      f5List('order/fetch');
    }
    InAppEvent.normalInfo(isSuccess ? "Cập nhật thành công" : "Lỗi cập nhật, vui lòng thử lại sau");
  }, [record]);

  return <>
    {/* <RestEditModal
      isMergeRecordOnSubmit={false}
      updateRecord={(values) => setRecord(curvals => ({...curvals, ...values}))}
      onSubmit={onSubmit}
      record={record}
      closeModal={closeModal}
    >
      <OrderForm data={data}/>
    </RestEditModal> */}
     <OrderForm data={data} title={title}/>
  </>
}

export default Order;