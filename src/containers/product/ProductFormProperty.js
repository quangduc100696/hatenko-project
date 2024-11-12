import { useMemo } from 'react';
import { Col, Form } from 'antd';
import FormSelectAPI from 'components/form/FormSelectAPI';
import FormStyles from './styles'

const ProductFormProperty = ({ field }) => {
  const { name } = field || { name: 0 };
  return <>
    <FormStyles gutter={16}>
      <Col md={12} xs={24}>
        <FormSelectAPI
          required
          showSearch
          onData={(data) => data?.embedded ?? []}
          apiPath='attributed/fetch'
          apiAddNewItem='attributed/save'
          name={[name, 'propertyName']}
          placeholder="Tên thuộc tính"
          valueProp='name'
        />
      </Col>
      <Col md={12} xs={24}>
        <Form.Item
          noStyle
          shouldUpdate={ (prevValues, curValues) => 
            prevValues.listProperties[name]?.propertyName !== curValues.listProperties[name]?.propertyName 
          }
        >
          {({ getFieldValue }) => {
            let listProperties = getFieldValue('listProperties');
            const tName = listProperties[name]?.propertyName ?? '';
            const filter = { name: tName, forceUpdate: tName !== '' };
            return (
              <FormPropertiesValue
                filter={filter}
                name={name}
              />
            )
          }}
        </Form.Item>
      </Col>
    </FormStyles>
  </>
}

const FormPropertiesValue = ({ name, filter }) => {
  const contentForm = useMemo(() => {
    return (
      <FormSelectAPI
        required
        isFetchOnMount={false}
        showSearch
        onData={(data) => data?.embedded ?? []}
        apiPath='attributed/fetch'
        apiAddNewItem='attributed/save'
        name={[name, 'propertyValue']}
        placeholder="Gía trị thuộc tính"
        valueProp='value'
        titleProp='value'
        searchKey='value'
        filter={filter}
      />
    )
    /* eslint-disable-next-line */
  }, [filter]);
  return contentForm;
};

export default ProductFormProperty;