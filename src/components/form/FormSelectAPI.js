import { useContext, useEffect, useState, useMemo, useCallback, useRef } from 'react';
import RequestUtils from 'utils/RequestUtils';
import { Form, Select, Spin, Divider, Input, Button } from 'antd';
import { isObject, get } from 'lodash';
import { onSearch as onChangeSearch } from 'utils/tools';
import { useTranslation } from 'react-i18next';
import MyContext from 'DataContext';
import { useUpdateEffect } from "hooks/MyHooks";
import { PlusOutlined } from '@ant-design/icons';
const { Option } = Select;

const FormSelectAPI = ({
  apiPath = '',
  apiAddNewItem = '',
  name,
  label = '',
  required,
  messageRequire = 'error.required',
  placeholder = 'placeholder.select',
  rules = [],
  valueProp = 'id',
  titleProp = 'name',
  isFilterOption = true,
  formatText = value => value,
  formatValue = value => value,
  searchKey = 'name',
  initialValue,
  formItemProps,
  isShowModalCreateNewItem,
  onCreateNewItem = () => false,
  isLimitWidth = false,
  filter,
  onData = (values) => values,
  ...props
}) => {

  const { f5List } = useContext(MyContext);
  
  const [ localFilter, setFilter ] = useState({});
  const [ loading, setLoading ] = useState(false);
  const [ resourceData, setData ] = useState([]);

  useEffect(() => {
    setFilter(filter);
  }, [filter]);

  useEffect(() => {
    fetchResource(localFilter)
    /* eslint-disable-next-line */
  }, [localFilter]);

  const fetchResource = useCallback((values) => {
    if(!apiPath) {
      return;
    }
    setLoading(true);
    RequestUtils.Get('/' + apiPath, values).then( async ({data, errorCode}) => {
      if(errorCode !== 200) {
        return Promise.reject("Get not success from server .!");
      }
      Promise.resolve(onData(data)).then(setData);
      setLoading(false);
    }).catch(e => {
      console.log('[form.FormSelectAPI] Error ', e);
      setLoading(false);
    });
  }, [onData, apiPath]);

  useUpdateEffect(() => {
    if(f5List?.apiPath === apiPath) {
      fetchResource(localFilter);
    }
  }, [f5List, localFilter, apiPath]);

  const { t } = useTranslation();
  const onSelectOption = useCallback((inputValue, option) => {
    let dataOnSelect = isObject(option.children) ? get(option.children.props?.record, searchKey) : option.children;
    if(onChangeSearch(dataOnSelect, inputValue)) {
      return option.value;
    }
    return null;
  }, [searchKey]);

  const optionLoading = useMemo(() => {
    return (
      <Option
        className="loading-select-option"
        disabled
        value="loadingTracking"
        key="loading"
      >
        <div className="loading-select">
          <Spin />
        </div>
      </Option>
    );
  }, []);

  const inputRef = useRef(null);
  const addItem = useCallback(() => {
    if(onCreateNewItem()) {
      /* Open Modal Create Data */
    } else {
      console.log(apiPath, apiAddNewItem)
    }
    /* eslint-disable-next-line */
  }, [apiPath, apiAddNewItem]);

  return (
    <Form.Item
      label={t(label)}
      name={name}
      rules={[
        { required, message: t(messageRequire) },
        ...rules
      ]}
      initialValue={initialValue}
      {...formItemProps}
    >
      <Select
        placeholder={t(placeholder)}
        filterOption={isFilterOption ? onSelectOption : false}
        popupMatchSelectWidth={isLimitWidth}
        dropdownRender={(menu) => (
          <>
            { menu }
            <Divider style={{ margin: '8px 0'}} />
            <div  style={{ padding: "0 8px 4px", display: "flex", alignItems: "end"}} >
              { !isShowModalCreateNewItem && 
                <Input
                  style={{width: '100%'}}
                  placeholder="Add new item"
                  ref={inputRef}
                  onKeyDown={(e) => e.stopPropagation()}
                /> 
              }
              <Button 
                type="text" 
                icon={<PlusOutlined />} 
                onClick={addItem}
                color="primary" 
                variant="dashed"
                style={{marginLeft: 20}}
              >
                Add item
              </Button>
            </div>
          </>
        )}
        options={
          resourceData?.map((data) => ({ 
            label: formatText(titleProp ? get(data, titleProp) : data, data), 
            value: formatValue(valueProp ? get(data, valueProp) : data, data) 
          }))
        }
        {...props}
      >
        { loading && optionLoading }
      </Select>
    </Form.Item>
  );
}

export default FormSelectAPI;