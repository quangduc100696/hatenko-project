import { useContext, useMemo } from 'react';
import { Form, Input, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { FormContextCustom } from '../context/FormContextCustom';

const FormInput = ({
  name,
  label,
  required,
  messageRequire = 'error.required',
  placeholder,
  rules = [],
  initialValue,
  formItemProps,
  ContentComponent = Input,
  whitespace,
  isShowTooltip,
  minLength,
  maxLength,
  ...props
}) => {
  const { t } = useTranslation();

  const { allowPressEnter, handleSubmit } = useContext(FormContextCustom);

  const minMaxRule = useMemo(() => {
    const ruleLengthArr = [];

    if (minLength) {
      ruleLengthArr.push({
        min: minLength,
        message: t('error.minLength', { min: minLength }),
      });
    }

    if (maxLength) {
      ruleLengthArr.push({
        max: maxLength,
        message: t('error.maxLength', { max: maxLength }),
      });
    }

    return ruleLengthArr;
  }, []); // eslint-disable-line

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
        ...(whitespace
          ? [
              {
                whitespace,
                message: t('error.empty'),
              },
            ]
          : []),
        ...minMaxRule,
        ...rules,
      ]}
      {...formItemProps}
    >
      <ContentComponent
        {...(placeholder && {
          placeholder: t(placeholder),
        })}
        {...props}
        onPressEnter={allowPressEnter ? handleSubmit : undefined}
      />
    </Form.Item>
  );

  return isShowTooltip ? (
    <Tooltip title={placeholder ? t(placeholder) : ''}>{formItem}</Tooltip>
  ) : (
    formItem
  );
};

export default FormInput;
