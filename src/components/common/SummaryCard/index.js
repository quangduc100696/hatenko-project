import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { formatMoney } from 'utils/dataUtils';
import { Card, Tooltip } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import { SummaryCardWrapper } from './styles';

const SummaryCard = ({
  backgroundShape,
  value,
  title,
  tooltipInfo = '',
  IconCPN,
  link
}) => {
  const { t } = useTranslation();
  const item = (
    <SummaryCardWrapper backgroundShape={backgroundShape}>
      <Card hoverable bordered={false}>
        <div className="vInfo">
          <div className="row-title">
            <div className="summary-card__title">
              {t(title)}
              { tooltipInfo && (
                <Tooltip title={t(tooltipInfo)} className="ml-8">
                  <InfoCircleFilled />
                </Tooltip>
              )}
            </div>
            <div id="hexagon" style={{ background: backgroundShape }}>
              <IconCPN className="summary-card__icon" />
            </div>
          </div>
          <div className="summary-card__value">
            { formatMoney(value) }
          </div>
        </div>
      </Card>
    </SummaryCardWrapper>
  );
  return link ? <Link to={link}>{item}</Link> : item;
};

export default SummaryCard;
