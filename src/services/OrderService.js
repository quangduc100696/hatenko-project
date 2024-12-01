import { SUCCESS_CODE } from "configs";
import RequestUtils from "utils/RequestUtils";

const OrderService = {
  allStatus: [],
  empty () {
    this.allStatus = [];
  },
  fetchStatus() {
    RequestUtils.Get("/order-status/fetch").then( ({ data, errorCode }) => {
      if(errorCode === SUCCESS_CODE) {
        this.allStatus = data;
      }
    })
  },
  statusName(sId) {
    return this.allStatus.find(i => i.id === sId)?.name ?? '';
  },
  statusColor(sId) {
    return this.allStatus.find(i => i.id === sId)?.color ?? 'black';
  }
}

export default OrderService;