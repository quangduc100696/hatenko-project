
export const SUCCESS_CODE = 200;
const GATE_EVN = {
  Loc: 'https://hatenko.flast.vn',
  Pro: 'https://open.api.flast.vn',
  bao_gia: `https://flash-solution-eight.vercel.app/bao-gia-don-hang-i`
};
export const BASE_URL = "https://unitika.flast.vn";
export const GATEWAY = GATE_EVN['Loc'];
export const CHANGE_STORE = 'CHANGE_STORE';
export const UPLOAD_PATH = GATEWAY + '/uploads'

export const API = {
  SINGIN: '/auth/login'
}

export const ACTIONS = {
  ADD_USER: 'add__user',
  REMOVE_USER: 'remove__user',
  TOOGLE_COLLAPSE: 'tg_cll',
  F5_LIST: 'f5_list'
}

export const INAPP_NOTIFICATION_EMITTER = 'in_app_noti';
export const EVENT_ACCEPT_IMAGE_TYPES = '.png, .jpeg, .jpg';
export const ANT_PREFIX_CLS = 'booking-antd';
export const HASH_MODAL = '#modal';
export const HASH_MODAL_CLOSE = '#close-modal';
export const DEFAULT_INBOX_ID = 'inbox';
export const DEFAULT_PARENT_INBOX_ID = 'parent';
export const FORMAT_DATE_INPUT = 'DD-MM-YYYY';
export const FORMAT_DATE_TIME_INPUT = 'DD-MM-YYYY HH:mm';
export const FORMAT_TIME_INPUT = 'HH:mm';
export const MAX_FILE_SIZE_MB = 3;
export const REPORT_DATE_FORMAT = 'YYYY-MM-DD';
export const CURRENCY_UNIT = 'VND';
export const NEED_ROLES = ['business', 'owner'];
export const EMBED_YOUTUBE_LINK = '//www.youtube.com/embed/';
export const OWNER_ROLE_ID = '114984141980690';
export const DEFAULT_COLOR_VALUE = '#ffffff';
export const outerRadius = 143 / 2;
