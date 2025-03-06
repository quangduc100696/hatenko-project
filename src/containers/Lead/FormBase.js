import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Row, Tag } from 'antd';
import { cloneDeep } from "lodash";
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ProductSumary from 'containers/Product/ProductSumary';
import FormAutoCompleteInfinite from 'components/form/AutoCompleteInfinite/FormAutoCompleteInfinite';
import { useGetAllProductQuery } from 'hooks/useData';
import { FormContextCustom } from 'components/context/FormContextCustom';
import FormSelect from 'components/form/FormSelect';
import FormInputNumber from 'components/form/FormInputNumber';
import { DISCOUNT_UNIT_CONST } from 'configs/localData';
import FormTextArea from 'components/form/FormTextArea';
import { ShowPriceStyles } from 'containers/Order/styles';
import { calPriceOff } from 'utils/tools';
import { arrayEmpty, arrayNotEmpty, formatMoney } from 'utils/dataUtils';
import CustomButton from 'components/CustomButton';
import { useMount } from 'hooks/MyHooks';
import { generateInForm } from 'containers/Order/utils';

/* Hàm này check nếu số lượng có trong khoảng giá sp thì lấy giá đó ngược lại lấy giá nhập  */
export const handleDistancePrice = (skuId, detailSp, quantity, priceText, discountValue, discountUnit, text) => {
  if (detailSp?.skus) {
    for (const item of detailSp?.skus) {
      if (arrayNotEmpty(item?.listPriceRange)) {
        for (const element of item?.listPriceRange) {
          if (quantity) {
            if (quantity >= element?.quantityFrom && quantity <= element?.quantityTo) {
              const total = text === 'yes' ? element?.price * quantity : element?.price;
              const pOff = calPriceOff({ discountValue, discountUnit, total });
              const totalAFD = text === 'yes' ? total - pOff : total;
              return formatMoney(skuId ? (totalAFD > 0 ? totalAFD : element?.price) : element?.price);
            } else {
              return priceText;
            }
          }
        }
      } else {
        return priceText;
      }
    }
  } else {
    return priceText;
  }
}

const FormBase = ({ setDetailSp, detailCohoi, setDetailCohoi, detailSp, setTotal }) => {
  const [detailArr, setDetailArr] = useState([]);
  const [priceSp, setPriceSp] = useState(null);
  const [details, setDetails] = useState({});
  const { form } = useContext(FormContextCustom);

  useEffect(() => {
    (() => {
      if (detailSp?.skus) {
        const { quantity } = form.getFieldsValue();
        let price = "";
        for (const item of detailSp?.skus) {
          if (arrayNotEmpty(item?.listPriceRange)) {
            for (const element of item?.listPriceRange) {
              if (quantity >= element?.quantityFrom && quantity <= element?.quantityTo) {
                price = priceSp;
                break;
              }
            }
          }
        }
        if (price) {
          form.setFieldsValue({ price: price })
        }
      }
    })()
    // eslint-disable-next-line
  }, [priceSp])

  useEffect(() => {
    const currentValues = form.getFieldValue("products");
    if (!currentValues || currentValues.length === 0) {
      form.setFieldsValue({ products: [{}] });
    }
  }, []);

  const onClickAddNewOrder = async () => {
    if (arrayEmpty(detailCohoi?.details ?? [])) {
      return;
    }
    let nRecord = cloneDeep(detailCohoi);
    let details = nRecord.details;
    // Kiểm tra nếu có "New" ở cuối
    if (details.length > 0 && details[details.length - 1].code === "New") {
      return;
    }
    let detail = cloneDeep(details[details.length - 1]);
    detail.id = "";
    detail.code = "New";
    detail.productName = "(Thêm cơ hội)";
    detail.skuId = null;
    detail.quantity = "";
    detail.price = "";
    detail.discount = {
      discountUnit: null,
      discountValue: ""
    };
    detail.noted = "";
    detail.name = "";
    detail.status = null;

    if (details.some(item => item.code === "New")) {
      let rForm = await generateInForm(nRecord, details.length - 1);
      setDetailCohoi(rForm);
      setDetailArr(rForm);
    } else {
      details.push(detail);
      let rForm = await generateInForm(nRecord, details.length - 1);
      setDetailCohoi(rForm);
      setDetailArr(rForm);
    }
  };

  return (
    // <Row gutter={16} style={{ marginTop: 20 }}>
    //   <Col md={12} xs={24}>
    //     <FormAutoCompleteInfinite
    //       useGetAllQuery={useGetAllProductQuery}
    //       label="Sản phẩm"
    //       filterField="name"
    //       name="productName"
    //       valueProp="name"
    //       searchKey="name"
    //       required
    //       placeholder="Tìm kiếm Sản phẩm"
    //       customGetValueFromEvent={(productName, product) => {
    //         // setDetailCohoi({ product, productName });
    //         setDetailSp(product);
    //         return productName;
    //       }}
    //     />
    //   </Col>
    //   <Col md={12} xs={24}>
    //     <FormSelect
    //       name="skuId"
    //       label="SKU"
    //       required
    //       resourceData={detailSp?.skus ?? []}
    //       placeholder="Chọn SKU"
    //     />
    //   </Col>

    //   <Col md={12} xs={24}>
    //     <FormInputNumber
    //       required
    //       name="quantity"
    //       label="Số lượng"
    //       min="0"
    //       placeholder="Nhập Số lượng"
    //     />
    //   </Col>
    //   <Col md={12} xs={24}>
    //     <FormInputNumber
    //       required
    //       name="price"
    //       label="Đơn giá"
    //       min="0"
    //       placeholder="Nhập Đơn giá"
    //     />
    //   </Col>

    //   <Col md={12} xs={24}>
    //     <FormSelect
    //       name="discountUnit"
    //       titleProp="text"
    //       valueProp="value"
    //       resourceData={DISCOUNT_UNIT_CONST}
    //       label="Giảm giá nếu có"
    //       placeholder="Chọn hình thức giảm"
    //     />
    //   </Col>
    //   <Col md={12} xs={24}>
    //     <FormInputNumber
    //       label="Giảm giá % / VND"
    //       min="0"
    //       name="discountValue"
    //       placeholder="Nhập giá trị"
    //     />
    //   </Col>

    //   <Form.Item
    //     noStyle
    //     shouldUpdate={(prevValues, curValues) => (
    //       prevValues.quantity !== curValues.quantity
    //       || prevValues.discountValue !== curValues.discountValue
    //       || prevValues.discountUnit !== curValues.discountUnit
    //       || prevValues.price !== curValues.price
    //     )}
    //   >
    //     {({ getFieldValue }) => {
    //       const { skuId, quantity, discountValue, discountUnit, price } = getFieldValue();  
    //       const total = quantity * price;
    //       const pOff = calPriceOff({ discountValue, discountUnit, total });
    //       const totalAFD = total - pOff;
    //       const priceText = formatMoney(skuId ? (totalAFD > 0 ? totalAFD : 0) : 0);
    //       handleDistancePrice(detailSp, quantity);
    //       const newPrice = quantity ? handleDistancePrice(skuId, detailSp, quantity, priceText, discountValue, discountUnit, 'not').replace('VND', '') : '0';
    //       setPriceSp(parseFloat(newPrice.replace(/\./g, '').trim()))
    //       return (
    //         <ShowPriceStyles md={24} xs={24}>
    //           <h3 className="lo-order">Thành tiền: {handleDistancePrice(skuId, detailSp, quantity, priceText, discountValue, discountUnit, 'yes')}</h3>
    //         </ShowPriceStyles>
    //       )
    //     }}
    //   </Form.Item>
    //   <Col md={24} xs={24} style={{ display: 'flex', justifyContent: 'end', marginBottom: 20 }}>
    //     <CustomButton htmlType="submit" />
    //     <CustomButton
    //       disabled={(detailCohoi?.id || 0) === 0}
    //       color="primary"
    //       variant="outlined"
    //       title="Thêm cơ hội mới"
    //       style={{ marginLeft: 20 }}
    //       onClick={() => onClickAddNewOrder()}
    //     />
    //   </Col>
    // </Row>
    <Form.List name="products">
      {(fields, { add, remove }) => (
        <div style={{ marginTop: 20 }}>
          {fields.map(({ key, name, ...restField }) => (
            <Row
              gutter={16}
              key={key}
              align="middle"
              style={{
                borderRadius: 20,
                padding: 10,
                position: "relative",
                border: "2px dashed #f2f1fc",
                marginBottom: 30,
              }}
            >
              <Col md={12} xs={24}>
                <FormAutoCompleteInfinite
                  useGetAllQuery={useGetAllProductQuery}
                  label="Sản phẩm"
                  filterField="name"
                  name={[name, "productName"]} // Đảm bảo name là unique
                  valueProp="name"
                  searchKey="name"
                  required
                  placeholder="Tìm kiếm Sản phẩm"
                  customGetValueFromEvent={(productName, product) => {
                    setDetailSp((prev) => ({ ...prev, [name]: product })); // Lưu theo từng form
                    return productName;
                  }}
                />
              </Col>

              <Col md={12} xs={24}>
                <FormSelect
                  {...restField}
                  name={[name, "skuId"]}
                  label="SKU"
                  required
                  resourceData={detailSp[name]?.skus ?? []} // Lấy SKU của sản phẩm cụ thể
                  placeholder="Chọn SKU"
                />
              </Col>

              <Col md={6} xs={24}>
                <FormInputNumber
                  {...restField}
                  required
                  name={[name, "quantity"]}
                  label="Số lượng"
                  min="0"
                  placeholder="Nhập Số lượng"
                />
              </Col>

              <Col md={6} xs={24}>
                <FormInputNumber
                  {...restField}
                  required
                  name={[name, "price"]}
                  label="Đơn giá"
                  min="0"
                  placeholder="Nhập Đơn giá"
                />
              </Col>

              <Col md={6} xs={24}>
                <FormSelect
                  {...restField}
                  name={[name, "discountUnit"]}
                  titleProp="text"
                  valueProp="value"
                  resourceData={DISCOUNT_UNIT_CONST}
                  label="Giảm giá nếu có"
                  placeholder="Chọn hình thức giảm"
                />
              </Col>

              <Col md={6} xs={24}>
                <FormInputNumber
                  {...restField}
                  label="Giảm giá % / VND"
                  min="0"
                  name={[name, "discountValue"]}
                  placeholder="Nhập giá trị"
                />
              </Col>

              <div
                type="text"
                style={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                  cursor: "pointer",
                }}
                onClick={() => remove(name)}
              >
                <CloseCircleOutlined style={{ fontSize: 24 }} />
              </div>

            </Row>
          ))}
          <Form.Item shouldUpdate={(prev, cur) => JSON.stringify(prev.products) !== JSON.stringify(cur.products)}>
            {({ getFieldValue }) => {
              const products = getFieldValue("products") || [];
              const total = products?.reduce((sum, product) => {
                // const { quantity = 0, price = 0, discountValue = 0, discountUnit } = product;
                const subTotal = product?.quantity * product?.price;
                const discountValue = product?.discountValue;
                const discountUnit = product?.discountUnit
                const discount = calPriceOff({ discountValue, discountUnit, total: subTotal });
                return sum + (subTotal - discount);
              }, 0);
              setTotal(total)
              return (
                <ShowPriceStyles md={24} xs={24}>
                  <h3 className="lo-order">Thành tiền: {formatMoney(total)}</h3>
                </ShowPriceStyles>
              )
            }}
          </Form.Item>

          <Row>
            <Col span={24} style={{ textAlign: "right" }}>
            <Button
              type="dashed"
              onClick={() => {
                const currentProducts = form.getFieldValue("products") || [];
                form.setFieldsValue({
                  products: [...currentProducts, { quantity: null, price: null, discountValue: null }]
                });
              }}
              block
              icon={<PlusOutlined />}
            >
              Thêm sản phẩm
            </Button>
            </Col>
            <Col md={24} xs={24} style={{ display: 'flex', justifyContent: 'end', marginTop: 50, marginBottom: 20 }}>
              <CustomButton htmlType="submit" />
            </Col>
          </Row>
        </div>
      )}
    </Form.List>
  )
}

const HeadDetail = ({ details, detailCohoi, setDetailSp, setDetailCohoi }) => {
  const { form } = useContext(FormContextCustom);
  const [code, setCode] = useState('')

  const onClick = async (item, index) => {
    if (arrayNotEmpty(details?.details)) {
      /* SeT value In Current Form */
      let rForm = await generateInForm(details, index);
      setDetailCohoi(rForm)
      setDetailSp(rForm?.product)
      setCode(item.code)
    }
  };

  useMount(() => {
    if (detailCohoi?.id && arrayNotEmpty(details?.details ?? [])) {
      form.setFieldsValue({ detailId: details?.details[0].id });
    }
  });

  return arrayEmpty(details?.details)
    ? <Tag size="small" style={{ cursor: "pointer" }} color={'#2db7f5'}>{(details.length + 1)} - Cơ hội mới</Tag>
    : details?.details.sort((a, b) => (a.code === "New" ? 1 : b.code === "New" ? -1 : 0)).map((item, id) => {
      let color = item.code === code ? '#2db7f5' : '#ccc';
      const newName = item.productName;
      return (
        <Tag
          onClick={() => onClick(item, id)}
          key={id}
          size="small"
          style={{ textAlign: 'center', cursor: "pointer" }}
          color={color}
        >
          {item.code} {!newName ? `${id + 1} Cơ hội mới` : <span><br />{newName}</span>}
        </Tag>
      )
    })
}


export default FormBase
