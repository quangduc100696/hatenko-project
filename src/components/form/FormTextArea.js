import { Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';

const { TextArea } = Input;
const FormTextArea = ({
  name,
  label,
  required,
  messageRequire = 'error.required',
  placeholder,
  rules = [],
  formItemProps,
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
      rules={[
        {
          required,
          message: t(messageRequire),
        },
        {
          whitespace: true,
          message: t('error.empty'),
        },
        ...rules,
      ]}
    >
      <TextArea
        {...props}
        {...(placeholder && {
          placeholder: t(placeholder),
        })}
      />
    </Form.Item>
  );
};

export default FormTextArea;
