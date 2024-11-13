import React, { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import RestEditModal from 'components/RestLayout/RestEditModal';
import { InAppEvent } from 'utils/FuseUtils';
import RequestUtils from 'utils/RequestUtils';
import { arrayEmpty, dateFormatOnSubmit, f5List } from 'utils/dataUtils';
import ProductForm from './ProductForm';
import ProductAttrService from 'services/ProductAttrService';

const Product = ({ closeModal, data }) => {

  const [ record, setRecord ] = useState({});
  useEffect(() => {
    setRecord(data);
    return () => ProductAttrService.empty();
  }, [data]);
  
  const onSubmit = useCallback( async (values) => {
    let params = (values?.id ?? '') === '' ? {} : { id: values.id };
    let uri = params?.id ? 'update' : 'create';
    let nUri = String("/product/").concat(uri);
    if(arrayEmpty(values.skus)) {
      message.info("Can't create Product with empty skus .!");
      return;
    }
    for(let arrsku of values.skus) {
      let newSku = []
      for(let sku of arrsku.sku) {
        newSku = newSku.concat({attributedId: sku[0], attributedValueId: sku[1]})
      }
      arrsku.sku = newSku;
    }
    const { errorCode } = await RequestUtils.Post(nUri, values, params);
    const isSuccess = errorCode === 200;
    if(isSuccess) {
      f5List('product/fetch');
    }
    InAppEvent.normalInfo(isSuccess ? "Cập nhật thành công" : "Lỗi cập nhật, vui lòng thử lại sau");
  }, []);

  const formatOnSubmit = useCallback((values) => {
    dateFormatOnSubmit(values, ['createdAt']);
    return values;
  }, []);
 
  return <>
    <RestEditModal
      isMergeOnSubmit={false}
      formatOnSubmit={formatOnSubmit}
      updateRecord={(values) => setRecord(curvals => ({...curvals, ...values}))}
      onSubmit={onSubmit}
      record={record}
      closeModal={closeModal}
    >
      <ProductForm />
    </RestEditModal>
  </>
}

export default Product;