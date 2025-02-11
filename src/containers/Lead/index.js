import React, { useEffect, useState } from 'react';
import RestEditModal from 'components/RestLayout/RestEditModal';
import { InAppEvent } from 'utils/FuseUtils';
import RequestUtils from 'utils/RequestUtils';
import { arrayNotEmpty, f5List } from 'utils/dataUtils';
import ProductForm from './ProductForm';
import ProductAttrService from 'services/ProductAttrService';
import { HASH_MODAL_CLOSE } from 'configs';

const log = (value) => console.log('[container.product.index] ', value);
const NewLead = ({ closeModal, data }) => {

  const [ newFile, setNewFile ] = useState({});
  const [ record, setRecord ] = useState({});

  useEffect(() => {
    (async () => {
      let dRe = {}
      if(arrayNotEmpty(data?.listProperties || [])) {
        let attrIds = data.listProperties.map(i => i.attributedId) ?? [];
        let attrValueIds = [];
        for(let values of data.listProperties.map(i => i.attributedValueId)) {
          attrValueIds = attrValueIds.concat(values);
        }
        const itemAttrs = await ProductAttrService.loadByIds(attrIds);
        const itemAttrValues = await ProductAttrService.loadValueByIds(attrValueIds);
        dRe.attrs = itemAttrs;
        dRe.attrValues = itemAttrValues;
      }
      setRecord({ ...data, dRe });
    })();
    return () => ProductAttrService.empty();
  }, [data]);
  const onSubmit = async (dataCreate) => {
    log(dataCreate);
    if(data) {
      const param = {
        ...data,
        provinceName: data?.provinceName || dataCreate?.provinceName,
        customerName: data?.customerName ||  data?.customerName,
        customerMobile: data?.customerMobile || data?.customerMobile,
        source: data?.source || dataCreate?.source,
        serviceId: !data?.serviceId ? dataCreate?.serviceId : data?.serviceId,
        customerEmail: data?.customerEmail || data?.customerEmail,
        customerFacebook: data?.customerFacebook || data?.customerFacebook,
        staff: data?.staff || dataCreate?.staff,
        note: data?.note || dataCreate?.note,
        fileUrls: data?.fileUrls.length > 0 ? data?.fileUrls : dataCreate?.fileUrls
      };
      const result = await RequestUtils.Post(`/data/update?leadId=${data?.id}`, param);
      if(result?.errorCode === 200) {
        InAppEvent.normalSuccess("Update thành công");
        InAppEvent.emit(HASH_MODAL_CLOSE);
      }
    } else {
      if(!newFile?.sessionId) {
        InAppEvent.normalInfo("Bạn cần tải file trước khi tạo Lead");
      }
      const newData = await RequestUtils.Post(`/data/create?sessionId=${newFile?.sessionId}`, dataCreate);
      const isSuccess = newData?.errorCode === 200;
      if(isSuccess) {
        f5List('data/lists');
        InAppEvent.normalSuccess("Cập nhật thành công");
        InAppEvent.emit(HASH_MODAL_CLOSE);
      }
    }
  }
  return <>
    <RestEditModal
      isMergeRecordOnSubmit={false}
      updateRecord={(values) => setRecord(curvals => ({...curvals, ...values}))}
      onSubmit={onSubmit}
      record={record}
      closeModal={closeModal}
    >
      <ProductForm setNewFile={setNewFile} dataUpdate={data}/>
    </RestEditModal>
  </>
}

export default NewLead;