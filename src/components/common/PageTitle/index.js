import { useTranslation } from 'react-i18next';
import PageTitleWrapper from './styles';

const PageTitle = ({
  title,
  description,
  className,
  extraAction,
}) => {
  const { t } = useTranslation();
  return (
    <PageTitleWrapper className={className}>
      <div className="page-title__left">
        <div className="page-title__title">{t(title)}</div>
        { description && (
          <div className="page-title__desc">{t(description)}</div>
        )}
      </div>
      <div className="extraAction">{extraAction}</div>
    </PageTitleWrapper>
  );
};

export default PageTitle;
