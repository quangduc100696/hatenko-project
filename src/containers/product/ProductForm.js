import { Row, Col, Typography } from 'antd';
import FormHidden from 'components/form/FormHidden';
import CustomButton from 'components/CustomButton';
import FormSelectAPI from 'components/form/FormSelectAPI';
import FormInput from 'components/form/FormInput';
import FormListAddition from 'components/form/FormListAddtion';
import ProductFormProperty from './ProductFormProperty';

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
        <Typography.Title level={5}>Thuộc tính sản phẩm</Typography.Title>
        <FormListAddition 
          name="listProperties"
          textAddNew="Thêm mới thuộc tính"
        >
          <ProductFormProperty />
        </FormListAddition>
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