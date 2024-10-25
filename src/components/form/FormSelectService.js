import { Form } from 'antd';
import get from 'lodash/get';
import { useEffect, useState } from 'react';
import { dataArray } from 'utils/dataUtils';
import RequestUtils from 'utils/RequestUtils';
import FormSelect from './FormSelect';

const FormSelectServiceChild = ({
  serviceId,
  ...props
}) => {

  const [ data, setData ] = useState([]);
  useEffect(() => {
    RequestUtils.Get('/resource/service-type/list')
    .then(dataArray).then(setData);
  }, [serviceId]);
 
  return (
    <FormSelect
      required
      label="service.label"
      placeholder="service.label"
      name="serviceId"
      valueProp="id"
      titleProp="serviceName"
      resourceData={data}
      {...props}
    />
  );
};

const FormSelectService = ({
  serviceIdName = 'serviceId',
  ...props
}) => {
  return (
    <Form.Item
      shouldUpdate={(prevValue, curValue) =>
        get(prevValue, serviceIdName) !== get(curValue, serviceIdName)
      }
    >
      {({ getFieldValue }) => (
        <FormSelectServiceChild
          serviceId={getFieldValue(serviceIdName)}
          {...props}
        />
      )}
    </Form.Item>
  );
};

export default FormSelectService;
