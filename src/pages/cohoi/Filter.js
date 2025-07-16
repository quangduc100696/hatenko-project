import { Col, Row } from 'antd'
import FormAutoCompleteInfinite from 'components/form/AutoCompleteInfinite/FormAutoCompleteInfinite'
import FormInput from 'components/form/FormInput'
import { useGetAllProductQuery } from 'hooks/useData'
import React from 'react'

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
        <FormAutoCompleteInfinite
          useGetAllQuery={useGetAllProductQuery}
          label="Sản phẩm"
          filterField="name"
          name="productName"
          valueProp="name"
          searchKey="name"
          required={false}
          placeholder="Tìm kiếm Sản phẩm"
          customGetValueFromEvent={(productName, product) => {
            return productName;
          }}
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
}

export default Filter
