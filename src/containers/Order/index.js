import React, { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import RestEditModal from 'components/RestLayout/RestEditModal';
import { InAppEvent } from 'utils/FuseUtils';
import RequestUtils from 'utils/RequestUtils';
import { arrayEmpty, arrayNotEmpty, dataAsObj, decodeProperty, encodeProperty, f5List } from 'utils/dataUtils';
import OrderForm from './OrderForm';
import ProductAttrService from 'services/ProductAttrService';
import { cloneDeep, merge } from 'lodash';

const log = (value) => console.log('[container.order.index] ', value);
const Order = ({ closeModal, data }) => {

  const [ record, setRecord ] = useState({});
  useEffect(() => {
    (async () => {
      if(!data?.id) {
        return;
      }
      let detail = {};
      if(arrayNotEmpty(data?.details || [])) {
        detail = data.details[0];
        for(let item of data.details) {
          delete item.total;
          delete item.priceOff;
        }
      }
      decodeProperty(detail, ['discount']);

      const [ product, customer ] = await Promise.all([
        RequestUtils.Get("/product/find-by-name", { name: detail?.productName }).then(dataAsObj),
        RequestUtils.Get("/customer/find-id", { customerId: data.customerId }).then(dataAsObj)
      ]);
      const { id, vat, customerReceiverName: customerName, details } = data;
      const { id: detailId, price, note, name, quantity, status, skuId } = detail;

      let detailInForm = { 
        name,
        detailId, 
        price, 
        quantity,
        skuId,
        note,
        discountUnit: detail.discount?.discountUnit,
        discountValue: detail.discount?.discountValue,
        status
      }
      let rForm = { id, vat, customerName, product, customer, details, ...detailInForm }
      rForm.productName = product.name;
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
    /* Loại bỏ customerName và orderIndex */
    const { detailId, customerName, orderIndex, ...detail } = rest;

    let details = record?.details ?? [];
    let entity = details.find(i => i.id === detailId) || {};
    if(!entity?.id) {
      details.push(entity);
    }
    
    entity.productId = product.id;
    entity.skuInfo = product?.skus?.find(s => s.id === rest.skuId)?.skuDetail ?? [];
    entity.discount = discount;
    
    encodeProperty(entity, ['skuInfo', 'discount']);
    merge(entity, detail); /* Copy detail to entity */
    
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
    <RestEditModal
      isMergeRecordOnSubmit={false}
      updateRecord={(values) => setRecord(curvals => ({...curvals, ...values}))}
      onSubmit={onSubmit}
      record={record}
      closeModal={closeModal}
    >
      <OrderForm />
    </RestEditModal>
  </>
}

export default Order;