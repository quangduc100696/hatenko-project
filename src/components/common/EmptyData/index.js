import { Empty, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { getStaticImageUrl } from 'utils/tools';

const EmptyData = ({ title, subTitle, isEmptyImgHidden }) => {
  const { t } = useTranslation();
  return (
    <Empty
      description={
        <Space direction="vertical" size={2}>
          <div className="fw-600 fs-16">{t(title || 'error.noData')}</div>
          {subTitle && <div>{t(subTitle)}</div>}
        </Space>
      }
      image={!isEmptyImgHidden && getStaticImageUrl('empty-data.png')}
    />
  );
};

export default EmptyData;
