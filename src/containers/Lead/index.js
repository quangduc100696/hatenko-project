import React, { useEffect, useState } from 'react';
import RestEditModal from 'components/RestLayout/RestEditModal';
import { InAppEvent } from 'utils/FuseUtils';
import RequestUtils from 'utils/RequestUtils';
import { arrayNotEmpty, f5List, formatMoney } from 'utils/dataUtils';
import ProductForm from './ProductForm';
import ProductAttrService from 'services/ProductAttrService';
import { HASH_MODAL_CLOSE } from 'configs';
import FormBase, { handleDistancePrice } from './FormBase';
import { calPriceOff } from 'utils/tools';

const log = (value) => console.log('[container.product.index] ', value);
const NewLead = ({ title, closeModal, data }) => {

  const [ newFile, setNewFile ] = useState({});
  const [ record, setRecord] = useState({});
  const [ detailCohoi, setDetailCohoi ] = useState({});
  const [ detailSp, setDetailSp ] = useState({});

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
    log(dataCreate);
    if (Object.entries(data)?.length > 0) {
      const param = {
        ...data,
        provinceName: data?.provinceName || dataCreate?.provinceName,
        customerName: data?.customerName || data?.customerName,
        customerMobile: data?.customerMobile || data?.customerMobile,
        source: data?.source || dataCreate?.source,
        serviceId: !data?.serviceId ? dataCreate?.serviceId : data?.serviceId,
        customerEmail: data?.customerEmail || data?.customerEmail,
        customerFacebook: data?.customerFacebook || data?.customerFacebook,
        staff: data?.staff || dataCreate?.staff,
        note: dataCreate?.noted || null,
        fileUrls: data?.fileUrls?.length > 0 ? data?.fileUrls : dataCreate?.fileUrls
      };
      const result = await RequestUtils.Post(`/data/update?leadId=${data?.id}`, param);
      if (result?.errorCode === 200) {
        InAppEvent.normalSuccess("Update thành công");
        InAppEvent.emit(HASH_MODAL_CLOSE);
      }
    } else {
      if (!newFile?.sessionId) {
        InAppEvent.normalInfo("Bạn cần tải file trước khi tạo Lead");
      }
      const newData = await RequestUtils.Post(`/data/create?sessionId=${newFile?.sessionId}`, dataCreate);
      const isSuccess = newData?.errorCode === 200;
      if (isSuccess) {
        f5List('data/lists');
        InAppEvent.normalSuccess("Cập nhật thành công");
        InAppEvent.emit(HASH_MODAL_CLOSE);
      }
    }
  }

  const onHandleSubmitBase = async(values) => {
    let skus = [];
    for (const item of detailSp?.skus) {
      for (const element of item?.skuDetail) {
        skus.push(element);
      }
    }
    const customer = await RequestUtils.Get(`/customer/find-by-phone?phone=${data?.customerMobile}&withOrder=withOrder`);
    const total = values?.quantity * values?.price;
    const discountValue = values?.discountValue;
    const discountUnit = values?.discountUnit;
    const pOff = calPriceOff({discountValue, discountUnit, total });
    const totalAFD = total - pOff;
    const priceText = formatMoney(values?.skuId ? (totalAFD > 0 ? totalAFD : 0) : 0);
    const newPrice = handleDistancePrice(values?.skuId, detailSp, values?.quantity, priceText, discountValue, discountUnit).replace('VND', '');
    const newValue = {
      productId: detailSp?.id,
      skuInfo: JSON.stringify(skus),
      productName: values?.productName,
      skuId: values?.skuId,
      quantity: values?.quantity,
      price: parseFloat(newPrice.replace(/\./g, '').trim()),
      note: values?.noted,
      name: values?.name,
      status: values?.status
    }
    const params = {
      vat: 0,
      dataId: data?.id,
      customer: customer?.data?.iCustomer || null,
      details: [newValue]
    }
    const datas = await RequestUtils.Post('/customer-order/sale-create-co-hoi', params);

    if(datas?.errorCode === 200) {
      setDetailCohoi(curvals => ({
        ...curvals, 
        ...datas?.data,
        details: [...(curvals.details || []), ...(datas?.data?.details || [])]
      }))
      InAppEvent.normalSuccess("Tạo cơ hội thành công");
    }else {
      InAppEvent.normalError("Tạo cơ hội thất bại");
    }
  }

  return <>
    {title === 'Tạo cơ hội' ? (
      <RestEditModal
        isMergeRecordOnSubmit={false}
        updateRecord={(values) => setDetailCohoi(curvals => ({ ...curvals, ...values }))}
        onSubmit={onHandleSubmitBase}
        record={detailCohoi}
        closeModal={closeModal}
      >
        {/* <ProductForm setNewFile={setNewFile} dataUpdate={data} /> */}
        <FormBase setDetailSp={setDetailSp} 
          record={record}
          detailCohoi={detailCohoi} 
          setDetailCohoi={setDetailCohoi}
          detailSp={detailSp}
        />
      </RestEditModal>
    ) : (
      <RestEditModal
        isMergeRecordOnSubmit={false}
        updateRecord={(values) => setRecord(curvals => ({ ...curvals, ...values }))}
        onSubmit={onSubmit}
        record={record}
        closeModal={closeModal}
      >
        <ProductForm setNewFile={setNewFile} dataUpdate={data} />
      </RestEditModal>
    )}
  </>
}

export default NewLead;