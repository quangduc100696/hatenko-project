import { Form, InputNumber, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { formatterInputNumber, parserInputNumber } from 'utils/tools';

const FormInputNumber = ({
  name,
  label,
  required,
  messageRequire = 'error.required',
  placeholder,
  rules = [],
  initialValue,
  formItemProps,
  isShowTooltip,
  form,
  ...props
}) => {
  const { t } = useTranslation();

  const formItem = (
    <Form.Item
      {...(label && {
        label: t(label),
      })}
      name={name}
      initialValue={initialValue}
      rules={[
        {
          required,
          message: t(messageRequire),
        },
        ...rules,
      ]}
      {...formItemProps}
    >
      <InputNumber
        {...(placeholder && {
          placeholder: t(placeholder),
        })}
        formatter={formatterInputNumber}
        parser={parserInputNumber}
        {...props}
      />
    </Form.Item>
  );

  return isShowTooltip ? (
    <Tooltip title={placeholder ? t(placeholder) : ''}>{formItem}</Tooltip>
  ) : (
    formItem
  );
};

export default FormInputNumber;
