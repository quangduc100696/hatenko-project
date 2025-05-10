import { Col, Form, Row, Select } from 'antd'
import CustomButton from 'components/CustomButton'
import FormHidden from 'components/form/FormHidden'
import FormInput from 'components/form/FormInput'
import React from 'react'

const ProductForm = ({listProFile}) => {
    console.log('listProFile', listProFile);
    
    return (
        <div>
            <Row gutter={16} style={{ marginTop: 20 }}>
                <FormHidden name={'id'} />
                <Col md={24} xs={12}>
                    <FormInput
                        required
                        label="Họ tên"
                        name="fullName"
                        placeholder={"Nhập họ tên"}
                    />
                </Col>
                <Col md={12} xs={12}>
                    <FormInput
                        required
                        label="Số điện thoại"
                        name="phone"
                        placeholder={"Số điện thoại"}
                    />
                </Col>
                <Col md={12} xs={12}>
                    <FormInput
                        required
                        label="Email"
                        name="email"
                        placeholder={"Số điện thoại"}
                    />
                </Col>
                <Col md={12} xs={12}>
                    <FormInput
                        required
                        label="Tên tài khoản"
                        name="ssoId"
                        placeholder={"Tên tài khoản"}
                    />
                </Col>
                <Col md={12} xs={12}>
                    <FormInput
                        required
                        label="Mật khẩu"
                        name="password"
                        placeholder={"Mật khẩu"}
                    />
                </Col>
                <Col md={12} xs={12}>
                    <FormInput
                        required
                        label="Trạng thái"
                        name="status"
                        placeholder={"Trạng thái"}
                    />
                </Col>
                <Col md={12} xs={24}>
                    <Form.Item label={"Role user"} name="userProfiles">
                        <Select mode="multiple" placeholder="Chọn Role">
                            {listProFile?.map((item, i) => {
                                return (
                                    <Select.Option key={i} value={JSON.stringify(item)}>
                                        {item.type}
                                    </Select.Option>
                                )
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col md={24} xs={12}>
                    <FormInput
                        required
                        label="Loại dạng"
                        name="layout"
                        placeholder={"Loại dạng"}
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
        </div>
    )
}

export default ProductForm
