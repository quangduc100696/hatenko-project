import { forwardRef, useContext, useEffect, useImperativeHandle, useMemo } from 'react';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import useInfinite from 'hooks/useInfinite';
import { FormContextCustom } from 'components/context/FormContextCustom';
import FormSelect from '../FormSelect';

const FormSelectInfinite = ({
  useGetAllQuery,
  initialFilter,
  searchKey = 'q',
  filterField = 'id',
  customValue,
  handleSelectedDefault,
  ...props
}, ref ) => {

  const { record } = useContext(FormContextCustom);
  const defaultPropName = get(record, props.name);
  const defaultValue = useMemo( () =>
    customValue || (defaultPropName ?? undefined),
  [defaultPropName, customValue]);

  const {
    onLoadMore,
    onSearch,
    enableWaypoint,
    fetchMoreDefaultValue,
    loading,
    resourceData,
    refetch,
  } = useInfinite({
    initialFilter,
    useGetAllQuery,
    searchKey,
    handleSelectedDefault
  });

  useEffect(() => {
    if (defaultValue) {
      fetchMoreDefaultValue(filterField, defaultValue);
    }
    /* eslint-disable-next-line */
  }, [defaultValue]);

  useImperativeHandle( ref, () => ({
    refetchList: () => {
      refetch();
    },
    /* eslint-disable-next-line */
  }), [defaultValue]);

  return (
    <FormSelect
      onEnter={onLoadMore}
      loading={loading}
      resourceData={resourceData}
      enableWaypoint={enableWaypoint}
      onSearch={debounce(onSearch, 600)}
      isFilterOption={false}
      {...props}
      showSearch
    />
  );
};

export default forwardRef(FormSelectInfinite);
