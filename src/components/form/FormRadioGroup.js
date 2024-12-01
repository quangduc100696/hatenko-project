import { Form, Radio } from 'antd';
import { useTranslation } from 'react-i18next';
import { map, get } from 'lodash';

const FormRadioGroup = ({
  name,
  label,
  required,
  messageRequire = 'error.required',
  placeholder,
  valueProp = 'id',
  titleProp = 'name',
  formatText = value => value,
  formatValue = value => value,
  rules = [],
  resourceData = [],
  initialValue,
  formItemProps,
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <Form.Item
      {...(label && { label: t(label) })}
      name={name}
      initialValue={initialValue}
      rules={[
        { required, message: t(messageRequire)},
        ...rules,
      ]}
      {...formItemProps}
    >
      <Radio.Group 
        {...(placeholder && { placeholder: t(placeholder)})}
        {...props}
      >
        {map(resourceData, (data, index) => (
          <Radio
            key={String(index)}
            value={formatValue(valueProp ? get(data, valueProp) : data, data)}
          >
            { formatText(titleProp ? get(data, titleProp) : data, data)}
          </Radio>
        ))}
      </Radio.Group>
    </Form.Item>
  );
};

export default FormRadioGroup;
