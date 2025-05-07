export const QUERY_PARAMS_PROPERTY = {
  outsideFilter: 'outsideFilter',
  filters: 'filters',
  extraFilters: 'extraFilters'
}
export const MAX_FILE_SIZE_MB = 3;
export const VAT_PERCENT = 8;
export const HASH_MODAL = "#modal";
export const FORMAT_TIME_INPUT = 'HH:mm';
export const HASH_POPUP = "HASH_POPUP";
export const HASH_POPUP_CLOSE = "HASH_POPUP_CLOSE"
export const FORMAT_DATE_INPUT = 'DD-MM-YYYY';
export const CURRENCY_UNIT = 'VND';

export const SOURCE = {
  FACEBOOK: 1,
  ZALO: 2,
  HOTLINE: 3,
  DIRECT: 4,
  EMAIL: 5,
  MKT0D: 6,
  GIOITHIEU: 7,
  CSKH: 8,
  WHATSAPP: 11,
  PARTNER: 9,
  SHOPEE: 10,
  TIKTOK: 11
}

export const STATUS_LEAD = {
  CREATE_DATA: 0,
  DO_NOT_MANUFACTORY: 1,
  IS_CONTACT: 2,
  CONTACT_LATER: 6,
  KO_LIEN_HE_DUOC: 4,
  THANH_CO_HOI: 7
}

export const SERVICE_ID = {
  PRINTGO: 1,
  PAKGO: 2,
  GIFGO: 3,
}

export const getSource = (option) => {
  switch (option) {
    case SOURCE.FACEBOOK:
      return 'Facebook';
    case SOURCE.ZALO:
      return 'Zalo';
    case SOURCE.HOTLINE:
      return 'Hotline';
    case SOURCE.DIRECT:
      return 'Direct';
    case SOURCE.EMAIL:
      return 'Email';
    case SOURCE.MKT0D:
      return 'MKT0D';
    case SOURCE.GIOITHIEU:
      return 'Giới thiệu';
    case SOURCE.CSKH:
      return 'CSKH';
    case SOURCE.WHATSAPP:
      return 'WhatsApp';
    case SOURCE.PARTNER:
      return 'PartNer';
    case SOURCE.SHOPEE:
      return 'Shoppe';
    case SOURCE.TIKTOK:
      return 'Tiktok';
    default:
      return 'Chưa xác định';
  }
}

export const getStatusLead = (option) => {
  switch (option) {
    case STATUS_LEAD.CREATE_DATA:
      return ' Chưa liên hệ';
    case STATUS_LEAD.DO_NOT_MANUFACTORY:
      return 'Không triển khai';
    case STATUS_LEAD.IS_CONTACT:
      return ' Đang tư vấn';
    case STATUS_LEAD.CONTACT_LATER:
      return 'Liên hệ sau';
    case STATUS_LEAD.KO_LIEN_HE_DUOC:
      return 'Không liên hệ được';
    case STATUS_LEAD.THANH_CO_HOI:
      return 'Thành cơ hội';
    default:
      return 'N/A';
  }
}

export const getColorStatusLead = (option) => {
  switch (option) {
    case STATUS_LEAD.CREATE_DATA:
      return '#f50';
    case STATUS_LEAD.DO_NOT_MANUFACTORY:
      return '#2db7f5';
    case STATUS_LEAD.IS_CONTACT:
      return '#87d068';
    case STATUS_LEAD.CONTACT_LATER:
      return '#108ee9';
    case STATUS_LEAD.KO_LIEN_HE_DUOC:
      return 'error';
    case STATUS_LEAD.THANH_CO_HOI:
      return 'green';
    default:
      return 'N/A';
  }
}

export const getStatusService = (option) => {
  switch (option) {
    case SERVICE_ID.PRINTGO:
      return 'Printgo';
    case SERVICE_ID.PAKGO:
      return 'Pakgo';
    case SERVICE_ID.GIFGO:
      return 'Gifgo';
    default:
      return 'N/A';
  }
}

export const getStatusWareHouseExport = (option) => {
  switch (option) {
    case 1:
      return 'Tạo mới';
    case 2:
      return 'Phê duyệt';
    case 3:
      return 'Hoàn thành';
    default:
      return 'N/A';
  }
}

export const getStatusWareHouse = (option) => {
  switch (option) {
    case 0:
      return 'Chưa nhập';
    case 1:
      return 'Duyệt';
    case 3:
      return 'Duyệt';
    case 4:
      return 'Hoàn thành';
    default:
      return 'N/A';
  }
}



