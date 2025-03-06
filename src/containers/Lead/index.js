import React, { useEffect, useState } from 'react';
import RestEditModal from 'components/RestLayout/RestEditModal';
import { InAppEvent } from 'utils/FuseUtils';
import RequestUtils from 'utils/RequestUtils';
import { arrayNotEmpty, f5List } from 'utils/dataUtils';
import ProductForm from './ProductForm';
import ProductAttrService from 'services/ProductAttrService';
import { HASH_MODAL_CLOSE } from 'configs';
import FormBase from './FormBase';

const log = (value) => console.log('[container.product.index] ', value);
const NewLead = ({ title, closeModal, data }) => {

  const [ newFile, setNewFile ] = useState({});
  const [ record, setRecord] = useState({});
  const [ detailCohoi, setDetailCohoi ] = useState({});
  const [ detailSp, setDetailSp ] = useState({});
  const [total, setTotal] = useState(0);

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
    const newItem = values?.products?.map((item, i) => {
      const newSkus = detailSp[i];
      const items = [];
      const skuDetails = newSkus?.skus?.map(item => item?.skuDetail).flat();
        items.push({
          productId: newSkus?.id,
          skuInfo: JSON.stringify(skuDetails),
          name: item?.productName,
          skuId: item?.skuId,
          quantity: item?.quantity,
          price: item?.price
        })
        return {
          productName: newSkus?.name,
          items: items,
        }
    })
    const customer = await RequestUtils.Get(`/customer/find-by-phone?phone=${data?.customerMobile}&withOrder=withOrder`);
    // const total = values?.products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const params = {
      vat: 0,
      dataId: data?.id,
      paymentInfo: {
        amount: total,
      },
      customer: {
        saleId: customer?.data?.iCustomer?.saleId,
        gender: customer?.data?.iCustomer?.gender,
        name: customer?.data?.iCustomer?.name,
        email: customer?.data?.iCustomer?.email,
        mobile: customer?.data?.iCustomer?.mobile,
        createdAt: customer?.data?.iCustomer?.createdAt,
        updatedAt: customer?.data?.iCustomer?.updatedAt,
      },
      details: newItem
    }
    const datas = await RequestUtils.Post('/customer-order/sale-create-co-hoi', params);
    if(datas?.errorCode === 200) {
      setDetailCohoi(curvals => ({
        ...curvals, 
        ...datas?.data,
        details: [...(curvals.details || []), ...(datas?.data?.details || [])]
      }))
      InAppEvent.emit(HASH_MODAL_CLOSE);
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
          setTotal={setTotal}
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