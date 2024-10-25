import { useCallback } from 'react';
import omit from 'lodash/omit';
import { formatFiltersTable, formatSorterTable } from 'utils/formatFilters';
import TableWrapper from './styles';

function TableCustom({
  columns,
  data,
  xScroll,
  pagination = {},
  rowKeyProp = 'id',
  handleChangeQueryParams = () => null,
  queryParams,
  meta,
  className,
  isResetStyles,
  isShowPagination = true,
  rowSelection,
  ...props
}) {

  const rowKey = (data, index) => data[rowKeyProp] || index;
  const showTotal = useCallback(
    (total, range) => `${range[0]}-${range[1]}/${total}`,
    [],
  );

  const onChange = (
    pagination,
    filters,
    sorter,
  ) => {

    const filterFormat = formatFiltersTable(omit(filters, ['q'])) || {};
    handleChangeQueryParams({
      ...queryParams,
      limit: pagination.pageSize,
      page: pagination.current,
      orderBy: formatSorterTable(sorter),
      ...filterFormat,
    });
  };

  const paginationResult = isShowPagination ? {
    ...(queryParams && {
      total: meta?.totalItems || 0,
      pageSize: queryParams.limit || 10,
      current: queryParams.page || 1,
    }),
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal,
    ...pagination,
  } : false;

  return (
    <TableWrapper
      columns={columns}
      dataSource={data}
      pagination={paginationResult}
      rowKey={rowKey}
      scroll={{ x: xScroll || 1100 }}
      onChange={onChange}
      {...props}
      rowSelection={rowSelection}
      className={`${isResetStyles ? '' : 'table-custom'} ${className || ''}`}
    />
  );
}

export default TableCustom;
