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
  
  const onSubmit = async (data) => {
    log(data);
    if(!newFile?.sessionId) {
      InAppEvent.normalInfo("Bạn cần tải file trước khi tạo Lead");
    }
    const newData = await RequestUtils.Post(`/data/create?sessionId=${newFile?.sessionId}`, data);
    const isSuccess = newData?.errorCode === 200;
      if(isSuccess) {
        f5List('data/lists');
        InAppEvent.normalSuccess("Cập nhật thành công");
        InAppEvent.emit(HASH_MODAL_CLOSE);
      }
  };

  return <>
    <RestEditModal
      isMergeRecordOnSubmit={false}
      updateRecord={(values) => setRecord(curvals => ({...curvals, ...values}))}
      onSubmit={onSubmit}
      record={record}
      closeModal={closeModal}
    >
      <ProductForm setNewFile={setNewFile}/>
    </RestEditModal>
  </>
}

export default NewLead;