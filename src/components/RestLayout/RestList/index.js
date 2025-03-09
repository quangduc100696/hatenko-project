import { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { convertObjToSearchStr, getQueryParamsFromUrl } from 'utils/tools';
import ListLayout from './ListLayout';
import RestFilter from '../RestFilter';

const log = (k, v) => console.log('[component.RestLayout.RestList] ' + k, v);
const RestList = ({
  onData = (values) => values,
  beforeSubmitFilter = (values) => values,
  filter,
  columns,
  apiPath = '',
  useGetAllQuery,
  initialFilter,
  tabKey,
  resource,
  hasCreate = true,
  tabProps = 'model',
  ...props
}) => {

  let location = useLocation();
  let navigate = useNavigate();

  const onSetTableFilter = (filter) => {
    log('table filter' ,filter);
  };

  const [ defaultQueryParams ] = useState(getQueryParamsFromUrl(location.search));
  const [ queryParams, setQueryParams ] = useState({
    ...initialFilter,
    ...defaultQueryParams,
    apiPath,
    resource
  });
  
  const { data, loading } = useGetAllQuery({queryParams, onData});
  const handleChangeQueryParams = (params) => {
    const restQueryParams = {
      ...queryParams,
      ...params
    };
    setQueryParams(restQueryParams);
    const { apiPath, ...urlParams } = restQueryParams;
    navigate({ search: convertObjToSearchStr(urlParams) });
  };

  const onSubmitFilter = (values) => {
    handleChangeQueryParams({ resource, page: 1, ...beforeSubmitFilter(values) });
  };

  const onClearFilter = () => {
    const initFilter = {apiPath: queryParams.apiPath, resource, page: 1, limit: 10 };    
    setQueryParams(initFilter);
    navigate({ search: convertObjToSearchStr(initFilter) });
  };

  return (
    <div>
      { filter && 
        <RestFilter
            onSubmitFilter={onSubmitFilter}
            onClearFilter={onClearFilter}
            defaultQueryParams={defaultQueryParams}
          >
            { filter }
        </RestFilter>
      }
      <ListLayout
        resource={resource}
        queryParams={queryParams}
        handleChangeQueryParams={handleChangeQueryParams}
        columns={columns}
        hasCreate={hasCreate}
        data={data?.embedded || []}
        totalItems={data?.page?.totalElements ?? 0}
        loading={loading}
        expandable={props.expandable} 
        setTableFilter={onSetTableFilter}
        {...props}
      />
    </div>
  );
};

export default RestList;
