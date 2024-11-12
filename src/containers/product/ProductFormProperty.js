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
          name={[name, 'attributedId']}
          placeholder="Tên thuộc tính"
        />
      </Col>
      <Col md={12} xs={24}>
        <Form.Item
          noStyle
          shouldUpdate={ (prevValues, curValues) => 
            prevValues.listProperties[name]?.attributedId !== curValues.listProperties[name]?.attributedId 
          }
        >
          {({ getFieldValue }) => {
            let listProperties = getFieldValue('listProperties');
            const attributedId = listProperties[name]?.attributedId ?? '';
            const filter = { attributedId, forceUpdate: attributedId !== '' };
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
        mode='multiple'
        searchKey='value'
        required
        isFetchOnMount={false}
        showSearch
        apiPath='attributed/fetch-value-by-id'
        apiAddNewItem='attributed/save-value-by-id'
        name={[name, 'propertyValueId']}
        placeholder="Gía trị thuộc tính"
        titleProp='value'
        valueProp='id'
        createDefaultValues={{
          attributedId: filter?.id
        }}
        filter={filter}
        onData={(data) => data?.embedded ?? []}
      />
    )
    /* eslint-disable-next-line */
  }, [name, filter]);
  return contentForm;
};

export default ProductFormProperty;