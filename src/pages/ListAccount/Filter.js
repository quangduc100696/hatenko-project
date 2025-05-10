import { Col, Row } from 'antd'
import FormInput from 'components/form/FormInput'
import React from 'react'

const Filter = () => {
    return (
        <div>
            <Row gutter={16}>
                <Col xl={6} lg={6} md={6} xs={24}>
                    <FormInput
                        name={'fullName'}
                        placeholder="Họ và tên"
                    />
                </Col>
                <Col xl={6} lg={6} md={6} xs={24}>
                    <FormInput
                        name={'Tên tài khoản '}
                        placeholder="ssoId"
                    />
                </Col>
            </Row>
        </div>
    )
}

export default Filter
