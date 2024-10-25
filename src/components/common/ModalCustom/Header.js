import { useTranslation } from 'react-i18next';

const HeaderModal = ({ icon, title }) => {
  const { t } = useTranslation();
  return (
    <div className="header-modal">
      { icon }
      <span className="header-modal__title">{t(title)}</span>
    </div>
  );
};

export default HeaderModal;
