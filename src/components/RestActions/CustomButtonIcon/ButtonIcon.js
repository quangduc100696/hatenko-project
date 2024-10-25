import I18n from 'i18next';
import { Tooltip, Button } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

const ButtonIcon = ({
  title = '',
  disabled,
  buttonProps,
  handleClick,
  icon = <SyncOutlined />
}) => {
  return (
    <div>
      <Tooltip title={I18n.t(title)}>
        <Button
          {...buttonProps}
          disabled={buttonProps?.disabled || disabled}
          icon={icon}
          onClick={handleClick}
        />
      </Tooltip>
    </div>
  );
};

export default ButtonIcon;
