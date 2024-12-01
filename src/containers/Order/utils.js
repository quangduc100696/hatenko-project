
import RequestUtils from 'utils/RequestUtils';
import { arrayNotEmpty, dataAsObj, decodeProperty } from 'utils/dataUtils';

export const generateInForm = async (data, index) => {
  let detail = {};
  if(!data?.id) {
    return detail;
  }
  if(arrayNotEmpty(data?.details || [])) {
    if(data.details.length < index) {
      return detail;
    }
    detail = data.details[index];
    for(let item of data.details) {
      delete item.total;
      delete item.priceOff;
    }
  }
  
  decodeProperty(detail, ['discount']);
  const [ product, customer ] = await Promise.all([
    RequestUtils.Get("/product/find-by-name", { name: detail?.productName }).then(dataAsObj),
    RequestUtils.Get("/customer/find-id", { customerId: data.customerId }).then(dataAsObj)
  ]);
  const { id, vat, customerId, details } = data;
  const { id: detailId, price, note, name, quantity, status, skuId } = detail;

  let detailInForm = { 
    name,
    detailId, 
    price, 
    quantity,
    skuId,
    note,
    detailCode: detail.code,
    discountUnit: detail.discount?.discountUnit,
    discountValue: detail.discount?.discountValue,
    status
  }
  let rForm = { 
    id, 
    vat,
    product, 
    customerId, 
    customer,
    customerName: customer.name,
    productName: product.name,
    details, 
    ...detailInForm 
  }
  return rForm;
}
