import { Form } from 'antd';
import DrawerContent from 'components/DrawerCustom/DrawerContent';
import { FormContextCustom } from 'components/context/FormContextCustom';
import { useCallback, useEffect } from 'react';

const RestEditModal = ({
  closeModal,
  children,
  title,
  record,
  isMergeRecordOnSubmit = true,
  formatOnSubmit = values => values,
  updateRecord = values => values,
  formatDefaultValues = values => values,
  onSubmit,
  ...props
}) => {

  const [ form ] = Form.useForm();
  const onOk = () => {
    form.validateFields().then(values => {
      const datas = isMergeRecordOnSubmit ? {...record, ...values} : values;
      onSubmit(formatOnSubmit(datas));
    });
  };
 
  useEffect (() => {
    form.setFieldsValue(formatDefaultValues(record));
    /* eslint-disable-next-line */
  }, [form, record]);

  const onFinish = useCallback((values) => {
    const datas = isMergeRecordOnSubmit ? {...record, ...values} : values;
    onSubmit(formatOnSubmit(datas));
    /* eslint-disable-next-line */
  }, [record, onSubmit]);

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <FormContextCustom.Provider value={{ form, record, updateRecord }}>
        <DrawerContent
          title={title}
          onClose={closeModal}
          onOk={onOk}
          {...props}
        >
          { children }
        </DrawerContent>
      </FormContextCustom.Provider>
    </Form>
  );
};

export default RestEditModal;
