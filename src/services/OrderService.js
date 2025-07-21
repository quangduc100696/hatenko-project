import { SUCCESS_CODE } from "configs";
import { arrayEmpty } from "utils/dataUtils";
import RequestUtils from "utils/RequestUtils";

export const getWarehouseByProduct = (mSkuDetails, mProduct) => {
  if(arrayEmpty(mProduct?.warehouses)) {
    return []
  }
  let warehouseOptions = [];
  for(let warehouse of mProduct.warehouses) {
    let skuInfo;
    if (typeof warehouse.skuInfo === "string") {
      skuInfo = warehouse.skuInfo;
    } else {
      skuInfo = JSON.stringify(warehouse.skuInfo || {});
    }
    const skuChoise = JSON.stringify(mSkuDetails);
    if(skuInfo === skuChoise) {
      warehouseOptions.push(warehouse);
    }
  }
  return warehouseOptions;
}

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
  async fetchStatus() {
    this.allStatus = await RequestUtils.GetAsList("/order-status/fetch");
    return this.allStatus;
  },
  async getOrderOnEdit(orderId) {
    let response = { customer: null, order: null, data: [] };
    if(!orderId) {
      return response;
    }
    let { data, errorCode } = await RequestUtils.Get("/order/view-on-edit", {orderId});
    if(errorCode !== SUCCESS_CODE || arrayEmpty(data.data)){
      return response;
    }
    let details = data.data;
    const pIds = details.map(i => i.productId).join(",");
    const { data: products, errorCode: eCode } = await RequestUtils.Get("/product/fetch", {ids: pIds});
    if(eCode !== SUCCESS_CODE || arrayEmpty(products.embedded)) {
      return response;
    }
    for(let detail of details) {
      let mProduct = (products.embedded ?? []).find(item => item.id === detail.productId);
      detail.warehouseOptions = getWarehouseByProduct(detail.mSkuDetails, mProduct);
      if(arrayEmpty(detail.warehouseOptions)) {
        continue;
      }
      let [ warehouse ]  = detail.warehouseOptions;
      detail.warehouse = warehouse?.stockName ?? '';
      detail.stock = warehouse?.quantity ?? 0;
    }
    return data;
  },
  statusName(sId) {
    return this.allStatus.find(i => i.id === sId)?.name ?? '';
  },
  statusColor(sId) {
    return this.allStatus.find(i => i.id === sId)?.color ?? 'black';
  }
}

export default OrderService;