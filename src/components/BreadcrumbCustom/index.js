import { useTranslation } from 'react-i18next';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { BreadcrumbWrapper } from './styles';

const BreadcrumbCustom = ({ data }) => {
  const { t } = useTranslation();
  return (
    <BreadcrumbWrapper>
      <Breadcrumb separator=">">
        {
          data.map((data, index) => (
            <Breadcrumb.Item key={String(index)}>
              { data.path ? (
                <Link to={data.path}>
                  <span className="breadcrumb-item__name breadcrumb-item__link">
                    {t(data.title)}
                  </span>
                </Link>
              ) : (
                <span className="breadcrumb-item__name">
                  {data.title ? t(data.title) : t('error.waitingUpdate')}
                </span>
              )}
            </Breadcrumb.Item>
          ))
        }
      </Breadcrumb>
    </BreadcrumbWrapper>
  );
};

BreadcrumbCustom.propTypes = {};
export default BreadcrumbCustom;
