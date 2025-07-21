import { GATEWAY } from 'configs';
import { pickBy, identity } from 'lodash'
import { notification } from 'antd';
import i18next from 'i18next';

export const showMeesageError = (description) => {
  notification.error({
    message: i18next.t('error.title'),
    description: i18next.t(description),
  });
};

export const getQueryParamsFromUrl = (url) => {
  if(!url) {
    return {};
  }
  var query = url.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    if(item[1]) {
      result[item[0]] = decodeURIComponent(item[1]);
    }
  });
  return result;
};

export const convertObjToSearchStr = (params) => {
  /* removes undefined, "", 0, null, ... */
  const newParams = pickBy(params, identity);
  delete newParams.resource;
  return new URLSearchParams(newParams).toString();
};

export const onSearch = ( data, inputValue ) =>
  !!inputValue && data?.toLowerCase()?.search(inputValue?.toLowerCase()) !== -1;

export const getStaticImageUrl = (image) => {
  if (!image) {
    return `${GATEWAY}/uploads/image-default.png`;
  }
  return image && image.startsWith('http') ? image : GATEWAY.concat(image.startsWith('/uploads') ? image : "/uploads/".concat(image));
};

export const formatterInputNumber = (value) =>
  `${value}`
  .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  .replace(/\.(?=\d{0,2}$)/g, ',');

export const parserInputNumber = (value) => {
  return value ? value.replace(/\$\s?|(\.*)/g, '').replace(/(,{1})/g, '.') : '';
};

export const formatPhoneNumber = (phone) => {
  if(!phone) {
    return '';
  }
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

export const calPriceOff = ({ discountValue, discountUnit, total }) => {
  if(!discountValue || !discountUnit) {
    return 0;
  }
  if(discountUnit === "money") {
    return discountValue;
  }
  return (discountValue * total) / 100;
};