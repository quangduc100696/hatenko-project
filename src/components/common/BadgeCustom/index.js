import { useTranslation } from 'react-i18next';
import BadgeCustomStyles from './styles';

const BadgeCustom = ({ text, color }) => {
  const { t } = useTranslation();
  return (
    <BadgeCustomStyles color={color}>
      <span className="badge-dot" />
      <span>{text ? t(text) : null}</span>
    </BadgeCustomStyles>
  );
};

export default BadgeCustom;
