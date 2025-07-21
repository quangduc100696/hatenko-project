import React from 'react'
import { Col, Row } from 'antd'
import FormInput from 'components/form/FormInput'
import FormAutoCompleteInfinite from 'components/form/AutoCompleteInfinite/FormAutoCompleteInfinite'
import FormSelectInfiniteBusinessUser from 'components/form/SelectInfinite/FormSelectInfiniteBusinessUser'
import { useGetAllProductQuery } from 'hooks/useData'
import FormDatePicker from 'components/form/FormDatePicker'

const Filter = () => {
  return (
    <Row gutter={16}>
      <Col xl={6} lg={6} md={6} xs={24}>
        <FormInput
          name={'code'}
          placeholder="Mã đơn"
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
      <Col xl={6} lg={6} md={6} xs={24}>
        <FormInput
          name={'customerMobile'}
          placeholder="Số ĐT"
        />
      </Col>
      <Col xl={6} lg={6} md={6} xs={24}>
        <FormAutoCompleteInfinite
          useGetAllQuery={useGetAllProductQuery}
          label="Sản phẩm"
          filterField="name"
          name="productName"
          valueProp="name"
          searchKey="name"
          required={false}
          placeholder="Tìm kiếm Sản phẩm"
        />
      </Col>
      <Col xl={6} lg={6} md={6} xs={24}>
        <FormSelectInfiniteBusinessUser
          placeholder="Kinh doanh"
          name="userCreatedId"
        />
      </Col>
    </Row>
  )
}

export default Filter
