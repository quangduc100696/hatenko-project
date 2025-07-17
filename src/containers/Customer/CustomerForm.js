import { useEffect, useCallback, useState } from "react";
import { Col, Form, Row } from "antd";
import { FormContextCustom } from 'components/context/FormContextCustom';
import FormSelectInfiniteCustomer from "components/form/SelectInfinite/FormSelectInfiniteCustomer";
import FormInput from "components/form/FormInput";
import BtnSubmit from 'components/CustomButton/BtnSubmit';
import FormSelect from "components/form/FormSelect";
import { CHANNEL_SOURCE } from "configs/localData";

const CustomerForm = ({ customer, onSave }) => {

  const [ form ] = Form.useForm();
  const [ record, setRecord ] = useState({});

  useEffect(() => {
    setRecord(customer);
  }, [customer]);

  const onFinish = async(values) => {
    console.log(values);
  }

  const updateRecord = useCallback((values) => {
    setRecord(pre => ({...pre, ...values}));
  }, []);

  const onChangeGetSelectedItem = (value, mCustomer) => {
    form.setFieldsValue(mCustomer);
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <FormContextCustom.Provider value={{ form, record, updateRecord }}>
        <Row gutter={16}>
          <Col span={12}>
            <FormSelectInfiniteCustomer
              name="customerId"
              label='Chọn khách hàng'
              placeholder='Chọn khách hàng'
              onChangeGetSelectedItem={onChangeGetSelectedItem}
            />
          </Col>
          <Col span={12}>
            <FormInput 
              label={"Tên khách hàng"}
              name={"name"}
              required
            />
          </Col>
          <Col span={12}>
            <FormInput 
              label={"Số điện thoại"}
              name={"mobile"}
              required
            />
          </Col>
          <Col span={12}>
            <FormInput 
              label={"Email"}
              name={"email"}
            />
          </Col>
          <Col span={12}>
            <FormInput 
              label={"Địa chỉ (Nếu có)"}
              name={"address"}
            />
          </Col>
          <Col span={12}>
            <FormInput 
              label={"Facebook"}
              name={"facebookId"}
            />
          </Col>
          <Col span={12}>
            <FormSelect 
              required
              resourceData={CHANNEL_SOURCE}
              label={"Nguồn"}
              name={"sourceId"}
            />
          </Col>
          <Col span={12}>
            <BtnSubmit marginTop={30} text='Hoàn thành' />
          </Col>
        </Row>
      </FormContextCustom.Provider>
    </Form>
  )
}

export default CustomerForm;