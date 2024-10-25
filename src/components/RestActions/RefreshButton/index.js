import { useTranslation } from 'react-i18next';
import { RefreshIcon } from 'components/common/Icons/SVGIcons';
import RefreshButtonStyles from './styles';

const RefreshButton = ({
  handleClick,
  title = 'inboxes.reloadNewMessage',
  disabled,
}) => {
  const { t } = useTranslation();
  return (
    <RefreshButtonStyles
      className="btn-reload-new"
      icon={<RefreshIcon />}
      onClick={handleClick}
      disabled={disabled}
    >
      {t(title)}
    </RefreshButtonStyles>
  );
};

export default RefreshButton;
