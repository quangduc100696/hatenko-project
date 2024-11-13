import { Row, Col, Typography, Form } from 'antd';
import FormHidden from 'components/form/FormHidden';
import CustomButton from 'components/CustomButton';
import FormSelectAPI from 'components/form/FormSelectAPI';
import FormInput from 'components/form/FormInput';
import FormListAddition from 'components/form/FormListAddtion';
import ProductFormProperty from './ProductFormProperty';
import { SwitcherOutlined } from '@ant-design/icons';
import ProductFormPrice from './ProductFormPrice';

const ProductForm = () => {
  return (
    <Row gutter={16} style={{marginTop: 20}}>
      <FormHidden name={'id'} />
      <Col md={24} xs={24}>
        <FormInput 
          required
          label="Tên sản phẩm"
          name="name"
          placeholder={"Nhập tên sản phẩm"}
        />
      </Col>
      <Col md={12} xs={24}>
        <FormSelectAPI
          required
          showSearch
          onData={(data) => data?.embedded ?? []}
          apiPath='product-type/fetch'
          apiAddNewItem='product-type/save'
          label="Dịch vụ"
          name="serviceId"
          placeholder="Chọn dịch vụ"
        />
      </Col>
      <Col md={12} xs={24}>
        <FormSelectAPI
          required
          apiPath='provider/fetch'
          apiAddNewItem='provider/save'
          onData={(data) => data?.embedded ?? []}
          label="Nhà cung cấp"
          name="providerId"
          placeholder="Chọn nhà cung cấp"
        />
      </Col>

      <Col md={24} xs={24}>
        <Typography.Title level={5}>
          <SwitcherOutlined />
          <span style={{marginLeft: 20}}>Thiết lập sản phẩm (Có tính nhận diện tồn kho)</span>
        </Typography.Title>
        <FormListAddition 
          name="listProperties"
          textAddNew="Thêm mới thuộc tính"
        >
          <ProductFormProperty />
        </FormListAddition>
      </Col>

      <Col md={24} xs={24}>
        <Typography.Title level={5}>
          <SwitcherOutlined />
          <span style={{marginLeft: 20}}>Thiết lập giá bán</span>
        </Typography.Title>
        <Form.Item
          noStyle
          shouldUpdate={ (prevValues, curValues) => 
            prevValues.listProperties !== curValues.listProperties
          }
        >
          {({ getFieldValue }) => {
            let listProperties = getFieldValue('listProperties');
            return (
              <ProductFormPrice listProperties={listProperties} />
            )
          }}
        </Form.Item>
      </Col>

      <Col md={24} xs={24}>
        <div style={{display: 'flex', justifyContent:'end'}}>
          <CustomButton 
            htmlType="submit"
            title="Hoàn thành" 
            color="danger" 
            variant="solid"
          />
        </div>
      </Col>
    </Row>
  )
}

export default ProductForm;