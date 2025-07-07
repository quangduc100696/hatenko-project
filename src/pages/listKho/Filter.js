import { Row, Col } from 'antd';
import FormInput from 'components/form/FormInput';
import { STATUS_LEAD } from 'configs/constant';

export const statusData = [
  { id: STATUS_LEAD.CREATE_DATA, name: 'Chưa liên hệ' },
  { id: STATUS_LEAD.DO_NOT_MANUFACTORY, name: 'Không triển khai' },
  { id: STATUS_LEAD.IS_CONTACT, name: 'Đang tư vấn' },
  { id: STATUS_LEAD.CONTACT_LATER, name: 'Liên hệ sau' },
  { id: STATUS_LEAD.KO_LIEN_HE_DUOC, name: 'Không liên hệ được' },
  { id: STATUS_LEAD.THANH_CO_HOI, name: 'Thành cơ hội' },
]

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

        {/* <Col xl={6} lg={6} md={6} xs={24}>
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
        </Col> */}
      </Row>
    </>
  );
}

export default LeadFilter;