import { useCallback } from 'react';
import { Pagination, Table, Space } from 'antd';
import ListLayoutStyles from './styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { HASH_MODAL } from 'configs';
import CreateButton from 'components/RestActions/CreateButton';

const ListLayout = ({
  columns,
  data,
  xScroll,
  pagination = {},
  rowKey = 'id',
  hasCreate = true,
  handleChangeQueryParams = () => null,
  resource,
  queryParams,
  totalItems,
  setTableFilter,
  customClickCreate,
  customActions,
  ...props
}) => {
  
  const location = useLocation();
  const navigate = useNavigate();
  const showTotal = useCallback(
    (total, range) => `${range[0]}-${range[1]}/${total}`,
    [],
  );

  const onChangeTable = ( pagination, filters, sorter ) => {
    setTableFilter(filters);
    handleChangeQueryParams(filters);
  };

  const paginationResult = {
    total: totalItems || 0,
    pageSize: queryParams?.limit || 10,
    current: queryParams?.page || 1,
    showSizeChanger: true,
    showQuickJumper: false,
    showTotal,
    ...pagination,
  };

  const onChangePagination = (page, pageSize) => {
    handleChangeQueryParams({
      page,
      limit: pageSize,
    });
  };

  const handleClickCreate = () => {
    if (customClickCreate) {
      customClickCreate();
    } else {
      navigate({ search: location.search, hash: `${HASH_MODAL}/${resource}/create` });
    }
  };
  
  return (
    <ListLayoutStyles>
      <div className="list-layout__pagination-top">
        <Pagination {...paginationResult} onChange={onChangePagination} />
        <div className="list-layout__group-action">
          { /* Đoạn này đang tạm bỏ */}
          <Space size={10}>
            { customActions }
            { hasCreate && (
              <CreateButton
                handleClick={handleClickCreate}
              />
            )}
          </Space>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey={rowKey}
        scroll={{ x: xScroll || 1700 }}
        onChange={onChangeTable}
        {...props}
      />
      <div className="list-layout__pagination-bottom">
        <Pagination {...paginationResult} onChange={onChangePagination} />
      </div>
    </ListLayoutStyles>
  );
};

export default ListLayout;
