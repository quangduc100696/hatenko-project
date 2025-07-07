import { useContext, useCallback } from "react";
import { FormContextCustom } from "components/context/FormContextCustom";
import CustomButton from 'components/CustomButton';
import { Row, Col, Divider } from "antd";
import HistoryPay from "./HistoryPay";
import FormInputNumber from "components/form/FormInputNumber";
import FormDatePicker from "components/form/FormDatePicker";
import FormInput from "components/form/FormInput";
import FormSelect from "components/form/FormSelect";
import { PAYMENT_TYPE_CONST } from "configs/localData";

const ORderPaymentForm = () => {

  const { form, record } = useContext(FormContextCustom);
  const onSubmit = useCallback(() => {
    form.validateFields().then(values => console.log(values))
  }, [form])

  return (
    <Row gutter={16} style={{marginTop: 20}}>
      <Col md={24} xs={24}>
        <Divider orientation="left">Lịch sử thanh toán</Divider>
        <HistoryPay orderId={record?.id} />
      </Col>
      <Col md={12} xs={24} >
        <FormInputNumber 
          name="monney"
          required
          messageRequire="Thiếu số tiền"
          placeholder="Số tiền"
        />
      </Col>
      <Col md={12} xs={24} >
        <FormDatePicker 
          name="datePay"
          required
          messageRequire="Thiếu ngày thanh toán"
          format="DD-MM-YYYY HH:mm"
          placeholder="Ngày thanh toán"
        />
      </Col>
      <Col md={12} xs={24} >
        <FormInput 
          name="content"
          placeholder="Lý do thanh toán"
        />
      </Col>
      <Col md={12} xs={24} >
        <FormSelect 
          name="method"
          required
          titleProp="label"
          valueProp="value"
          messageRequire="Phương thức thanh toán"
          resourceData={PAYMENT_TYPE_CONST}
        />
      </Col>
      <Col md={24} xs={24} style={{display: 'flex', justifyContent:'end', marginBottom: 20}}>
        <CustomButton 
          disabled={ (record?.id || 0) === 0}
          color="primary" 
          variant="outlined"
          title="Cập nhật thanh toán" 
          style={{marginLeft: 20}} 
          onClick={() => onSubmit()}
        />
      </Col>
    </Row>
  )
}

export default ORderPaymentForm;