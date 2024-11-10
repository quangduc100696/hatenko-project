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
            name={'phone'}
            placeholder="Số điện thoại"
          />
        </Col>
        <Col xl={6} lg={6} md={6} xs={24}>
          <FormInput
            name={'name'}
            placeholder="Tên tài khoản"
          />
        </Col>
        <Col xl={6} lg={6} md={6} xs={24}>
          <FormSelectUser
            api='/user/fetch-department'
            name={'department'}
            label="Bộ phận"
            valueProp="id"
            titleProp='name'
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
            placeholder="Start date filter"
          />
        </Col>
        <Col xl={6} lg={6} md={6} xs={24}>
          <FormDatePicker
            format='YYYY-MM-DD'
            name='to'
            placeholder="End date filter"
          />
        </Col>
      </Row>
    </>
  );
}

export default ProductFilter;