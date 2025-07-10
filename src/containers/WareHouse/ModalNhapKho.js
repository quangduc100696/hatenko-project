import React, { useState, useCallback } from 'react';
import { Col, Form, Row } from 'antd';
import FormSelectInfiniteProduct from 'components/form/SelectInfinite/FormSelectInfiniteProduct';
import FormSelect from 'components/form/FormSelect';
import FormInputNumber from 'components/form/FormInputNumber';
import BtnSubmit from 'components/CustomButton/BtnSubmit';
import FormSelectInfiniteProvider from 'components/form/SelectInfinite/FormSelectInfiniteProvider';
import FormInfiniteStock from 'components/form/SelectInfinite/FormInfiniteStock';
import FormHidden from 'components/form/FormHidden';
import RequestUtils from 'utils/RequestUtils';

const SKU_DETAIL_ID_PREFIX = 'skuDetailId_';
const ModalNhapKho = ({ onSave }) => {
  
  const [ form ] = Form.useForm();
  const [ skus, setSkus ] = useState([]);
  const [ mProduct, setProduct ] = useState({});
  const [ mStock, setStock ] = useState({});
  const [ skuDetail, setSkuDetail ] = useState([]);

  const onFinish = useCallback(async (values) => {
 
    const genDetail = (datas) => datas.map((id) => ({ 
      id,
      text: skuDetail.find(detail => detail.id === id)?.value || '' 
    }));

    const mSkuDetails = Object.entries(values).filter(([key]) => key.startsWith(SKU_DETAIL_ID_PREFIX))
    .map(([key, values]) => {
      const text = key.replace(SKU_DETAIL_ID_PREFIX, '');
      return { text, values: genDetail(values) };
    });

    let mValues = Object.fromEntries(
      Object.entries(values).filter(([key]) => !key.startsWith(SKU_DETAIL_ID_PREFIX))
    );

    const { skuId } = mValues;
    const skuName = mProduct?.skus.find(sku => sku.id === skuId)?.name || '';
    let model = {
      ...mValues,
      stockName: mStock?.name || '',
      skuName
    };
    const result = await RequestUtils.Post('/warehouse/created', { model, mSkuDetails });
    onSave(result);
  }, [onSave, skuDetail, mStock, mProduct]);

  const onChangeGetSelectedItem = (value, nProduct) => {
    setSkus(nProduct?.skus || []);
    setProduct(nProduct);
    form.setFieldsValue({ skuId: undefined });
  };

  const onChangeGetSelectedSku = (value, item) => {
    setSkuDetail(item?.skuDetail || []);
    const values = form.getFieldsValue();
    for(const key in values) {
      if (key.startsWith(SKU_DETAIL_ID_PREFIX)) {
        form.setFieldsValue({ [key]: undefined });
      }
    }
  };

  const onChangeGetStockItem = (value, stock) => {
    setStock(stock);
  };

  const groupedData  = skuDetail.reduce((oKey, item) => {
    if (!oKey[item.name]) {
      oKey[item.name] = [];
    }
    oKey[item.name].push(item);
    return oKey;
  }, {});

  const numberOfKeys = Object.keys(groupedData).length;
  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={16}>
        <Col span={24}>
          <FormHidden name="id" />
        </Col>
        <Col span={12}>
          <FormSelectInfiniteProduct
            label='Chọn sản phẩm'
            placeholder='Chọn sản phẩm'
            name='productId'
            required
            onChangeGetSelectedItem={onChangeGetSelectedItem}
          />
        </Col>
        <Col span={12}>
          <FormSelect
            label='SKU'
            name='skuId'
            valueProp='id'
            titleProp='name'
            placeholder='Nhập tên SKU'
            required
            resourceData={skus}
            onChangeGetSelectedItem={onChangeGetSelectedSku}
          />
        </Col>
        {Object.keys(groupedData).map((groupName) => (
          <Col key={groupName} span={numberOfKeys <= 1 ? 24 : 12}>
            <FormSelect
              mode='multiple'
              name={`${SKU_DETAIL_ID_PREFIX}${groupName}`}
              valueProp='id'
              titleProp='value'
              label={`Chọn ${groupName}`}
              placeholder={`Chọn ${groupName}`}
              resourceData={groupedData[groupName]}
              required
            />
          </Col>
        ))}
        <Col span={12}>
          <FormInputNumber
            label='Số lượng'
            name='quantity'
            required
            placeholder={'Nhập số lượng'}
            style={{ width: '100%' }}
            min={1}
            messageRequire='Số lượng không được để trống'
          />
        </Col>
        <Col span={12}>
          <FormSelectInfiniteProvider 
            label='Nhà cung cấp'
            name='providerId'
            placeholder='Chọn nhà cung cấp'
            required
            messageRequire='Nhà cung cấp không được để trống'
          />
        </Col>
        <Col span={24}>
          <FormInfiniteStock 
            onChangeGetSelectedItem={onChangeGetStockItem}
            label='Kho hàng'
            name='stockId'
            placeholder='Chọn kho hàng'
            required
            messageRequire='Kho hàng không được để trống'
          />
        </Col>
        <Col span={24}>
          <BtnSubmit marginTop={10} text='Hoàn thành' />
        </Col>
      </Row>
    </Form>
  )
};

export default ModalNhapKho;