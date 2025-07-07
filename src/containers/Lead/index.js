import React, { useEffect, useState } from 'react';
import RestEditModal from 'components/RestLayout/RestEditModal';
import { InAppEvent } from 'utils/FuseUtils';
import RequestUtils from 'utils/RequestUtils';
import { arrayNotEmpty, f5List } from 'utils/dataUtils';
import ProductForm from './ProductForm';
import ProductAttrService from 'services/ProductAttrService';
import { HASH_MODAL_CLOSE } from 'configs';
import FormBase from './FormBase';

const NewLead = ({ title, closeModal, data }) => {

  const [ newFile, setNewFile ] = useState({});
  const [ record, setRecord] = useState({});
  const [ detailCohoi, setDetailCohoi ] = useState({});
  const [ detailSp, setDetailSp ] = useState({});
  const [ saleId, setSaleId ] = useState(null);

  useEffect(() => {
    (async () => {
      let dRe = {}
      if (arrayNotEmpty(data?.listProperties || [])) {
        let attrIds = data.listProperties.map(i => i.attributedId) ?? [];
        let attrValueIds = [];
        for (let values of data.listProperties.map(i => i.attributedValueId)) {
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
    if (Object.entries(data)?.length > 0) {
      const param = {
        ...data,  
        provinceName: dataCreate?.provinceName || data?.provinceName,
        customerName: dataCreate?.customerName || data?.customerName,
        customerMobile: dataCreate?.customerMobile || data?.customerMobile,
        source: dataCreate?.source || data?.source,
        serviceId: dataCreate?.serviceId || data?.serviceId, 
        customerEmail: dataCreate?.customerEmail || data?.customerEmail,
        customerFacebook: dataCreate?.customerFacebook || data?.customerFacebook,
        staff: dataCreate?.staff || data?.staff,
        saleId: dataCreate?.saleId || data?.saleId || saleId?.id,
        note: dataCreate?.noted || data.noted,
        fileUrls: dataCreate?.fileUrls?.length > 0 ? dataCreate?.fileUrls : data?.fileUrls,
      };
      const result = await RequestUtils.Post(`/data/update?leadId=${data?.id}`, param);
      if (result?.errorCode === 200) {
        f5List('data/lists');
        InAppEvent.normalSuccess("Update thành công");
        InAppEvent.emit(HASH_MODAL_CLOSE);
      }
    } else {
      const url = newFile?.sessionId ? `/data/create?sessionId=${newFile.sessionId}` : "/data/create";
      const newData = await RequestUtils.Post(url, dataCreate);
      const isSuccess = newData?.errorCode === 200;
      if (isSuccess) {
        f5List('data/lists');
        InAppEvent.normalSuccess("Cập nhật thành công");
        InAppEvent.emit(HASH_MODAL_CLOSE);
      }
    }
  }

  return <>
    { title === 'Tạo cơ hội' ? (
      <FormBase setDetailSp={setDetailSp} 
        record={record}
        detailCohoi={detailCohoi} 
        setDetailCohoi={setDetailCohoi}
        detailSp={detailSp}
        data={data}
      />
    ) : (
      <RestEditModal
        isMergeRecordOnSubmit={false}
        updateRecord={(values) => setRecord(curvals => ({ ...curvals, ...values }))}
        onSubmit={onSubmit}
        record={record}
        closeModal={closeModal}
      >
        <ProductForm setNewFile={setNewFile} dataUpdate={data} setSaleId={setSaleId} />
      </RestEditModal>
    )}
  </>
}

export default NewLead;