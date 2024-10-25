import { Form, Checkbox } from 'antd';
import { useTranslation } from 'react-i18next';

const FormCheckbox = ({
  name,
  label,
  rules = [],
  formItemProps,
  initialValue,
  ...props
}) => {
  const { t } = useTranslation();
 
  return (
    <Form.Item
      {...formItemProps}
      {...(label && {
        label: t(label),
      })}
      name={name}
      initialValue={initialValue}
      rules={rules}
      valuePropName="checked"
    >
      <Checkbox {...props}/>
    </Form.Item>
  );
};

export default FormCheckbox;
