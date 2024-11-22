import React from 'react';
import { Cascader, Form } from 'antd';
import { useTranslation } from 'react-i18next';
const { SHOW_CHILD } = Cascader;

const FormCascader = ({
  name,
  label,
  required,
  resourcesData = [],
  messageRequire = 'error.required',
  rules = [],
  initialValue,
  formItemProps,
  ...props
}) => {
  const { t } = useTranslation();
  const onChange = (value) => {
    console.log(value);
  };
  return (
    <Form.Item
      label={t(label)}
      name={name}
      rules={[
        { required, message: t(messageRequire) },
        ...rules,
      ]}
      initialValue={initialValue}
      {...formItemProps}
    >
      <Cascader
        style={{ width: '100%'}}
        options={resourcesData}
        onChange={onChange}
        multiple
        maxTagCount="responsive"
        showCheckedStrategy={SHOW_CHILD}
        {...props}
      />
    </Form.Item>
  );
};

export default FormCascader;