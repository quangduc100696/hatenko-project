import { useTranslation } from 'react-i18next';
import { SectionItemStyles } from './styles';

const SectionItem = ({ title, className, children }) => {
  const { t } = useTranslation();
  return (
    <SectionItemStyles className={`${className || ''} section-item`}>
      <div className="section-item__title">{t(title)}</div>

      <div className="section-item__content">{children}</div>
    </SectionItemStyles>
  );
};

export default SectionItem;
