import React, { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import RestEditModal from 'components/RestLayout/RestEditModal';
import { InAppEvent } from 'utils/FuseUtils';
import RequestUtils from 'utils/RequestUtils';
import { arrayEmpty, arrayNotEmpty, f5List } from 'utils/dataUtils';
import OrderForm from './OrderForm';
import ProductAttrService from 'services/ProductAttrService';
import { cloneDeep } from 'lodash';

const log = (value) => console.log('[container.order.index] ', value);
const Order = ({ closeModal, data }) => {

  const [ record, setRecord ] = useState({});
  useEffect(() => {
    (async () => {
      if(arrayNotEmpty(data?.details || [])) {

      }
      setRecord(data);
    })();
    return () => ProductAttrService.empty();
  }, [data]);
  
  const onSubmit = useCallback( async (data) => {
    log(data);
    let values = cloneDeep(data);
    if(arrayEmpty(values.details)) {
      message.info("Can't create Product with empty skus .!");
      return;
    }
    let params = (values?.id ?? '') === '' ? {} : { id: values.id };
    const { errorCode } = await RequestUtils.Post("/order/save", values, params);
    const isSuccess = errorCode === 200;
    if(isSuccess) {
      f5List('order/fetch');
    }
    InAppEvent.normalInfo(isSuccess ? "Cập nhật thành công" : "Lỗi cập nhật, vui lòng thử lại sau");
  }, []);

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