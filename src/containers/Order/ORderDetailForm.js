// import { Tag, Form, Row, Col } from "antd";
// import { FormContextCustom } from "components/context/FormContextCustom";
// import FormAutoCompleteInfinite from "components/form/AutoCompleteInfinite/FormAutoCompleteInfinite";
// import FormInput from "components/form/FormInput";
// import FormInputNumber from "components/form/FormInputNumber";
// import FormSelect from "components/form/FormSelect";
// import { DISCOUNT_UNIT_CONST } from "configs/localData";
// import ProductSumary from "containers/Product/ProductSumary";
// import { useGetAllProductQuery } from "hooks/useData";
// import { useContext } from "react";
// import { arrayEmpty, arrayNotEmpty, formatMoney } from "utils/dataUtils";
// import CustomButton from 'components/CustomButton';
// import FormTextArea from "components/form/FormTextArea";
// import { ShowPriceStyles } from "./styles";
// import { calPriceOff } from "utils/tools";
// import FormHidden from "components/form/FormHidden";
// import ShowCustomerInfo from "containers/Customer/ShowCustomerInfo";
// import { useMount } from "hooks/MyHooks";
// import { generateInForm } from "./utils";
// import { cloneDeep } from "lodash";
// import FormSelectAPI from "components/form/FormSelectAPI";

// const ORderDetailForm = ({data}) => {
//   const { record, updateRecord } = useContext(FormContextCustom);
//   const onClickAddNewOrder = async () => {
//     if(arrayEmpty(record?.details ?? [])) {
//       return;
//     }
//     let nRecord = cloneDeep(record);
//     let details = nRecord.details;
//     let detail = cloneDeep(details[details.length - 1]);
//     if(detail.code === "New") {
//       return;
//     }
//     detail.id = "";
//     detail.code = "New"
//     detail.productName = "(Thêm cơ hội)"
//     detail.skuId = null;
//     detail.quantity = "";
//     detail.price = "";
//     detail.discount = {
//       discountUnit: null,
//       discountValue: ""
//     }
//     detail.note = "";
//     detail.name = "";
//     detail.status = null;

//     details.push(detail);
//     let rForm = await generateInForm(nRecord, details.length - 1);
//     updateRecord(rForm);
//   };

//   return <>
//     <FormHidden name="id" />
//     <FormHidden name="detailCode" />
//     <FormHidden name="detailId" />
//     <Form.Item 
//       noStyle
//       shouldUpdate={ (prevValues, curValues) => prevValues.detailCode !== curValues.detailCode }
//     >
//       {({ getFieldValue }) => (
//         <HeadDetail  details={record?.details ?? []} currentCode={getFieldValue('detailCode')} />
//       )}
//     </Form.Item>
//     <Row gutter={16} style={{marginTop: 20}}>  
//       <Col md={24} xs={24}>
//         <ShowCustomerInfo customer={record?.customer ?? {}} />
//       </Col>
//       <Col md={24} xs={24}>
//         <ProductSumary data={record?.product ?? {}} />
//         <div style={{ margin: '20px 0px' }}>
//           <p><strong>Thông tin đơn hàng</strong></p>
//           <div className="line-dash"></div>
//         </div>
//       </Col>
      
//       <Col md={12} xs={24}>
//         <FormAutoCompleteInfinite 
//           useGetAllQuery={useGetAllProductQuery}
//           label="Sản phẩm"
//           filterField="name"
//           name="productName"
//           valueProp="name"
//           searchKey="name"
//           required
//           placeholder="Tìm kiếm Sản phẩm"
//           customGetValueFromEvent={(productName, product) => {
//             updateRecord({product, productName});
//             return productName;
//           }}
//         />
//       </Col>
//       <Col md={12} xs={24}>
//         <FormSelect 
//           name="skuId"
//           label="SKU"
//           required
//           resourceData={record?.product?.skus ?? []}
//           placeholder="Chọn SKU"
//         />
//       </Col>

//       <Col md={12} xs={24}>
//         <FormInputNumber 
//           required
//           name="quantity"
//           label="Số lượng"
//           min="0" 
//           placeholder="Nhập Số lượng"
//         />
//       </Col>
//       <Col md={12} xs={24}>
//         <FormInputNumber 
//           required
//           name="price"
//           label="Đơn giá"
//           min="0" 
//           placeholder="Nhập Đơn giá"
//         />
//       </Col>

//       <Col md={12} xs={24}>
//         <FormSelect 
//           name="discountUnit"
//           titleProp="text"
//           valueProp="value"
//           resourceData={DISCOUNT_UNIT_CONST}
//           label="Giảm giá nếu có"
//           placeholder="Chọn hình thức giảm"
//         />
//       </Col>
//       <Col md={12} xs={24}>
//         <FormInputNumber 
//           label="Giảm giá % / VND"
//           min="0" 
//           name="discountValue"
//           placeholder="Nhập giá trị"
//         />
//       </Col>

//       <Form.Item
//         noStyle
//         shouldUpdate={(prevValues, curValues) => (
//           prevValues.quantity !== curValues.quantity
//           || prevValues.discountValue !== curValues.discountValue
//           || prevValues.discountUnit !== curValues.discountUnit
//           || prevValues.price !== curValues.price
//         )}
//       >	
//         {({ getFieldValue }) => {
//           const { skuId, quantity, discountValue, discountUnit, price  } = getFieldValue();
//           const total = quantity * price;
//           const pOff = calPriceOff({ discountValue, discountUnit, total });
//           const totalAFD = total - pOff;
//           return (
//             <ShowPriceStyles md={24} xs={24}>
//               <h3 className="lo-order">Thành tiền: {formatMoney(skuId ? (totalAFD > 0 ? totalAFD : 0) : 0)}</h3>
//             </ShowPriceStyles>
//           )
//         }}
//       </Form.Item>
      
//       <Col md={24} xs={24}>
//         <FormTextArea 
//           rows={3}
//           name="note"
//           label="Ghi chú đơn"
//           placeholder="Nhập ghi chú"
//         />
//       </Col>

//       <Col md={12} xs={24}>
//         <FormInput 
//           required
//           name="name" 
//           label="Tên đơn"
//           placeholder="Nhập tên đơn"
//         />
//       </Col>
//       <Col md={12} xs={24}>

//          <FormSelectAPI
//           required
//           apiPath='status-order/fetch'
//           apiAddNewItem='status-order/save'
//           onData={(data) => data ?? []}
//           label="Trạng thái"
//           name="status"
//           placeholder="Chọn trạng thái"
//         />
//       </Col>

//       <Col md={24} xs={24} style={{display: 'flex', justifyContent:'end', marginBottom: 20}}>
//         <CustomButton htmlType="submit" />
//         <CustomButton 
//           disabled={ (record?.id || 0) === 0}
//           color="primary" 
//           variant="outlined"
//           title="Thêm cơ hội mới" 
//           style={{marginLeft: 20}} 
//           onClick={() => onClickAddNewOrder()}
//         />
//       </Col>
//     </Row>
//   </>
// }

// const HeadDetail = ({ details, currentCode }) => {

//   const { form, record, updateRecord } = useContext(FormContextCustom);
//   const onClick = async (index) => {
//     if(arrayNotEmpty(details)) {
//       /* SeT value In Current Form */
//       let rForm = await generateInForm(record, index);
//       updateRecord(rForm);
//     }
//   };

//   useMount(() => {
//     if(record?.id && arrayNotEmpty(details ?? [])) {
//       form.setFieldsValue({ detailId: details[0].id });
//     }
//   });

// 	return arrayEmpty(details) 
//   ? <Tag size="small" style={{ cursor: "pointer" }} color={'#2db7f5'}>{ (details.length + 1) } - Cơ hội mới</Tag>
//   : details.map((item, id) => {
//     let color = item.code === currentCode ? '#2db7f5' : '#ccc';
//     const newName = item.productName;
//     return (
//       <Tag 
//         onClick={()=> onClick(id)}
//         key={id} 
//         size="small" 
//         style={{ textAlign: 'center', cursor: "pointer" }} 
//         color={color}
//       >
//         {item.code} {!newName ? `${id + 1} Cơ hội mới` : <span><br/>{newName}</span>}
//       </Tag>
//     )
//   })
// }

import { useContext, useEffect, useState } from "react";
import { Tag, Form, Row, Col, Button, Table, InputNumber } from "antd";
import { FormContextCustom } from "components/context/FormContextCustom";
import { PhoneOutlined, MailOutlined, UserAddOutlined, FacebookOutlined, AimOutlined, FundOutlined } from '@ant-design/icons';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import FormInputNumber from "components/form/FormInputNumber";
import FormSelect from "components/form/FormSelect";
import { DISCOUNT_UNIT_CONST } from "configs/localData";
import ProductSumary from "containers/Product/ProductSumary";
import { useGetAllProductQuery } from "hooks/useData";
import { arrayEmpty, arrayNotEmpty, f5List, formatMoney } from "utils/dataUtils";
import CustomButton from 'components/CustomButton';
import FormTextArea from "components/form/FormTextArea";
import { ShowPriceStyles } from "../Order/styles";
import { calPriceOff } from "utils/tools";
import FormHidden from "components/form/FormHidden";
import { useMount } from "hooks/MyHooks";
import { generateInForm } from "../Order/utils";
import { cloneDeep } from "lodash";
import FormAutoCompleteInfinite from "components/form/AutoCompleteInfinite/FormAutoCompleteInfinite";
import RequestUtils from "utils/RequestUtils";
import { InAppEvent } from "utils/FuseUtils";
import { HASH_MODAL_CLOSE } from "configs";
import { ModaleCreateCohoiStyle } from "containers/Lead/styles";
import FormInput from "components/form/FormInput";
import ModaleStyles from "pages/lead/style";


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
  const newData = data.map((item, i) => {
    const newItem = item?.items?.map((subItem) => ({
      ...subItem,
      code: item.code, // Thêm code vào từng phần tử trong mảng items
      key: i,
    }));
    return newItem; // Phải return object
  });
  return newData.flat();
};

const OptionPrice = [{ title: 'Tiền mặt', name: 'tienmat' }, { title: 'MoMo', name: 'momo' }, { title: 'VNpay', name: 'vnpay' }]

const thStyle = {
  padding: "8px 12px",
  borderBottom: "2px solid #ddd",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "8px 12px",
  borderBottom: "1px solid #ddd",
};

const OrderDtailForm = ({ data }) => {

  const { record, updateRecord } = useContext(FormContextCustom);
  const [detailSp, setDetailSp] = useState([])
  const [detailArr, setDetailArr] = useState([]);
  const [priceSp, setPriceSp] = useState(null);
  const [form] = Form.useForm();
  const [FormQuanlity] = Form.useForm();
  const [customer, setCustomer] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [listSp, setListSp] = useState(data?.details || []);
  const [isOpenQuantity, setIsOpenQuantity] = useState(false);
  const [recordetail, setRecodetail] = useState({});
  const [value, setValue] = useState(0);

  let totalPrice = newSp(listSp).reduce((sum, item) => sum + item?.price, 0);
  let totalQuanlity = newSp(listSp)?.reduce((sum, item) => sum + item?.quantity, 0);
  let total = newSp(listSp)?.reduce((sum, item) => sum + item?.price * item?.quantity, 0);

  useEffect(() => {
    (async () => {
      const customer = await RequestUtils.Get(`/customer/find-by-phone?phone=${data?.customerMobilePhone}&withOrder=withOrder`);
      setCustomer(customer?.data);
    })()
  }, [])

  useEffect(() => {
    if (recordetail) {
      FormQuanlity.setFieldsValue({ quantity: recordetail?.quantity })
    }
  }, [recordetail])

  /* bắt đơn giá theo sản phẩm */
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

  const onClickAddNewOrder = async () => {
    if (arrayEmpty(record?.details ?? [])) {
      return;
    }
    let nRecord = cloneDeep(record);
    let details = nRecord.details;
    let detail = cloneDeep(details[details.length - 1]);
    if (detail.code === "New") {
      return;
    }
    detail.id = "";
    detail.code = "New"
    detail.productName = "(Thêm cơ hội)"
    detail.skuId = null;
    detail.quantity = "";
    detail.price = "";
    detail.discount = {
      discountUnit: null,
      discountValue: ""
    }
    detail.note = "";
    detail.name = "";
    detail.status = null;

    details.push(detail);
    let rForm = await generateInForm(nRecord, details.length - 1);
    updateRecord(rForm);
  };

  const onHandleDeleteSp = (record) => {
    const newItem = listSp?.map(item => {
      const items = item?.items?.filter(f => f?.id !== record?.id);
      return {
        ...item,
        items: items
      }
    })
    setListSp(newItem)
  }

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
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
    Table.EXPAND_COLUMN,
    {
      title: 'Thông tin sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Đơn giá',
      render: (item) => {
        return (
          <div>
            {formatMoney(item?.price)}
          </div>
        )
      }
    },
    {
      title: 'Chiết khấu',
      render: (item) => {
        return (
          <div>
            {item?.discountUnit === "percent" ? `${item?.discountValue || 0}%` : formatMoney(item?.discountValue)}
          </div>
        )
      }
    },
    {
      title: 'Số lượng',
      render: (item) => (
        <InputNumber
          min={1}
          disabled={true}
          value={item.quantity}
          onChange={(value) => {
            const newData = listSp.map(f => {
              return {
                ...f,
                items: f.items.map(v => v.id === item.id ? { ...v, quantity: value } : v)
              };
            });
            setListSp(newData);
          }}
        />
      )
    },
    {
      title: 'Tổng tiền',
      render: (item) => {
        return (
          <div>
            {formatMoney(item?.price * item?.quantity)}
          </div>
        )
      }
    },
    {
      title: 'Hành động',
      dataIndex: '',
      key: 'x',
      render: (record) => (
        <div style={{ display: 'flex', gap: 10 }}>
          <div onClick={() => onHandleDeleteSp(record)}>
            <a>Xoá sản phẩm</a>
          </div>
        </div>
      ),
    },
  ];

  const onHandleCreateOdder = async (value) => {

    const tongdon = newSp(listSp).reduce((total, item) => total + (item.price * item.quantity), 0);
    const newDetails = (data?.details || []).map((detail) => {
      const matchingItems = listSp
        .filter(sp => sp.code === detail.code)
        .flatMap(sp => sp.items || []);
      const items = matchingItems.length > 0
        ? matchingItems
        : listSp.flatMap(sp => sp.items || []);

      return {
        productName: detail?.productName || detail?.name || "N/A",
        id: detail?.id || null,
        items: items.map(item => ({
          id: item?.id,
          skuInfo: item?.skuInfo,
          skuId: item?.skuId,
          productId: item?.productId || null,
          name: item?.productName || item?.name || null,
          quantity: item?.quantity,
          price: item?.price,
          discountValue: item?.discountValue || 0,
          discountUnit: item?.discountUnit || null
        }))
      };
    });
    if (!data?.details?.length && listSp.length) {
      newDetails.push({
        productName: listSp[0]?.productName || "N/A",
        id: null,
        items: listSp.flatMap(sp => sp.items || []).map(item => ({
          id: item?.id,
          skuInfo: item?.skuInfo,
          skuId: item?.skuId,
          productId: item?.productId || null,
          productName: item?.productName || item?.name || null,
          quantity: item?.quantity,
          price: item?.price,
          discountValue: item?.discountValue || 0,
          discountUnit: item?.discountUnit || null
        }))
      });
    }
    const params = {
      vat: 0,
      id: data?.id,
      dataId: data?.id,
      paymentInfo: {
        amount: tongdon,
        method: value?.optionPrice,
        status: true,
        content: value?.noteMonney
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
      details: newDetails,
      note: value?.note,
      address: value?.value
    };
    const datas = await RequestUtils.Post('/order/save', params);
    if (datas?.errorCode === 200) {
      const isSuccess = datas?.errorCode === 200;
      if(isSuccess) {
        f5List('order/fetch');
      }
      // InAppEvent.emit(HASH_MODAL_CLOSE);
      InAppEvent.normalSuccess("Cập nhật đơn hàng thành công");
    } else {
      InAppEvent.normalError("Cập nhật đơn hàng thất bại");
    }
  };

  // Hàm onHandleCreateSp
  const onHandleCreateSp = (value) => {
    const skuDetails = detailSp?.skus?.map(sku => sku?.skuDetail).flat();
    const newItems = {
      id: null,
      skuId: value.skuId,
      skuInfo: JSON.stringify(skuDetails),
      productId: detailSp?.id,
      orderDetailId: null,
      name: value.productName,
      quantity: value.quantity || 1,
      price: value.price || 0,
      discount: null,
      discountValue: value.discountValue || 0,
      discountUnit: value.discountUnit || null,
      total: value.quantity * value.price
    };

    setListSp((prev = []) => {
      const targetCode = data?.details?.[0]?.code || "NEW-DEFAULT";
      const targetDetailIndex = prev.findIndex(sp => sp.code === targetCode);

      if (targetDetailIndex === -1) {
        return [{
          id: null,
          code: targetCode,
          name: null,
          price: null,
          priceOff: 0,
          customerOrderId: null,
          total: value.quantity * value.price,
          productName: data?.details?.[0]?.productName || value.productName || "N/A",
          productId: null,
          customerNote: null,
          dayDuote: null,
          discount: null,
          skuId: null,
          skuInfo: null,
          items: [newItems]
        }];
      }
      const updatedList = [...prev];
      updatedList[targetDetailIndex] = {
        ...updatedList[targetDetailIndex],
        items: [...(updatedList[targetDetailIndex].items || []), newItems],
        total: (updatedList[targetDetailIndex].total || 0) + newItems.total
      };
      console.log("listSp sau khi thêm:", JSON.stringify(updatedList, null, 2));
      return updatedList;
    });

    InAppEvent.normalSuccess("Thêm sản phẩm thành công");
    form.resetFields();
    setIsOpen(false);
  };

  return <>
    <div style={{ marginTop: 15 }}>
      <Form onFinish={onHandleCreateOdder} layout="vertical" >
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
        {/* <Button
          type="dashed"
          style={{ float: 'right', marginBottom: 20 }}
          icon={<PlusOutlined />}
          onClick={() => setIsOpen(true)}
        >
          Thêm sản phẩm
        </Button> */}
        <Table
          columns={columns}
          scroll={{ x: 1700 }}
          expandable={{
            expandedRowRender: (record) => {
              return (
                <div style={{ padding: "10px", background: "#f9f9f9", borderRadius: "8px" }}>
                  {record ? (
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        background: "#fff",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <thead>
                        <tr style={{ background: "#f0f0f0", textAlign: "left" }}>
                          <th style={thStyle}>Tên SKU</th>
                          <th style={thStyle}>Giá bán</th>
                          <th style={thStyle}>Chi tiết</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <td style={tdStyle}>{record.name}</td>
                          <td style={tdStyle}>
                            {formatMoney(record?.price)}
                          </td>
                          <td style={tdStyle}>
                            {(() => {
                              let parsedSkuInfo = [];
                              try {
                                if (record?.skuInfo) {
                                  parsedSkuInfo = JSON.parse(record?.skuInfo);
                                }
                              } catch (error) {
                                console.error("Lỗi parse JSON:", error);
                              }
                              return parsedSkuInfo.map((detail) => (
                                <p key={detail.id} style={{ marginRight: "10px" }}>
                                  <strong>{detail.name}:</strong> {detail.value}
                                </p>
                              ));
                            })()}
                          </td>
                          {/* <td style={tdStyle}>
                          {parsedSkuInfo.map((detail) => (
                            <p key={detail.id} style={{ marginRight: "10px" }}>
                              <strong>{detail.name}:</strong> {detail.value}
                            </p>
                          ))}
                        </td> */}
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <p>Không có SKU nào</p>
                  )}
                </div>
              )
            },
          }}

          dataSource={newSp(listSp)}
          pagination={false}
        />
        <div class="group-inan" style={{ background: '#f4f4f4', marginTop: 10, marginBottom: 20, borderTop: '1px dashed red' }}></div>
        <Row justify={'end'}>
          {/* <Col md={24} xs={24}>
            <FormTextArea
              rows={3}
              dis
              name="note"
              label="Note khách hàng"
              placeholder="Note khách hàng"
            />
          </Col>
          <Col md={24} xs={24}>
            <FormTextArea
              rows={3}
              name="address"
              label="Địa chỉ giao hàng"
              placeholder="Địa chỉ giao hàng"
            />
          </Col> */}
          <Col md={6} xs={6}>
            <p>
              <strong>Đơn giá tổng: {formatMoney(totalPrice)}</strong>
            </p>
          </Col>
          <Col md={6} xs={6}>
            <p>
              <strong> Số lượng sản phẩm: {totalQuanlity} sản phẩm</strong>
            </p>
          </Col>
        </Row>
        <Row justify={'end'}>
          <Col md={6} xs={6}>
            <p>
              <strong> Tổng tiền: {formatMoney(total)}</strong>
            </p>
          </Col>
          <Col md={6} xs={6}>
            <p>
              <strong>Giá trị chiết khấu </strong>
            </p>
          </Col>
        </Row>
        {/* <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 50 }}>
          <CustomButton title="Tạo đơn" htmlType="submit" />
        </div> */}
      </Form>
    </div>
  </>
}

const HeadDetail = ({ details, currentCode }) => {

  const { form, record, updateRecord } = useContext(FormContextCustom);
  const onClick = async (index) => {
    if (arrayNotEmpty(details)) {
      /* SeT value In Current Form */
      let rForm = await generateInForm(record, index);
      updateRecord(rForm);
    }
  };

  useMount(() => {
    if (record?.id && arrayNotEmpty(details ?? [])) {
      form.setFieldsValue({ detailId: details[0].id });
    }
  });

  return arrayEmpty(details)
    ? <Tag size="small" style={{ cursor: "pointer" }} color={'#2db7f5'}>{(details.length + 1)} - Cơ hội mới</Tag>
    : details.map((item, id) => {
      let color = item.code === currentCode ? '#2db7f5' : '#ccc';
      const newName = item.productName;
      return (
        <Tag
          onClick={() => onClick(id)}
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

export default OrderDtailForm;