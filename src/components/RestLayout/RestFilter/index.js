import { useEffect } from 'react';
import { Row, Col, Button, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { FormContextCustom } from 'components/context/FormContextCustom';
import RestFilterStyles from './styles';

const RestFilter = ({
  children,
  greyInput,
  onSubmitFilter = () => null,
  onClearFilter = () => null,
  responsiveFilter = {
    xxl: 20,
    xl: 20,
    lg: 18,
    md: 24,
    xs: 24,
  },
  responsiveAction = {
    xxl: 4,
    xl: 4,
    lg: 6,
    md: 24,
    xs: 24,
  },
  defaultQueryParams
}) => {

  const [ form ] = Form.useForm();
  const { t } = useTranslation();

  const onFilter = () => {
    form.validateFields().then(onSubmitFilter);
  };

  const onClear = () => {
    form.resetFields();
    onClearFilter();
  };

  useEffect(() => {
    form.setFieldsValue(defaultQueryParams);
  }, [form, defaultQueryParams]);

  return (
    <RestFilterStyles
      className={greyInput ? 'grey-input-filter' : 'default-input-filter'}
    >
      <Form form={form} autoComplete="off">
        <FormContextCustom.Provider
          value={{ form, allowPressEnter: true, handleSubmit: onFilter }}
        >
          <Row gutter={16} className="row-filter">
            <Col {...responsiveFilter}>{children}</Col>
            <Col {...responsiveAction} className="row-action-bottom">
              <Button
                type="primary"
                className="filterButton"
                onClick={onFilter}
              >
                {t('button.filter')}
              </Button>
              <Button className="clearButton" onClick={onClear}>
                {t('button.clearFilter')}
              </Button>
            </Col>
          </Row>
        </FormContextCustom.Provider>
      </Form>
    </RestFilterStyles>
  );
};

export default RestFilter;
