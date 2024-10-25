import { Form, TimePicker } from 'antd';
import { FORMAT_TIME_INPUT } from 'configs/constant';
import { useTranslation } from 'react-i18next';

const FormTimePicker = ({
  name,
  label,
  required,
  messageRequire = 'error.required',
  onChange,
  initialValue,
  rules = [],
  placeholder,
  format = FORMAT_TIME_INPUT,
  formItemProps,
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <Form.Item
      {...(label && {
        label: t(label),
      })}
      name={name}
      rules={[
        {
          required,
          message: t(messageRequire),
        },
        ...rules,
      ]}
      initialValue={initialValue}
      {...formItemProps}
    >
      <TimePicker
        onChange={onChange}
        format={format}
        {...(placeholder && {
          placeholder: t(placeholder),
        })}
        {...props}
      />
    </Form.Item>
  );
};

export default FormTimePicker;
