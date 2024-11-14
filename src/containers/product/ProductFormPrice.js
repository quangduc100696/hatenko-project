import FormCascader from 'components/form/FormCascader';
import FormListAddition from 'components/form/FormListAddtion';
import { FormPriceStyle } from './styles';
import { Col, Row } from 'antd';
import FormInputNumber from 'components/form/FormInputNumber';
import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import ProductAttrService from 'services/ProductAttrService';

/** 
 * listProperties Data simple
 * [
 *   { "attributedId": 10008, "propertyValueId": [ 10009 ] },
 *   { "attributedId": 10009, "propertyValueId": [ 10010, 10011 ] }
 * ]
*/

const ProductFormPrice = ({ listProperties }) => {

  const [ dataInOptions, setDataInOptions ] = useState([]);
  useEffect(() => {
    let attrs = [], attrValues = [];
    for(let item of listProperties) {
      if(isEmpty(item) || !item.attributedId || !item.attributedValueId) {
        continue;
      }
      attrs.push(item.attributedId);
      attrValues = attrValues.concat(item.attributedValueId);
    }
    ProductAttrService.createDataOptionInForm(attrs, attrValues).then(setDataInOptions);
  }, [listProperties]);

  return (
    <FormPriceStyle>
      <FormListAddition name="skus" textAddNew="Thêm mới SKU" >
        <FormListCascader 
          dataInOptions={dataInOptions}
        />
      </FormListAddition>
    </FormPriceStyle>
  )
}

const FormListCascader = ({ field, dataInOptions }) => {
  const { name } = field || { name: 0 };
  return (
    <Row gutter={16}>
      <Col md={24} xs={24}>
        <FormCascader 
          resourcesData={dataInOptions}
          name={[name, 'sku']}
          required
          placeholder={"Chọn SKUs để tạo đơn vị tồn kho"}
        /> 
      </Col>
      <Col md={24} xs={24}>
        <div style={{height: 20, width: '100%'}} />
        <FormListAddition 
          name={[name, 'listPriceRange']} 
          textAddNew="Thêm khoảng gía" 
          showBtnInLeft={false}
        >
          <FormListPriceRange />
        </FormListAddition>
      </Col>
    </Row>
  )
}

const FormListPriceRange = ({ field }) => {
  const { name } = field || { name: 0 };
  return (
    <Row gutter={16}>
      <Col md={4} xs={24}>
        <FormInputNumber 
          name={[name, 'start']}
          placeholder={"Số lượng từ"}
        />
      </Col>
      <Col md={4} xs={24}>
        <FormInputNumber 
          name={[name, 'end']}
          placeholder={"Số lượng đến"}
        />
      </Col>
      <Col md={8} xs={24}>
        <FormInputNumber 
          name={[name, 'priceRef']}
          placeholder={"Giá / phí trước giảm"}
        />
      </Col>
      <Col md={8} xs={24}>
        <FormInputNumber 
          name={[name, 'price']}
          required
          placeholder={"Giá bán / Chi phí"}
        />
      </Col>
    </Row>
  )
}

export default ProductFormPrice;