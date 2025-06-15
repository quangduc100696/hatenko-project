import { Form } from 'antd';
import { FormContextCustom } from 'components/context/FormContextCustom';
import { useCallback, useEffect } from 'react';

const RestEditModal = ({
  children,
  record,
  isMergeRecordOnSubmit = true,
  formatOnSubmit = values => values,
  updateRecord = values => values,
  formatDefaultValues = values => values,
  onSubmit
}) => {

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(formatDefaultValues(record));
    /* eslint-disable-next-line */
  }, [form, record]);

  const onFinish = useCallback((values) => {
    const datas = isMergeRecordOnSubmit ? { ...record, ...values } : values;
    onSubmit(formatOnSubmit(datas));
    /* eslint-disable-next-line */
  }, [record, onSubmit]);

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <FormContextCustom.Provider value={{ form, record, updateRecord }}>
        {children}
      </FormContextCustom.Provider>
    </Form>
  );
};

export default RestEditModal;
