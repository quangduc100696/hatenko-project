import React, { useState } from 'react';
import RestEditModal from 'components/RestLayout/RestEditModal';
import ProductForm from './ProductForm';
import RequestUtils from 'utils/RequestUtils';
import { InAppEvent } from 'utils/FuseUtils';
import { HASH_MODAL_CLOSE } from 'configs';

const log = (value) => console.log('[container.product.index] ', value);
const TakeNotLead = ({ closeModal, data }) => {
  const [record, setRecord] = useState({});

  const onSubmit = async (dataCreate) => {
    log(data);
    const customerData = await RequestUtils.Get(`/customer/find-by-phone?phone=${data?.customerMobile}&withOrder=withOrder`)
    const params = {
      customerId: customerData?.data?.iCustomer?.id,
      sale: data?.saleId,
      type: 'lead',
      dataId: data?.id,
      ...dataCreate,
    }
    const newData = await RequestUtils.Post('/data/create-lead-care', params);
    if(newData?.errorCode === 200) {
      InAppEvent.normalSuccess("Cập nhật thành công");
      InAppEvent.emit(HASH_MODAL_CLOSE);
    }
  }

  return <>
    <RestEditModal
      isMergeRecordOnSubmit={false}
      updateRecord={(values) => setRecord(curvals => ({ ...curvals, ...values }))}
      onSubmit={onSubmit}
      record={record}
      closeModal={closeModal}
    >
      <ProductForm />
    </RestEditModal>
  </>
}

export default TakeNotLead;