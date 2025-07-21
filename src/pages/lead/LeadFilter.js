import { Row, Col } from 'antd';
import FormDatePicker from 'components/form/FormDatePicker';
import FormInput from 'components/form/FormInput';
import FormSelect from 'components/form/FormSelect';
import { CHANNEL_SOURCE, CHANNEL_STATUS } from 'configs/localData';

const LeadFilter = () => {
  return (
    <>
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
        <Col xl={6} lg={6} md={6} xs={24}>
          <FormSelect
            name="source"
            label="Nguồn"
            placeholder="Chọn Nguồn"
            resourceData={CHANNEL_SOURCE}
            valueProp="id"
            titleProp="name"
          />
        </Col>
        <Col xl={6} lg={6} md={6} xs={24}>
          <FormSelect
            name="status"
            label="Trạng thái"
            valueProp="id"
            titleProp='name'
            resourceData={CHANNEL_STATUS}
            placeholder='Lọc theo trạng thái'
          />
        </Col>
        <Col xl={6} lg={6} md={6} xs={24}>
          <FormDatePicker
            format='YYYY-MM-DD'
            name='from'
            placeholder="Từ ngày"
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

export default LeadFilter;