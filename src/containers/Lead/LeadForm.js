import { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import FormHidden from 'components/form/FormHidden';
import CustomButton from 'components/CustomButton';
import FormInput from 'components/form/FormInput';
import FormSelect from 'components/form/FormSelect';
import Dragger from 'antd/es/upload/Dragger';
import FormTextArea from 'components/form/FormTextArea';
import { CHANNEL_SOURCE } from 'configs/localData';
import RequestUtils from 'utils/RequestUtils';
import FormSelectInfiniteProduct from 'components/form/SelectInfinite/FormSelectInfiniteProduct';

const LeadForm = ({
  listServices = [],
  listSale = []
}) => {
  
  const [ province, setListProvince ] = useState([])
  useEffect(() => {
    RequestUtils.GetAsList('/province/find', {id: 0}).then(setListProvince);
  },[]);

  /* Tải file mẫu */
  const props = {
    multiple:true,
    fileList:[]
  }

  return (
    <Row gutter={16} style={{ marginTop: 20 }}>
      <FormHidden name={'id'} />
      <Col md={24} xs={24}>
        <FormInput
          required
          label="Họ tên"
          name="customerName"
          placeholder={"Nhập họ tên"}
        />
      </Col>
      <Col md={12} xs={24}>
        <FormInput
          required
          label="Số điện thoại"
          name="customerMobile"
          placeholder={"Số điện thoại"}
        />
      </Col>
      <Col md={12} xs={24}>
        <FormSelect
          required
          name="provinceName"
          label="Tỉnh / TP"
          placeholder="Chọn Tỉnh / TP"
          resourceData={province || []}
          valueProp="name"
          titleProp="name"
        />
      </Col>
      <Col md={24} xs={24}>
        <FormSelect
          required
          name="source"
          label="Nguồn"
          placeholder="Chọn Nguồn"
          resourceData={CHANNEL_SOURCE}
          valueProp="id"
          titleProp="name"
        />
      </Col>
      <Col md={12} xs={24}>
        <FormSelect
          required
          name="serviceId"
          label="Dịch vụ"
          placeholder="Chọn dịch vụ"
          resourceData={listServices}
          valueProp="id"
          titleProp="name"
        />
      </Col>
      <Col md={12} xs={24}>
        <FormSelectInfiniteProduct
          required
          name="productId"
          label="Sản phẩm"
          placeholder="Chọn sản phẩm"
          valueProp="id"
          titleProp="name"
        />
      </Col>
      <Col md={12} xs={24} style={{marginTop: 15}}>
        <FormInput
          required={false}
          label="Email"
          name="customerEmail"
          placeholder={"Nhập Email"}
        />
      </Col>
      <Col md={12} xs={24} style={{marginTop: 15}}>
        <FormInput
          required={false}
          label="Facebook"
          name="customerFacebook"
          placeholder={"Nhập Facebook"}
        />
      </Col>
      <Col md={24} xs={24} style={{ marginBottom: 10 }}>
        <FormSelect
          required
          name="staff"
          label="Nhân viên"
          placeholder="Chọn nhân viên"
          resourceData={listSale}
          valueProp="name"
          titleProp="name"
        />
      </Col>
      <Col md={24} xs={24} style={{ marginTop: 10 }}>
        <Dragger {...props}>
          <p className="ant-upload-text">Tải file mẫu</p>
          <p className="ant-upload-drag-icon">
            Bấm vào đây để tải file mẫu của khách hàng
          </p>
        </Dragger>
      </Col>
      <Col md={24} xs={24} style={{ marginTop: 40 }}>
        <FormTextArea
          rows={3}
          name="noted"
          label="Ghi chú đơn"
          placeholder="Nhập ghi chú"
        />
      </Col>
      <Col md={24} xs={24}>
        <CustomButton
          htmlType="submit"
          title="Hoàn thành"
          color="danger"
          variant="solid"
        />
      </Col>
    </Row>
  )
}

export default LeadForm;