import { useMemo, useCallback } from 'react';
import { AutoComplete, Form, Spin } from 'antd';
import { map, isObject, get } from 'lodash';
import { useTranslation } from 'react-i18next';
import { onSearch as onChangeSearch } from 'utils/tools';

const { Option } = AutoComplete;

const FormAutoComplete = ({
  name,
  label = '',
  required,
  messageRequire = 'error.required',
  placeholder = 'placeholder.select',
  rules = [],
  resourceData,
  valueProp = 'id',
  titleProp = 'name',
  isFilterOption = true,
  formatText = value => value,
  formatValue = value => value.toString(),
  searchKey = 'name',
  loading,
  initialValue,
  formItemProps,
  customGetValueFromEvent,
  ...props
}) => {
  const { t } = useTranslation();
  const onSelectOption = useCallback(
    (inputValue, option) => {
      if (
        onChangeSearch(
          isObject(option.children) ? get(option.children.props?.record, searchKey) : option.children,
          inputValue,
        )
      ) {
        return option.value;
      }
      return null;
    },
    [searchKey],
  );

  const optionLoading = useMemo(() => (
    <Option
      className="loading-select-option"
      disabled
      value="loadingTracking"
      key="loading"
    >
      <div className="loading-select"><Spin /></div>
    </Option>
  ), []);

  const getValueFromEvent = (value) => {
    if (!customGetValueFromEvent) {
      return value;
    }
    const findItem = resourceData?.find(
      (item) => get(item, valueProp).toString() === value,
    );
    return customGetValueFromEvent(value, findItem);
  };

  return (
    <Form.Item
      label={t(label)}
      name={name}
      rules={[
        {
          required,
          message: t(messageRequire),
        },
        ...rules,
      ]}
      initialValue={initialValue}
      {...(customGetValueFromEvent && {
        getValueFromEvent,
      })}
      {...formItemProps}
    >
      <AutoComplete
        placeholder={t(placeholder)}
        filterOption={ isFilterOption ? onSelectOption : false}
        {...props}
      >
        { map(resourceData, (data, index) => (
          <Option
            key={String(index)}
            value={formatValue(valueProp ? get(data, valueProp) : data, data)}
          >
            {formatText(titleProp ? get(data, titleProp) : data, data)}
          </Option>
        ))}
        { loading && optionLoading }
      </AutoComplete>
    </Form.Item>
  );
};

export default FormAutoComplete;
