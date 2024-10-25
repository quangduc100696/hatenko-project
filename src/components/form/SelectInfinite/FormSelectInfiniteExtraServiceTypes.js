import { useGetAllExtraServiceTypesQuery } from 'hooks/useData';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { formatDataI18n } from 'utils/dataUtils';
import FormSelectInfinite from './FormSelectInfinite';

const FormSelectInfiniteExtraServiceTypes = (props, ref) => {

  const [initialFilter, setInitialFilter] = useState({});
  useImperativeHandle( ref, () => ({
    onChangeInitialFilter: (params) => {
      setInitialFilter(params);
    }
  }),[]);

  return (
    <FormSelectInfinite
      useGetAllQuery={useGetAllExtraServiceTypesQuery}
      name="extraServiceTypeId"
      valueProp="id"
      titleProp="name"
      formatText={(name, record) => formatDataI18n(record?.displayName, name)}
      searchKey={'name'}
      filterField={'id'}
      initialFilter={initialFilter}
      {...props}
    />
  );
};

export default forwardRef(FormSelectInfiniteExtraServiceTypes);
