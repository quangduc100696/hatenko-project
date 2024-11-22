import union from 'lodash/union';
import { getStaticImageUrl } from './tools';
import GridPhotos from 'components/common/GridPhotos';
import i18next from 'i18next';
import { arrayEmpty } from './dataUtils';
import { 
  PAYMENT_STATUS_MAP_KEYS,
  CONTRACT_TYPES, CONTRACT_STATUS
} from 'configs/localData';
import { Tag } from 'antd';
import { formatDataI18n } from './dataUtils';
import UserInfo from 'components/common/UserInfo';

export const formatGallery = (thumbnail, gallery = []) => {
  let images = [];
  if (thumbnail) {
    images = union([getStaticImageUrl(thumbnail)], gallery);
  } else {
    images = arrayEmpty(gallery) ? [getStaticImageUrl()] : gallery;
  }
  return (
    <GridPhotos
      isShowEmpty={false}
      isShowAll={false}
      images={images}
      maxWidth={100}
    />
  );
};

export const formatPaymentStatus = (data) => {
  if (!data) {
    return null;
  }
  const restItem = PAYMENT_STATUS_MAP_KEYS[data];
  return (
    <Tag color={restItem?.color}>
      {restItem?.text ? i18next.t(restItem.text) : data}
    </Tag>
  );
};

export const formatContractType = (data) => {
  const restItem = CONTRACT_TYPES.find(item => item.value === data);
  return restItem?.text ? (
    <Tag color={restItem?.color || 'blue'}>{i18next.t(restItem?.text)}</Tag>
  ) : null;
};

export const formatContractTemplate = (data) => {
  return data ? (
    <Tag color="blue">{formatDataI18n(data.displayName)}</Tag>
  ) : null;
};

export const formatContractStatus = (data) => {
  const contractStatusItem = CONTRACT_STATUS.find(item => item.value === data);
  return contractStatusItem?.text ? (
    <Tag color={contractStatusItem.color}>
      {i18next.t(contractStatusItem.text)}
    </Tag>
  ) : null;
};

export const formatCustomerOrTeamInfo = ({ data, size }) => (
  <UserInfo
    item={data}
    path={`/customer/show?id=${data?.id}`}
    noteProp="email"
    size={size}
  />
);
