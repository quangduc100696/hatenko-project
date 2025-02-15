import React, { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import RestEditModal from 'components/RestLayout/RestEditModal';
import { InAppEvent } from 'utils/FuseUtils';
import RequestUtils from 'utils/RequestUtils';
import { arrayEmpty, arrayNotEmpty, f5List } from 'utils/dataUtils';
import ProductForm from './ProductForm';
import ProductAttrService from 'services/ProductAttrService';
import { cloneDeep } from 'lodash';

const log = (value) => console.log('[container.product.index] ', value);
const Product = ({ closeModal, data }) => {

  const [ record, setRecord ] = useState({});
  const [ fileActive, setFileActive ] = useState('');

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

  const onSubmit = useCallback( async (datas) => {
    log(datas);
    /* Map mảng đổi key attributedValueId thành propertyValueId */
    const newlistProps = data?.listProperties?.map(item => {
      const newListProperties = {attributedId: item?.attributedId, propertyValueId: item?.attributedValueId};
      return newListProperties;
    })
    const newdata = {
      ...datas,
      listProperties: newlistProps
    } 
    let values = cloneDeep(newdata);
    const newValue = {...values, image: fileActive || data?.image}
    let params = (values?.id ?? '') === '' ? {} : { id: values.id };
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
    const { errorCode } = await RequestUtils.Post("/product/save", newValue, params);
    const isSuccess = errorCode === 200;
    if(isSuccess) {
      f5List('product/fetch');
    }
    InAppEvent.normalInfo(isSuccess ? "Cập nhật thành công" : "Lỗi cập nhật, vui lòng thử lại sau");
  }, [data, fileActive]);

  return <>
    <RestEditModal
      isMergeRecordOnSubmit={false}
      updateRecord={(values) => setRecord(curvals => ({...curvals, ...values}))}
      onSubmit={onSubmit}
      record={record}
      closeModal={closeModal}
    >
      <ProductForm data={data} fileActive={fileActive} setFileActive={setFileActive}/>
    </RestEditModal>
  </>
}

export default Product;