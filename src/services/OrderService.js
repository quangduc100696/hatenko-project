import { SUCCESS_CODE } from "configs";
import RequestUtils from "utils/RequestUtils";

const OrderService = {
  allStatus: [],
  getListOrderName() {
    return [
      {name: "Bán lẻ", color: "rgb(0, 176, 216)"}, 
      {name: "Sản xuất", color: "rgb(242, 111, 33)"}
    ]
  },
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
  async getOrderOnEdit(orderId) {
    let response = { customer: null, order: null, data: [] };
    const { data, errorCode } = await RequestUtils.Get("/order/view-on-edit", {orderId});
    return errorCode === SUCCESS_CODE ? data : response
  },
  statusName(sId) {
    return this.allStatus.find(i => i.id === sId)?.name ?? '';
  },
  statusColor(sId) {
    return this.allStatus.find(i => i.id === sId)?.color ?? 'black';
  }
}

export default OrderService;