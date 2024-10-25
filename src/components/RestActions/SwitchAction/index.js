import { Switch, Popconfirm } from 'antd';
import i18next from 'i18next';
import SwitchActionStyles from './styles';

const SwitchAction = ({
  checked,
  onChange,
  needPermissions,
  isShowConfirm,
  customUncheckConfirmTitle,
  customCheckConfirmTitle,
  ...props
}) => {
  const element = (
    <SwitchActionStyles>
      <Switch
          checked={checked || false}
          {...(!isShowConfirm && { onChange })}
          {...props}
        />
    </SwitchActionStyles>
  );

  const onConfirm = () => {
    onChange(!checked);
  };

  return isShowConfirm ? (
    <Popconfirm
      title={checked ? customUncheckConfirmTitle : customCheckConfirmTitle}
      onConfirm={onConfirm}
      okText={i18next.t('button.ok')}
      cancelText={i18next.t('button.cancel')}
    >
      {element}
    </Popconfirm>
  ) : (
    element
  );
};

export default SwitchAction;
