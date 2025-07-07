import React from 'react'
import { Col, Row } from 'antd'
import FormInput from 'components/form/FormInput'
import FormTextArea from 'components/form/FormTextArea'
import CustomButton from 'components/CustomButton'
import { FormSelectAPIAi } from 'containers/tranferAi/FormSelectAPI_Ai'

const FormLayout = () => {

  return (
    <div>
      <Row gutter={12}>
        <Col md={12} xs={24}>
          <FormSelectAPIAi
            required
            apiPath='enterprice/fetch?limit=10'
            apiAddNewItem='enterprice/create'
            onData={(data) => data ?? []}
            label="bid"
            title="bid"
            name="bid"
            placeholder="bid"
          />
        </Col>
        <Col md={12} xs={24}>
          <FormInput required={true} label="Tên" name={'name'} placeholder={'Tên'} />
        </Col>
        <Col md={24} xs={24}>
          <FormTextArea required={true} label="Nội dung" name={'content'} placeholder={'Nội dung'} />
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
    </div>
  )
}

export default FormLayout
