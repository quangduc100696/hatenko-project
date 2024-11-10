import React, { useCallback, useEffect, useState } from 'react';
import RestEditModal from 'components/RestLayout/RestEditModal';
import { InAppEvent } from 'utils/FuseUtils';
import RequestUtils from 'utils/RequestUtils';
import { dateFormatOnSubmit, f5List } from 'utils/dataUtils';
import ProductForm from './ProductForm';

const Product = ({ closeModal, data }) => {

  const [ record, setRecord ] = useState({});
  useEffect(() => {
    setRecord(data);
  }, [data]);
  
  const onSubmit = useCallback( async (values) => {
    let params = (values?.id ?? '') === '' ? {} : { id: values.id };
    let uri = params?.id ? 'update' : 'create';
    let nUri = String("/product/").concat(uri);
    const { errorCode } = await RequestUtils.Post(nUri, values, params);
    f5List('product/fetch');
    InAppEvent.normalInfo(errorCode === 200 ? "Cập nhật thành công" : "Lỗi cập nhật, vui lòng thử lại sau");
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