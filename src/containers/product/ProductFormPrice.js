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
    (async () => {
      let attrs = [], attrValues = [];
      for(let item of listProperties) {
        if(isEmpty(item) || !item.attributedId || !item.propertyValueId) {
          continue;
        }
        attrs.push(item.attributedId);
        attrValues = attrValues.concat(item.propertyValueId);
      }
      ProductAttrService.createDataOptionInForm(attrs, attrValues).then(setDataInOptions);
    })();
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
      <Col md={19} xs={24}>
        <FormCascader 
          resourcesData={dataInOptions}
          name={[name, 'sku']}
          required
          placeholder={"Chọn SKUs để tạo đơn vị tồn kho"}
        /> 
      </Col>
      <Col md={5} xs={24}>
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