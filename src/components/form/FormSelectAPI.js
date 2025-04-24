import { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import RequestUtils from 'utils/RequestUtils';
import { Form, Select, Spin, Divider, Input, Button, message, Checkbox } from 'antd';
import { get } from 'lodash';
import debounce from 'lodash/debounce';
import { useTranslation } from 'react-i18next';
import MyContext from 'DataContext';
import { useUpdateEffect, useMount } from "hooks/MyHooks";
import { PlusOutlined } from '@ant-design/icons';
import { SUCCESS_CODE } from 'configs';
import { arrayEmpty } from "utils/dataUtils"
import { InAppEvent } from 'utils/FuseUtils';
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
  isFetchOnMount = true,
  formatText = value => value,
  formatValue = value => value,
  searchKey = 'name',
  initialValue,
  formItemProps,
  isShowModalCreateNewItem,
  onCreateNewItem = () => false,
  isLimitWidth = false,
  filter,
  createDefaultValues,
  onData = (values) => values,
  fnLoadData,
  title = '',
  checkSttWarehouse = false,
  ...props
}) => {
  const { f5List } = useContext(MyContext);
  const [ localFilter, setLocalFilter ] = useState(filter || {});
  const [ loading, setLoading ] = useState(false);
  const [ checkStatus, setCheckStatus ] = useState(false);
  const [ resourceData, setData ] = useState([]);
  const [ value, setValue ] = useState('');

  useEffect(() => {
    setLocalFilter(filter);
  }, [filter]);

  useMount(() => {
    if(isFetchOnMount && arrayEmpty(resourceData)) {
      fetchResource(localFilter);
    }
  });

  const fetchResource = useCallback((values) => {
    if(!apiPath) {
      return;
    }
    if(fnLoadData) {
      Promise.resolve(fnLoadData(values)).then(onData).then(data => {
        setData(data)
      });
      return;
    }
    setLoading(true);
    RequestUtils.Get('/' + apiPath, values).then( async ({ data, errorCode }) => {
      if(errorCode !== 200) {
        return Promise.reject("Get not success from server .!");
      }
      Promise.resolve(onData(data)).then(data => {
        setData(data)
      })
      setLoading(false);
    }).catch(e => {
      console.log('[form.FormSelectAPI] Error ', e);
      setLoading(false);
    });
    /* eslint-disable-next-line */
  }, [onData, apiPath]);

  useUpdateEffect(() => {
    if(f5List?.apiPath === apiPath || (localFilter?.forceUpdate ?? false) !== false) {
      fetchResource(localFilter);
    }
    /* eslint-disable-next-line */
  }, [f5List, localFilter, apiPath]);
  const { t } = useTranslation();
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

  const addItem = useCallback(async () => {
    if(onCreateNewItem()) {
      /* Open Modal Create Data */
      return;
    }
    // const value = inputRef?.current?.input?.value ?? '';
    if(value && apiAddNewItem) {
      let dataPost = { [searchKey]: value, ...(createDefaultValues || {})}
      if(title === 'Xuất kho') {
        dataPost = {
          ...dataPost,
          type: checkStatus ? 1 : 0
        };
      }
      const {data, errorCode, message: msg } = await RequestUtils.Post("/" + apiAddNewItem, dataPost);
      if(errorCode !== SUCCESS_CODE) {
        message.error(msg);
      } else {
        const newData = resourceData.concat(data);
        setData(newData);
        InAppEvent.normalInfo("Cập nhật thành công");
        setValue('');
      }
    }
    /* eslint-disable-next-line */
  }, [value, createDefaultValues, fnLoadData]);
  const onSearch = useCallback((value) => {
    fetchResource({...localFilter, [searchKey]: value});
    /* eslint-disable-next-line */
  }, [localFilter, searchKey]);

  const handleValueInput = (e) => {
    setValue(e.target.value);
  }

  const handleChange = useCallback(async(value) => {
    fetchResource(localFilter);
    /* eslint-disable-next-line */
  }, [localFilter]);

  const onHandleCheck = (e) => {
    setCheckStatus(e.target.checked);
  }

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
        filterOption={false}
        popupMatchSelectWidth={isLimitWidth}
        dropdownRender={(menu) => (
          <>
            { menu }
            <Divider style={{ margin: '8px 0'}} />
            <div style={{display: 'flex', justifyContent: 'end', marginBottom: 10}}>
              {title === 'Xuất kho' && (
                <Checkbox onChange={onHandleCheck}>Confirm xuất kho</Checkbox>
              )}
            </div>
            <div  style={{ padding: "0 8px 4px", display: "flex", alignItems: "end"}} >
              { !isShowModalCreateNewItem && 
                <Input
                  style={{width: '100%'}}
                  placeholder="Add new item"
                  value={value}
                  onChange={handleValueInput}
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
          resourceData?.map((item) => ({ 
            label: formatText(titleProp ? get(item, titleProp) : item, item), 
            value: formatValue(valueProp ? get(item, valueProp) : item, item) 
          }))
        }
        onSearch={debounce(onSearch, 600)}
        onChange={handleChange}
        {...props}
      >
        { loading && optionLoading }
      </Select>
    </Form.Item>
  );
}

export default FormSelectAPI;