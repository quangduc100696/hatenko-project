import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { formatDateDashboard } from 'utils/textUtils';
import { CreatedDateIcon } from 'components/common/Icons/SVGIcons';
import { CreatedDateWrapper } from './styles';

const CreatedDateButton = ({ createdAt }) => {
  const { t } = useTranslation();

  const title = createdAt
    ? `${t('incidents.createdAt')}: ${formatDateDashboard(createdAt)}`
    : t('error.waitingUpdate');

  return (
    <CreatedDateWrapper>
      <Tooltip title={title}>
        <CreatedDateIcon />
      </Tooltip>
    </CreatedDateWrapper>
  );
};

export default CreatedDateButton;
