import { Row, Col } from 'antd';
import FormInput from 'components/form/FormInput';
import FormSelectUser from 'components/form/FormSelectUser';
import FormSelect from 'components/form/FormSelect';
import FormDatePicker from 'components/form/FormDatePicker';

const ProductFilter = () => {
  return (
    <>
      <Row gutter={16}>
        <Col xl={6} lg={6} md={6} xs={24}>
          <FormInput
            name={'name'}
            placeholder="Tên đơn"
          />
        </Col>
        <Col xl={6} lg={6} md={6} xs={24}>
          <FormInput
            name={'code'}
            placeholder="Mã đơn"
          />
        </Col>
        <Col xl={6} lg={6} md={6} xs={24}>
          <FormInput
            name={'mobile'}
            placeholder="Số điện thoại"
          />
        </Col>
        <Col xl={6} lg={6} md={6} xs={24}>
          <FormSelectUser
            name={'userId'}
            placeholder="Nhân viên"
          />
        </Col>
        <Col xl={6} lg={6} md={6} xs={24}>
          <FormSelect 
            label="Trạng thái"
            valueProp="id"
            titleProp='name'
            resourceData={[]}
            placeholder='Lọc theo trạng thái'
          />
        </Col>
        <Col xl={6} lg={6} md={6} xs={24}>
          <FormDatePicker
            format='YYYY-MM-DD'
            name='from'
            placeholder="Ngày bắt đầu"
          />
        </Col>
        <Col xl={6} lg={6} md={6} xs={24}>
          <FormDatePicker
            format='YYYY-MM-DD'
            name='to'
            placeholder="Đến ngày"
          />
        </Col>
      </Row>
    </>
  );
}

export default ProductFilter;