import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import i18next from 'i18next';

const searchInput = {};

export const getColumnSearchProps = (
  dataIndex,
  dataLabel,
) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => (
    <div style={{ padding: 8 }}>
      <Input
        placeholder={`Search ${dataLabel ?? dataIndex}`}
        ref={node => {
          searchInput[dataIndex] = node;
        }}
        value={selectedKeys[0]}
        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => confirm({ closeDropdown: true })}
        style={{ marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => confirm({ closeDropdown: true })}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          {i18next.t('button.search')}
        </Button>
        <Button
          onClick={e => {
            setSelectedKeys([]);
            clearFilters(e);
          }}
          size="small"
          style={{ width: 90 }}
        >
          {i18next.t('button.reset')}
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered) => (
    <SearchOutlined className={`${filtered ? 'text-primary' : ''}`} />
  ),
  onFilterDropdownVisibleChange: (visible) => {
    if (visible) {
      setTimeout(() => searchInput[dataIndex].select(), 100);
    }
  }
});
