import { Row, Col } from 'antd';
import FormInput from 'components/form/FormInput';
import FormSelect from 'components/form/FormSelect';
import { useEffect, useState } from 'react';
import RequestUtils from 'utils/RequestUtils';

const LeadFilter = () => {

  const [listSale, setListSale] = useState([])

  useEffect(() => {
    (async () => {
      const [sale] = await Promise.all([
         await RequestUtils.Get('/user/list-sale')
      ]);
      setListSale(sale?.data);
    })()
  },[])

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
            name={'email'}
            placeholder="Email"
          />
        </Col>
        <Col xl={6} lg={6} md={6} xs={24}>
          <FormSelect
            required={false}
            name="saleId"
            label="Sale"
            placeholder="Sale"
            resourceData={listSale || []}
            valueProp="id"
            titleProp="fullName"
          />
        </Col>
      </Row>
    </>
  );
}

export default LeadFilter;