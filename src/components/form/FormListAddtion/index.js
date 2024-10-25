import React, { useContext } from 'react';
import { Typography, Button, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { CloseCircleFilled, PlusOutlined } from '@ant-design/icons';
import { FormContextCustom } from 'components/context/FormContextCustom';
import FormStyles from './styles';

const FormListAddition = ({
  children,
  name,
  title,
  formatInitialValue = value => value,
  defaultValueItem,
}) => {

  const { t } = useTranslation();
  const { record } = useContext(FormContextCustom);

  const value = get(record, name);
  const initialValue = isEmpty(value) ? [{}] : formatInitialValue(value);

  return (
    <FormStyles className="form-list__list-wrapper">
      { title && <Typography.Title level={4}>{t(title)}</Typography.Title>}
      <div className="form-list__list">
        <Form.List name={name} initialValue={initialValue}>
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map(field => (
                <div key={field.key} className="form-list__list-item">
                  { React.cloneElement(children, { field })}
                  <CloseCircleFilled
                    className="form-list__remove-button"
                    onClick={() => remove(field.name)}
                  />
                </div>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add(defaultValueItem)}
                  icon={<PlusOutlined />}
                >
                  Thêm mới
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
      </div>
    </FormStyles>
  );
};

export default FormListAddition;
