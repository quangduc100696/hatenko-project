import { Row, Col } from 'antd';
import FormSelectUser from 'components/form/FormSelectUser';
import FormDatePicker from 'components/form/FormDatePicker';
import CustomButton from 'components/CustomButton';

const DashboardFilter = () => {
  return (
    <Row gutter={16}>
      <Col xl={6} lg={6} md={6} xs={24}>
        <FormSelectUser
          allowClear
          api='/user/list'
          name={'userId'}
          label=""
          placeholder="Employe"
          valueProp="id"
          titleProp='ssoId'
        />
      </Col>
      <Col xl={6} lg={6} md={6} xs={24}>
        <FormDatePicker
          allowClear
          style={{width: '100%'}}
          format='YYYY-MM-DD'
          name='from'
          placeholder="Start date filter"
        />
      </Col>
      <Col xl={6} lg={6} md={6} xs={24}>
        <FormDatePicker
          allowClear
          style={{width: '100%'}}
          format='YYYY-MM-DD'
          name='to'
          placeholder="End date filter"
        />
      </Col>
      <Col xl={6} lg={6} md={6} xs={24}>
        <CustomButton htmlType="submit" title="Filter" />
      </Col>
    </Row>
  );
}

export default DashboardFilter;