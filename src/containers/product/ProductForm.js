import { Row, Col } from 'antd';
import FormHidden from 'components/form/FormHidden';
import CustomButton from 'components/CustomButton';
import FormSelectAPI from 'components/form/FormSelectAPI';

const ProductForm = () => {
  return (
    <Row gutter={16} style={{marginTop: 20}}>
      <FormHidden name={'id'} />
      <Col md={24} xs={24}>
        <FormSelectAPI
          name="categoryId"
        />
      </Col>
      <Col md={24} xs={24}>
        <CustomButton 
          htmlType="submit"
          title="Gửi duyệt" 
          color="danger" 
          variant="solid"
          style={{marginLeft: 20}}
        />
      </Col>
    </Row>
  )
}

export default ProductForm;