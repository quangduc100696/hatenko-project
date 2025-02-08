import { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import FormHidden from 'components/form/FormHidden';
import CustomButton from 'components/CustomButton';
import FormInput from 'components/form/FormInput';
import FormSelect from 'components/form/FormSelect';
import { SOURCE } from 'configs/constant';
import Dragger from 'antd/es/upload/Dragger';
import FormTextArea from 'components/form/FormTextArea';
import RequestUtils from 'utils/RequestUtils';

const resourceData = [
  { id: SOURCE.FACEBOOK, name: 'Facebook' },
  { id: SOURCE.ZALO, name: 'Zalo' },
  { id: SOURCE.HOTLINE, name: 'Hotline' },
  { id: SOURCE.DIRECT, name: 'Direct' },
  { id: SOURCE.EMAIL, name: 'Email' },
  { id: SOURCE.MKT0D, name: 'MKT0D' },
  { id: SOURCE.GIOITHIEU, name: 'Giới thiệu' },
  { id: SOURCE.CSKH, name: 'CSKH' },
  { id: SOURCE.WHATSAPP, name: 'WhatsApp' },
  { id: SOURCE.PARTNER, name: 'PartNer' },
  { id: SOURCE.SHOPEE, name: 'SHOPEE' },
  { id: SOURCE.TIKTOK, name: 'Tiktok' },
]

const ProductForm = ({ setNewFile }) => {
  const [province, setProvince] = useState([])

  useEffect(() => {
    (async () => {
      const { data } = await RequestUtils.Get(`/province/find`);
      /* Lấy danh sách theo id và name */
      const newData = data.map(f => {
        return { id: f?.id, name: f?.name }
      })
      setProvince(newData);
    })()
  }, [])

  /* Tải file mẫu */
  const props = {
    customRequest: (componentsData) => {
      let formData = new FormData();
      formData.append('sessionId', Math.floor(Date.now() / 1000));
      formData.append('file', componentsData.file);
      formData.append('dataId', '');
      RequestUtils.Post(`/data/uploads-file`, formData)
        .then(async ({ data, errorCode }) => {
          if (errorCode !== 200) {
            throw new Error("Upload failed");
          }
          setNewFile(data);
          componentsData.onSuccess(data, componentsData.file); // Gọi onSuccess khi upload thành công
        })
        .catch((error) => {
          console.error('Upload error:', error);
          componentsData.onError(error); // Gọi onError khi upload thất bại
        });
    }
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
          name="province"
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
          resourceData={resourceData || []}
          valueProp="id"
          titleProp="name"
        />
      </Col>
      <Col md={24} xs={24}>
        <FormInput
          required
          label="Dịch vụ"
          name="serviceId"
          placeholder={"Chọn dịch vụ"}
        />
      </Col>
      <Col md={12} xs={24}>
        <FormInput
          required
          label="Email"
          name="customerEmail"
          placeholder={"Nhập Email"}
        />
      </Col>
      <Col md={12} xs={24}>
        <FormInput
          required
          label="Facebook"
          name="customerFacebook"
          placeholder={"Nhập Facebook"}
        />
      </Col>
      <Col md={24} xs={24}>
        <FormInput
          required
          label="Nhân viên"
          name="staff"
          placeholder={"Nhân viên"}
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

export default ProductForm;