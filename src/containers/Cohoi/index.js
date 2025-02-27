import React, { useCallback, useEffect, useState } from 'react';
import RestEditModal from 'components/RestLayout/RestEditModal';
import { InAppEvent } from 'utils/FuseUtils';
import RequestUtils from 'utils/RequestUtils';
import ProductAttrService from 'services/ProductAttrService';
import { generateInForm } from 'containers/Order/utils';
import OrderDtailForm from './OrderDtailForm';

const NewCoHoi = ({ closeModal, data }) => {
  const [record, setRecord] = useState({});

  useEffect(() => {
    (async () => {
      let rForm = await generateInForm(data, 0);
      setRecord(rForm);
    })();
    return () => ProductAttrService.empty();
  }, [data]);

  const onSubmit = useCallback(async (value) => {
    const customer = await RequestUtils.Get(`/customer/find-by-phone?phone=${data?.customerMobilePhone}&withOrder=withOrder`);
    const newValue = {
      productId: data?.details[0]?.id,
      skuInfo: data?.details[0]?.skuInfo,
      productName: value?.productName,
      skuId: value?.skuId,
      quantity: value?.quantity,
      price: value?.price,
      note: value?.note,
      name: value?.name,
      status: value?.status
    }
    const params = {
      vat: 0,
      id: data?.id,
      dataId: data?.dataId,
      customer: customer?.data?.iCustomer || null,
      details: [newValue]
    }
    const datas = await RequestUtils.Post(`/customer-order/update-cohoi`, params);
    if(datas?.errorCode === 200) {
      InAppEvent.normalSuccess("Cập nhật cơ hội thành công");
    }else {
      InAppEvent.normalError("Cập nhật cơ hội thất bại");
    } 
  }, [data]);

  return (
    <div>
      <RestEditModal
        isMergeRecordOnSubmit={false}
        updateRecord={(values) => setRecord(curvals => ({ ...curvals, ...values }))}
        onSubmit={onSubmit}
        record={record}
        closeModal={closeModal}
      >
        <OrderDtailForm/>
      </RestEditModal>
    </div>
  )
}

export default NewCoHoi
