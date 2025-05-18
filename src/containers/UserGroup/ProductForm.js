import { Col, Form, Row, Select } from 'antd'
import CustomButton from 'components/CustomButton'
import FormHidden from 'components/form/FormHidden'
import FormInput from 'components/form/FormInput'
import React from 'react'

const ProductForm = ({ data, listProFile }) => {
    console.log('data', data);

    return (
        <div>
            <Row gutter={16} style={{ marginTop: 20 }}>
                <FormHidden name={'id'} />
                <Col md={24} xs={12}>
                    <FormInput
                        required
                        label="Tên"
                        name="name"
                        placeholder={"Nhập họ tên"}
                    />
                </Col>
                <Col md={12} xs={12}>
                    <FormInput
                        required
                        label="Tên Leader"
                        name="leaderName"
                        placeholder={"Tên Leader"}
                    />
                </Col>
                <Col md={12} xs={12}>
                    <Form.Item label="User Lead" name="leaderId" rules={[{ required: true, message: 'Vui lòng chọn User'}]}>
                        <Select placeholder="User Lead">
                            {data.map((item, i) => (
                                <Select.Option key={i} value={item.id}>
                                    {item?.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col md={12} xs={12}>
                    <Form.Item label="Loại tài khoản" name="type" rules={[{ required: true, message: 'Vui lòng chọn loại tài khoản'}]}>
                        <Select placeholder="User Lead">
                            <Select.Option value={1}>
                                Sale
                            </Select.Option>
                            <Select.Option value={2}>
                                CSKH
                            </Select.Option>
                            <Select.Option value={3}>
                                Marketing
                            </Select.Option>
                            <Select.Option value={4}>
                                Kho
                            </Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col md={12} xs={12}>
                    <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: 'Vui lòng chọn Trạng thái'}]}>
                        <Select placeholder="Trạng thái">
                            <Select.Option value={1}>
                                Hoạt động
                            </Select.Option>
                            <Select.Option value={2}>
                                Ngừng hoạt động
                            </Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col md={12} xs={24}>
                    <Form.Item label={"Thành viên"} name="listMember" rules={[{ required: true, message: 'Vui lòng chọn Thành viên'}]}>
                        <Select mode="multiple" placeholder="Thành viên">
                            {data?.map((item, i) => {
                                return (
                                    <Select.Option key={i} value={item.id}>
                                        {item.name}
                                    </Select.Option>
                                )
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col md={12} xs={12}>
                    <FormInput
                        required={false}
                        label="Số lượng thành viên"
                        name="memberNumber"
                        placeholder={"Số lượng thành viên"}
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
