import moment from 'moment';

export const SUCCESS_CODE = 200;
const GATE_EVN = {
  Loc: 'http://127.0.0.1:9765',
  Pro: 'https://api.open.flast.vn'
};
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

export const QUERY_PARAMS_PROPERTY = {
  outsideFilter: 'outsideFilter',
  filters: 'filters',
  extraFilters: 'extraFilters',
}

export const EVENT_RESPONSE_TYPES_CONSTANT = {
  going: 'GOING',
  interest: 'INTEREST',
};

export const DETAIL_EVENTS_KEY_TAB = {
  goings: 'goings',
  interests: 'interests',
};

export const VALUE_ROOT_OPEN_TIME = {
  arrRoot1: ['monday'],
  arrRoot2: ['tuesday', 'wednesday', 'thursday', 'friday'],
};

export const PLATFORM_CONSTANT = {
  crm: {
    value: 'CRM',
    key: 'CRM',
    text: 'platform.crm',
    color: 'blue',
  },
  whiteLabelApp: {
    value: 'WHITELABEL_APP',
    key: 'WLA',
    text: 'platform.whiteLabelApp',
    color: 'red',
  },
  whiteLabelWeb: {
    value: 'WHITELABEL_WEB',
    key: 'WLW',
    text: 'platform.whiteLabelWeb',
    color: 'green',
  },
};

export const PLATFORM = Object.values(PLATFORM_CONSTANT);

export const DEFAULT_FILTER_REPORT = {
  startTime: moment().startOf('month').format(REPORT_DATE_FORMAT),
  endTime: moment().endOf('month').format(REPORT_DATE_FORMAT),
  sort: 'week',
};

export const TIME_ZONE_NUMBER = new Date().getTimezoneOffset() / -60 || 0;
export const TIME_ZONE_FOR_HEADER = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const CUSTOMERS_TAB_KEYS = {
  individuals: 'individuals',
  teams: 'teams',
  companies: 'companies',
};

export const SEARCHABLE_PATH_ON_HEADER = [
  '/customers',
  '/customers/individuals',
  '/customers/teams',
];

export const COMMUNITIES_TAB_KEYS = {
  communityPost: 'communityPost',
  event: 'event',
  post: 'post',
};

export const EVENT_TYPES_CONSTANT = {
  offline: 'OFFLINE',
  online: 'ONLINE',
};

export const outerRadius = 143 / 2;