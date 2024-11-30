import { useContext, useEffect, useMemo } from 'react';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import useInfinite from 'hooks/useInfinite';
import { FormContextCustom } from 'components/context/FormContextCustom';
import FormAutoComplete from '../FormAutoComplete';

const FormAutoCompleteInfinite = ({
  useGetAllQuery,
  initialFilter,
  searchKey = 'q',
  filterField = 'id',
  customValue,
  ...props
}) => {
  const { record } = useContext(FormContextCustom);

  const defaultValue = useMemo(
    () => customValue || get(record, props.name),
    /* eslint-disable-next-line */
  [] );

  const { onSearch, fetchMoreDefaultValue, loading, resourceData } = useInfinite({
    initialFilter,
    useGetAllQuery,
    searchKey
  });
  
  useEffect(() => {
    if (defaultValue) {
      fetchMoreDefaultValue(filterField, defaultValue);
    }
    /* eslint-disable-next-line */
  }, [defaultValue]);

  return (
    <FormAutoComplete
      loading={loading}
      resourceData={resourceData}
      onSearch={debounce(onSearch, 600)}
      isFilterOption={false}
      {...props}
    />
  );
};

export default FormAutoCompleteInfinite;
