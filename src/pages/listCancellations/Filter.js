import { Col, Row } from 'antd'
import FormInput from 'components/form/FormInput'
import FormSelect from 'components/form/FormSelect'
import React from 'react'

const Filter = ({sale}) => {
  return (
    <div>
      <Row gutter={16}>
        <Col xl={6} lg={6} md={6} xs={24}>
          <FormInput
            name={'code'}
            placeholder="Mã đơn"
          />
        </Col>
        <Col xl={6} lg={6} md={6} xs={24}>
          <FormInput
            name={'customerName'}
            placeholder="Tên khách hàng"
          />
        </Col>
        <Col xl={6} lg={6} md={6} xs={24}>
          <FormInput
            name={'customerPhone'}
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
            name="saleId"
            label="Sale"
            valueProp="id"
            titleProp='fullName'
            resourceData={sale || []}
            placeholder='Nhân viên'
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
    </div>
  )
}

export default Filter
