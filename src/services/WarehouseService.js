import { SUCCESS_CODE } from "configs";
import { decodeProperty } from "utils/dataUtils";
import RequestUtils from "utils/RequestUtils";

const WarehouseService = {
  allStatus: [],
  empty () {
    this.allStatus = [];
  },
  async fetch(filter = {}) {
    const { data, errorCode } = await RequestUtils.Get("/warehouse/fetch", filter);
    if (errorCode !== SUCCESS_CODE) {
      return { embedded: [], page: {} };
    }
    const { embedded, page } = data;
    decodeProperty(embedded, ['skuInfo']);
    return { embedded, page };
  }
}

export default WarehouseService;