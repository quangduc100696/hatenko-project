import { Space } from 'antd';
import GroupActionsStyles from './styles';

const GroupActions = ({ children, align = 'center' }) => {
  return (
    <GroupActionsStyles className={`group-action__${align}`}>
      <Space size={5}>{children}</Space>
    </GroupActionsStyles>
  );
};

export default GroupActions;
