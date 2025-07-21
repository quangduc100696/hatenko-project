import { Row, Col } from 'antd';
import FormInput from 'components/form/FormInput';

const LeadFilter = () => (
  <Row gutter={16}>
    <Col xl={6} lg={6} md={6} xs={24}>
      <FormInput
        name={'customerMobile'}
        placeholder="Số điện thoại"
      />
    </Col>
    <Col xl={6} lg={6} md={6} xs={24}>
      <FormInput
        name={'customerEmail'}
        placeholder="Email"
      />
    </Col>
  </Row>
)

export default LeadFilter;