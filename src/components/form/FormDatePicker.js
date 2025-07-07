import { DatePicker, Form } from 'antd';
import { FORMAT_DATE_INPUT } from 'configs/constant';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const FormDatePicker = ({
  name,
  label,
  required,
  messageRequire = 'error.required',
  initialValue,
  rules = [],
  placeholder,
  disabled= false,
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
        { required, message: t(messageRequire) },
        ...rules,
      ]}
      normalize={(value) => value && dayjs(value)}
      getValueProps={(value) => ({
        value: value && dayjs(value)
      })}
      {...formItemProps}
    >
      <DatePicker
        style={{width: '100%'}}
        format={format}
        disabled={disabled}
        {...(placeholder && {
          placeholder: t(placeholder),
        })}
        {...props}
      />
    </Form.Item>
  );
};

export default FormDatePicker;
