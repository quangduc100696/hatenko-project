import { Col, Row } from 'antd'
import CustomButton from 'components/CustomButton'
import FormInput from 'components/form/FormInput'
import FormSelect from 'components/form/FormSelect'
import FormTextArea from 'components/form/FormTextArea'
import React from 'react'

const cause = [
  {name: "Đang trao đổi "},
  {name: "Chi phí cao "},
  {name: "Tư vấn lại"},
  {name: "Không chia sẻ"},
  {name: "Hoãn"},
  {name: "Chờ duyệt"},
]

const ProductForm = () => {
  return (
    <Row gutter={16} style={{ marginTop: 20 }}>
      <Col md={24} xs={24}>
        <FormInput
          required
          label="Người dùng note"
          name="userNote"
          placeholder={"Nhập user note"}
        />
      </Col>
      <Col md={12} xs={24}>
        <FormInput
          required
          label="Tên sản phẩm"
          name="productName"
          placeholder={"Nhập tên sản phẩm"}
        />
      </Col>
      <Col md={12} xs={24}>
        <FormSelect
          required
          name="cause"
          label="Nguyên nhân"
          placeholder="Chọn nguyên nhân"
          resourceData={cause || []}
          valueProp="name"
          titleProp="name"
        />
      </Col>
      <Col md={24} xs={24}>
        <FormTextArea
          rows={3}
          name="note"
          label="Ghi chú đơn"
          placeholder="Nhập ghi chú"
        />
      </Col>
      <Col md={24} xs={24}>
        <div style={{ display: 'flex', marginBottom: 20, justifyContent: 'end' }}>
          <CustomButton
            htmlType="submit"
            title="Hoàn thành"
            color="danger"
            variant="solid"
          />
        </div>
      </Col>
    </Row>
  )
}

export default ProductForm
