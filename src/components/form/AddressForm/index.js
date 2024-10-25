import useGetOneQuery from 'hooks/useGetOneQuery';
import { Col, Form } from 'antd';
import DistrictForm from './DistrictForm';
import WardForm from './WardForm';
import FormSelect from 'components/form/FormSelect';
import FormInput from 'components/form/FormInput';

const AddressForm = () => {
  const { record: resourceData } = useGetOneQuery({ uri: 'province/list', filter: { parentId: '0' } });
  return <>
    <Col md={8} xs={24}>
      <FormSelect
          required
          name="provinceId"
          label="Tỉnh T/P"
          placeholder="Chọn tỉnh T/P"
          resourceData={resourceData || []}
          valueProp="id"
          titleProp="name"
        />
    </Col>
    <Form.Item noStyle
      shouldUpdate={(prevValues, curValues) =>
        prevValues.provinceId !== curValues.provinceId
      }
    >
      {({ getFieldValue }) => (
        <DistrictForm
          provinceId={getFieldValue('provinceId')}
        />
      )}
    </Form.Item>
    <Form.Item noStyle
      shouldUpdate={(prevValues, curValues) =>
        prevValues.districtId !== curValues.districtId
      }
    >
      {({ getFieldValue }) => (
        <WardForm
          districtId={getFieldValue('districtId')}
        />
      )}
    </Form.Item>
    <Col md={24} xs={24}>
      <FormInput
        maxLength={255}
        name="address"
        label="Địa chỉ"
        placeholder="Nhập địa chỉ "
        required
      />
    </Col>
  </>
}

export default AddressForm;