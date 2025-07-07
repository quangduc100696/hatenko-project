import { Row, Col } from 'antd';
import FormDatePicker from 'components/form/FormDatePicker';
import FormSelect from 'components/form/FormSelect';
import { STATUS_LEAD } from 'configs/constant';
import { useEffect, useState } from 'react';
import RequestUtils from 'utils/RequestUtils';

export const statusData = [
  { id: STATUS_LEAD.CREATE_DATA, name: 'Chưa liên hệ' },
  { id: STATUS_LEAD.DO_NOT_MANUFACTORY, name: 'Không triển khai' },
  { id: STATUS_LEAD.IS_CONTACT, name: 'Đang tư vấn' },
  { id: STATUS_LEAD.CONTACT_LATER, name: 'Liên hệ sau' },
  { id: STATUS_LEAD.KO_LIEN_HE_DUOC, name: 'Không liên hệ được' },
  { id: STATUS_LEAD.THANH_CO_HOI, name: 'Thành cơ hội' },
]

const LeadFilter = ({listProvince, listStatus}) => {
  const [product, setProduct] = useState([]);
  useEffect(() => {
    (async () => {
      const [sp] = await Promise.all([
        await RequestUtils.Get(`/product/fetch`),
      ]);
      setProduct(sp?.data?.embedded);
    })()
  },[])

  return (
    <>
      <Row gutter={16}>
        <Col xl={6} lg={6} md={6} xs={24}>
          <FormSelect
            required={false}
            name="productId"
            label="Sản phẩm"
            placeholder="Sản phẩm"
            resourceData={product || []}
            valueProp="id"
            titleProp="name"
          />
        </Col>
        <Col xl={6} lg={6} md={6} xs={24}>
          <FormSelect
            required={false}
            name="providerId"
            label="Nhà cung cấp"
            placeholder="Nhà cung cấp"
            resourceData={listProvince || []}
            valueProp="id"
            titleProp="name"
          />
        </Col>
        <Col xl={6} lg={6} md={6} xs={24}>
          <FormSelect
            required={false}
            name="status"
            label="Trạng thái"
            placeholder="Trạng thái"
            resourceData={listStatus || []}
            valueProp="id"
            titleProp="name"
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