import { DatePicker, Form } from 'antd';
import { FORMAT_DATE_INPUT } from 'configs/constant';
import { useTranslation } from 'react-i18next';

const FormDatePicker = ({
  name,
  label,
  required,
  messageRequire = 'error.required',
  initialValue,
  rules = [],
  placeholder,
  format = FORMAT_DATE_INPUT,
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
      <DatePicker
        format={format}
        {...(placeholder && {
          placeholder: t(placeholder),
        })}
        {...props}
      />
    </Form.Item>
  );
};

export default FormDatePicker;
