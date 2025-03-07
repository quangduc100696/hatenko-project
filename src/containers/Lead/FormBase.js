import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Row, Table, Tag } from 'antd';
import { PhoneOutlined, MailOutlined, UserAddOutlined, FacebookOutlined, AimOutlined, FundOutlined } from '@ant-design/icons';
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
import RequestUtils from 'utils/RequestUtils';
import ModaleStyles from 'pages/lead/style';
import { ModaleCreateCohoiStyle } from './styles';
import { InAppEvent } from 'utils/FuseUtils';
import { HASH_MODAL_CLOSE } from 'configs';

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

const newSp = (data) => {
  const mergedData = data.map(item => ({
    ...item.value,
    ...item.detail,
    price: item.value?.price,
    discountValue: item.value?.discountValue,
    discountUnit: item.value?.discountUnit,
    skuId: item.value?.skuId,
  }));
  return mergedData
}

const FormBase = ({ setDetailSp, detailCohoi, setDetailCohoi, detailSp, setTotal, data }) => {
  const [detailArr, setDetailArr] = useState([]);
  const [priceSp, setPriceSp] = useState(null);
  const [details, setDetails] = useState({});
  const [form] = Form.useForm();
  const [customer, setCustomer] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [listSp, setListSp] = useState([]);
  const [totalPrices, setTotalPrices] = useState(null);

  let totalPrice = newSp(listSp)?.reduce((sum, item) => sum + item.price, 0);
  let totalQuanlity = newSp(listSp)?.reduce((sum, item) => sum + item.quantity, 0);

  // useEffect(() => {
  //   (() => {
  //     if (detailSp?.skus) {
  //       const { quantity } = form.getFieldsValue();
  //       let price = "";
  //       for (const item of detailSp?.skus) {
  //         if (arrayNotEmpty(item?.listPriceRange)) {
  //           for (const element of item?.listPriceRange) {
  //             if (quantity >= element?.quantityFrom && quantity <= element?.quantityTo) {
  //               price = priceSp;
  //               break;
  //             }
  //           }
  //         }
  //       }
  //       if (price) {
  //         form.setFieldsValue({ price: price })
  //       }
  //     }
  //   })()
  //   // eslint-disable-next-line
  // }, [priceSp])

  useEffect(() => {
    (async () => {
      const customer = await RequestUtils.Get(`/customer/find-by-phone?phone=${data?.customerMobile}&withOrder=withOrder`);
      setCustomer(customer?.data);
    })()
  }, [])

  // useEffect(() => {
  //   const currentValues = form.getFieldValue("products");
  //   if (!currentValues || currentValues.length === 0) {
  //     form.setFieldsValue({ products: [{}] });
  //   }
  // }, []);

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

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Đơn vi tính',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Thông tin sản phẩm',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Hành động',
      dataIndex: '',
      key: 'x',
      render: () => <a>Delete</a>,
    },
  ];

  const onHandleCreateSp = (value) => {
    setListSp((pre = []) => [
      ...pre,
      { value, detail: detailSp } // Bọc trong dấu `{}` để tạo object
    ]);
    InAppEvent.normalSuccess("Tạo sản phẩm thành công");
    form.resetFields();
    setIsOpen(false)
  }

  const onHandleCreateOdder = async() => {
    const newItem = newSp(listSp)?.map((item, i) => {
      const items = [];
      const skuDetails = item?.skus?.map(item => item?.skuDetail).flat();
        items.push({
          productId: item?.id,
          skuInfo: JSON.stringify(skuDetails),
          name: item?.productName,
          skuId: item?.skuId,
          quantity: item?.quantity,
          price: item?.price
        })
        return {
          productName: item?.name,
          items: items,
        }
    })
    const params = {
      vat: 0,
      dataId: data?.id,
      paymentInfo: {
        amount: totalPrices,
      },
      customer: {
        saleId: customer?.iCustomer?.saleId,
        gender: customer?.iCustomer?.gender,
        name: customer?.iCustomer?.name,
        email: customer?.iCustomer?.email,
        mobile: customer?.iCustomer?.mobile,
        createdAt: customer?.iCustomer?.createdAt,
        updatedAt: customer?.iCustomer?.updatedAt,
      },
      details: newItem
    }
    const datas = await RequestUtils.Post('/customer-order/sale-create-co-hoi', params);
    if(datas?.errorCode === 200) {
      InAppEvent.emit(HASH_MODAL_CLOSE);
      InAppEvent.normalSuccess("Tạo cơ hội thành công");
    }else {
      InAppEvent.normalError("Tạo cơ hội thất bại");
    }
  }

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
    // <Form.List name="products">
    //   {(fields, { add, remove }) => (
    //     <div style={{ marginTop: 20 }}>
    //       {fields.map(({ key, name, ...restField }) => (
    //         <Row
    //           gutter={16}
    //           key={key}
    //           align="middle"
    //           style={{
    //             borderRadius: 20,
    //             padding: 10,
    //             position: "relative",
    //             border: "2px dashed #f2f1fc",
    //             marginBottom: 30,
    //           }}
    //         >
    //           <Col md={12} xs={24}>
    //             <FormAutoCompleteInfinite
    //               useGetAllQuery={useGetAllProductQuery}
    //               label="Sản phẩm"
    //               filterField="name"
    //               name={[name, "productName"]} // Đảm bảo name là unique
    //               valueProp="name"
    //               searchKey="name"
    //               required
    //               placeholder="Tìm kiếm Sản phẩm"
    //               customGetValueFromEvent={(productName, product) => {
    //                 setDetailSp((prev) => ({ ...prev, [name]: product })); // Lưu theo từng form
    //                 return productName;
    //               }}
    //             />
    //           </Col>

    //           <Col md={12} xs={24}>
    //             <FormSelect
    //               {...restField}
    //               name={[name, "skuId"]}
    //               label="SKU"
    //               required
    //               resourceData={detailSp[name]?.skus ?? []} // Lấy SKU của sản phẩm cụ thể
    //               placeholder="Chọn SKU"
    //             />
    //           </Col>

    //           <Col md={6} xs={24}>
    //             <FormInputNumber
    //               {...restField}
    //               required
    //               name={[name, "quantity"]}
    //               label="Số lượng"
    //               min="0"
    //               placeholder="Nhập Số lượng"
    //             />
    //           </Col>

    //           <Col md={6} xs={24}>
    //             <FormInputNumber
    //               {...restField}
    //               required
    //               name={[name, "price"]}
    //               label="Đơn giá"
    //               min="0"
    //               placeholder="Nhập Đơn giá"
    //             />
    //           </Col>

    //           <Col md={6} xs={24}>
    //             <FormSelect
    //               {...restField}
    //               name={[name, "discountUnit"]}
    //               titleProp="text"
    //               valueProp="value"
    //               resourceData={DISCOUNT_UNIT_CONST}
    //               label="Giảm giá nếu có"
    //               placeholder="Chọn hình thức giảm"
    //             />
    //           </Col>

    //           <Col md={6} xs={24}>
    //             <FormInputNumber
    //               {...restField}
    //               label="Giảm giá % / VND"
    //               min="0"
    //               name={[name, "discountValue"]}
    //               placeholder="Nhập giá trị"
    //             />
    //           </Col>

    //           <div
    //             type="text"
    //             style={{
    //               position: "absolute",
    //               top: -10,
    //               right: -10,
    //               cursor: "pointer",
    //             }}
    //             onClick={() => remove(name)}
    //           >
    //             <CloseCircleOutlined style={{ fontSize: 24 }} />
    //           </div>

    //         </Row>
    //       ))}
    //       <Form.Item shouldUpdate={(prev, cur) => JSON.stringify(prev.products) !== JSON.stringify(cur.products)}>
    //         {({ getFieldValue }) => {
    //           const products = getFieldValue("products") || [];
    //           const total = products?.reduce((sum, product) => {
    //             // const { quantity = 0, price = 0, discountValue = 0, discountUnit } = product;
    //             const subTotal = product?.quantity * product?.price;
    //             const discountValue = product?.discountValue;
    //             const discountUnit = product?.discountUnit
    //             const discount = calPriceOff({ discountValue, discountUnit, total: subTotal });
    //             return sum + (subTotal - discount);
    //           }, 0);
    //           setTotal(total)
    //           return (
    //             <ShowPriceStyles md={24} xs={24}>
    //               <h3 className="lo-order">Thành tiền: {formatMoney(total)}</h3>
    //             </ShowPriceStyles>
    //           )
    //         }}
    //       </Form.Item>

    //       <Row>
    //         <Col span={24} style={{ textAlign: "right" }}>
    //         <Button
    //           type="dashed"
    //           onClick={() => {
    //             const currentProducts = form.getFieldValue("products") || [];
    //             form.setFieldsValue({
    //               products: [...currentProducts, { quantity: null, price: null, discountValue: null }]
    //             });
    //           }}
    //           block
    //           icon={<PlusOutlined />}
    //         >
    //           Thêm sản phẩm
    //         </Button>
    //         </Col>
    //         <Col md={24} xs={24} style={{ display: 'flex', justifyContent: 'end', marginTop: 50, marginBottom: 20 }}>
    //           <CustomButton htmlType="submit" />
    //         </Col>
    //       </Row>
    //     </div>
    //   )}
    // </Form.List>
    <div style={{ marginTop: 15 }}>
      <p><strong>Thông tin khách hàng</strong></p>
      <div class="group-inan" style={{ background: '#f4f4f4', borderTop: '1px dashed red' }}></div>
      <Row style={{ marginTop: 20 }}>
        <Col md={6} xs={6}>
          <p>
            <span style={{ marginRight: 10 }}><UserAddOutlined /></span>
            <span>User: {customer?.iCustomer?.name}</span>
          </p>
        </Col>
        <Col md={6} xs={6}>
          <p>
            <span style={{ marginRight: 10 }}><PhoneOutlined /></span>
            <span>Số điện thoại: {customer?.iCustomer?.mobile}</span>
          </p>
        </Col>
        <Col md={6} xs={6}>
          <p>
            <span style={{ marginRight: 10 }}><MailOutlined /></span>
            <span>Email: {customer?.iCustomer?.email}</span>
          </p>
        </Col>
      </Row>
      <Row style={{ marginTop: 10 }}>
        <Col md={6} xs={6}>
          <p>
            <span style={{ marginRight: 10 }}><FacebookOutlined /></span>
            <span>Facebook: {customer?.iCustomer?.facebookId || 'N/A'}</span>
          </p>
        </Col>
        <Col md={6} xs={6}>
          <p>
            <span style={{ marginRight: 10 }}><AimOutlined /></span>
            <span>Tỉnh T/P: {customer?.iCustomer?.address || 'Chưa cập nhật'}</span>
          </p>
        </Col>
      </Row>
      <div style={{ height: 15 }}></div>
      <p>
        <strong>Thông tin sản phẩm</strong>
      </p>
      <div class="group-inan" style={{ background: '#f4f4f4', marginTop: 10, marginBottom: 20, borderTop: '1px dashed red' }}></div>
      <Button
        type="dashed"
        style={{ float: 'right', marginBottom: 20 }}
        icon={<PlusOutlined />}
        onClick={() => setIsOpen(true)}
      >
        Thêm sản phẩm
      </Button>
      <Table
        columns={columns}
        scroll={{ x: 1700 }}
        expandable={{
          expandedRowRender: (record) => (
            <p
              style={{
                margin: 0,
              }}
            >
              {record.description}
            </p>
          ),
          rowExpandable: (record) => record.name !== 'Not Expandable',
        }}
        dataSource={newSp(listSp)}
        pagination={false}
      />
            <div class="group-inan" style={{ background: '#f4f4f4', marginTop: 10, marginBottom: 20, borderTop: '1px dashed red' }}></div>
      <Row justify={'end'}>
        <Col md={6} xs={6}>
          <p>
            <strong>Đơn giá tổng: {formatMoney(totalPrice)}</strong>
          </p>
        </Col>
        <Col md={6} xs={6}>
          <p>
            <strong> Số lượng tổng: {totalQuanlity} đơn</strong>
          </p>
        </Col>
      </Row>
      <Row justify={'end'}>
        <Col md={6} xs={6}>
          <p>
            <strong>Hình thức triết khấu </strong>
          </p>
        </Col>
        <Col md={6} xs={6}>
          <p>
            <strong>Giá trị triết khấu </strong>
          </p>
        </Col>
      </Row>
      <div style={{float: 'right', marginTop: 20}} onClick={onHandleCreateOdder}>
        <CustomButton title="Tạo đơn" htmlType="submit" />
      </div>
      <ModaleCreateCohoiStyle title={
        <div style={{ color: '#fff' }}>
          Tạo sản phẩm
        </div>
      } width={820}
        open={isOpen} footer={false} onCancel={() => setIsOpen(false)}>
        <div style={{ padding: 15 }}>
          <Form form={form} layout="vertical" onFinish={onHandleCreateSp}>
            <Row gutter={16} style={{ marginTop: 20 }}>
              <Col md={12} xs={24}>
                <FormAutoCompleteInfinite
                  useGetAllQuery={useGetAllProductQuery}
                  label="Sản phẩm"
                  filterField="name"
                  name="productName"
                  valueProp="name"
                  searchKey="name"
                  required
                  placeholder="Tìm kiếm Sản phẩm"
                  customGetValueFromEvent={(productName, product) => {
                    // setDetailCohoi({ product, productName });
                    setDetailSp(product);
                    return productName;
                  }}
                />
              </Col>
              <Col md={12} xs={24}>
                <FormSelect
                  name="skuId"
                  label="SKU"
                  required
                  resourceData={detailSp?.skus ?? []}
                  placeholder="Chọn SKU"
                />
              </Col>

              <Col md={12} xs={24} style={{width: '100%'}}>
                <FormInputNumber
                  required
                  name="quantity"
                  label="Số lượng"
                  min="0"
                  placeholder="Nhập Số lượng"
                />
              </Col>
              <Col md={12} xs={24}>
                <FormInputNumber
                  required
                  name="price"
                  label="Đơn giá"
                  min="0"
                  placeholder="Nhập Đơn giá"
                />
              </Col>

              <Col md={12} xs={24}>
                <FormSelect
                  name="discountUnit"
                  titleProp="text"
                  valueProp="value"
                  resourceData={DISCOUNT_UNIT_CONST}
                  label="Giảm giá nếu có"
                  placeholder="Chọn hình thức giảm"
                />
              </Col>
              <Col md={12} xs={24}>
                <FormInputNumber
                  label="Giảm giá % / VND"
                  min="0"
                  name="discountValue"
                  placeholder="Nhập giá trị"
                />
              </Col>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, curValues) => (
                  prevValues.quantity !== curValues.quantity
                  || prevValues.discountValue !== curValues.discountValue
                  || prevValues.discountUnit !== curValues.discountUnit
                  || prevValues.price !== curValues.price
                )}
              >
                {({ getFieldValue }) => {
                  const { skuId, quantity, discountValue, discountUnit, price } = getFieldValue();
                  const total = quantity * price;
                  const pOff = calPriceOff({ discountValue, discountUnit, total });
                  const totalAFD = total - pOff;
                  const priceText = formatMoney(skuId ? (totalAFD > 0 ? totalAFD : 0) : 0);
                  handleDistancePrice(detailSp, quantity);
                  const newPrice = quantity ? handleDistancePrice(skuId, detailSp, quantity, priceText, discountValue, discountUnit, 'not').replace('VND', '') : '0';
                  setPriceSp(parseFloat(newPrice.replace(/\./g, '').trim()))
                  const newPrices = handleDistancePrice(skuId, detailSp, quantity, priceText, discountValue, discountUnit, 'yes');
                  setTotalPrices(newPrices);
                  return (
                    <ShowPriceStyles md={24} xs={24}>
                      <h3 className="lo-order">Thành tiền: {handleDistancePrice(skuId, detailSp, quantity, priceText, discountValue, discountUnit, 'yes')}</h3>
                    </ShowPriceStyles>
                  )
                }}
              </Form.Item>
              <Col md={24} xs={24} style={{ display: 'flex', justifyContent: 'end', marginBottom: 20 }}>
                <CustomButton htmlType="submit" />
              </Col>
            </Row>
          </Form>
          {/* <Form.List name="products">
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
          </Form.List> */}
        </div>
      </ModaleCreateCohoiStyle>
    </div>
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
