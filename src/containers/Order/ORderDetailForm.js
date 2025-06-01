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

import { useCallback, useContext, useEffect, useState } from "react";
import { Tag, Form, Row, Col, Button, Table, InputNumber, Input, Image, Select } from "antd";
import { FormContextCustom } from "components/context/FormContextCustom";
import { PhoneOutlined, MailOutlined, UserAddOutlined, FacebookOutlined, AimOutlined, SearchOutlined } from '@ant-design/icons';
import FormInputNumber from "components/form/FormInputNumber";
import FormSelect from "components/form/FormSelect";
import { DISCOUNT_UNIT_CONST } from "configs/localData";

import { arrayEmpty, arrayNotEmpty, f5List, formatMoney, formatTime } from "utils/dataUtils";
import CustomButton from 'components/CustomButton';
import FormTextArea from "components/form/FormTextArea";
import { calPriceOff, formatterInputNumber, parserInputNumber } from "utils/tools";
import { useMount } from "hooks/MyHooks";
import { generateInForm } from "../Order/utils";
import { cloneDeep, debounce } from "lodash";
import RequestUtils from "utils/RequestUtils";
import { InAppEvent } from "utils/FuseUtils";
import { GATEWAY, HASH_MODAL_CLOSE } from "configs";
import { ContainerSerchSp, ModaleCreateCohoiStyle } from "containers/Lead/styles";
import FormInput from "components/form/FormInput";
import FormDatePicker from "components/form/FormDatePicker";
import { useOrderContext } from "./OrderContext";


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

const columnss = [
  {
    title: 'Mã đơn hàng',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: 'Nội dung',
    dataIndex: 'content',
    key: 'content',
  },
  {
    title: 'Thời gian thanh toán',
    render: (item) => {
      return (
        <div>
          {formatTime(item?.confirmTime)}
        </div>
      )
    }
  },
  {
    title: 'Phương thức thanh toán',
    dataIndex: 'method',
    key: 'method',
  },
  {
    title: 'Số tiền',
    render: (item) => {
      return (
        <div>
          {formatMoney(item?.amount)}
        </div>
      )
    }
  }
];

const OrderDtailForm = ({ data, title }) => {

  const { listSp, customer, setListSp, setCustomer } = useOrderContext();
  const { record, updateRecord } = useContext(FormContextCustom);
  const [detailSp, setDetailSp] = useState([])
  const [priceSp, setPriceSp] = useState(null);
  const [form] = Form.useForm();
  const [FormQuanlity] = Form.useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [recordetail, setRecodetail] = useState({});
  const [onOpen, setOnOpen] = useState(false);
  const [listProduct, setListProduct] = useState([]);
  const [datas, setData] = useState({})
  const [filterSp, setFilterSp] = useState([]);
  const [textSearch, setTextSearch] = useState('');
  const [textSearchPhone, setTextSearchPhone] = useState('');
  const [itemOrder, setItemOrder] = useState([]);
  const [isCheckForm, setIsCheckForm] = useState(false)
  const [productDetails, setProductDetails] = useState([]);
  const [vat, setVat] = useState(data?.vat);

  const [formData, setFormData] = useState({
    gender: "",
    name: "",
    phone: "",
    email: "",
  });

  const newSp = (data) => {
    if (title === 'Tạo mới đơn hàng') {
      const mergedData = data.map((item, i) => ({
        ...item.value,
        ...item.detail,
        key: i,
        price: item.value?.price,
        discountValue: item.value?.discountValue,
        discountUnit: item.value?.discountUnit,
        skuId: item.value?.skuId,
      }));
      return mergedData
    } else {
      const newData = data.map((item, i) => {
        const newItem = item?.items?.map((subItem) => ({
          ...subItem,
          code: item.code, // Thêm code vào từng phần tử trong mảng items
          key: i,
        }));
        return newItem; // Phải return object
      });
      return newData.flat();
    }
  };

  let totalPrice = newSp(listSp).reduce((sum, item) => sum + item?.price, 0);
  let totalQuanlity = newSp(listSp)?.reduce((sum, item) => sum + item?.quantity, 0);
  let totalAmount = itemOrder?.reduce((sum, item) => sum + item?.amount, 0);
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

  useEffect(() => {
    const productIds = data?.details
      ?.flatMap((detail) => detail.items?.map((item) => item.productId) || [])
      .filter(Boolean); // Loại bỏ giá trị null hoặc undefined
    (async () => {
      if (!Array.isArray(productIds) || productIds.length === 0) return;
      try {
        if(productIds) {
          const productDetails = await RequestUtils.Get(`/product/find-list-id?ids=${productIds.join(",")}`);
          setProductDetails(Array.isArray(productDetails?.data) ? productDetails.data : []);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    })();
  }, []);

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

  useEffect(() => {
    (async () => {
      const { data } = await RequestUtils.Get(`/product/fetch`);
      setListProduct(data?.embedded);
    })()
  }, [])

  useEffect(() => {
    (async () => {
      const items = await RequestUtils.Get(`/pay/list-by-order-id?orderId=${data?.id}`);
      setItemOrder(items?.data)
    })()
  }, [data])

  useEffect(() => {
    (() => {
      if (itemOrder?.length > 0) {
        form.setFieldsValue({ monneyPrice: totalAmount });
        form.setFieldsValue({ content: itemOrder[0]?.content })
        form.setFieldsValue({ datePrice: itemOrder[0]?.confirmTime })
      }
    })()
  }, [itemOrder, form])

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
      render: (_, record) => {
        const product = productDetails.find((p) => p.id === record.productId);
        return product?.name || record?.name;
      },
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'code',
      key: 'code',
      render: (_, record) => {
        const product = productDetails.find((p) => p.id === record.productId);
        return product?.code || record?.code;
      },
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (_, record) => {
        const product = productDetails.find((p) => p.id === record.productId);
        return (
          <Image
            width={70}
            src={`${product?.image ? `${GATEWAY}${product?.image}` : (record?.image ? `${GATEWAY}${record?.image}` : '/img/image_not_found.png')}`}
            alt='image'
          />
        )
      },
    },
    {
      title: 'Đơn vi tính',
      dataIndex: 'unit',
      key: 'unit',
      render: (_, record) => {
        const product = productDetails.find((p) => p.id === record.productId);
        return product?.unit || record?.unit;
      },
    },
    {
      title: 'SKU',
      render: (item) => {
        return (
          <div>
            <Select
              style={{ width: 200 }}
              value={!item?.skus ? '' : item?.skus[0]?.name}
              disabled={title === 'Tạo mới đơn hàng' ? false : true}
              onChange={(value) => {
                const newData = listSp.map(f => {
                  if (f.value?.id === item.id) {
                    return {
                      ...f,
                      detail: { ...f.detail },
                      value: {
                        ...f.value,
                        skus: [JSON.parse(value)]
                      }
                    };
                  }
                  return f;
                });
                setListSp(newData);
              }}
            >
              {item?.skusCoppy?.map((f, id) => (
                <Select.Option key={id} value={JSON.stringify(f)}>{f?.name}</Select.Option>
              ))}
            </Select>
          </div>
        );
      }
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
            <InputNumber
              min={0}
              style={{ width: 120 }}
              formatter={formatterInputNumber}
              parser={parserInputNumber}
              value={item.price} // Hiển thị đúng giá trị hiện tại
              disabled={title === 'Tạo mới đơn hàng' ? false : true}
              onChange={(value) => {
                const newData = listSp.map(f => {
                  if (f.value?.id === item.id) {
                    return {
                      ...f, // Sao chép toàn bộ object để tránh tham chiếu
                      detail: { ...f.detail }, // Sao chép detail để tránh thay đổi không mong muốn
                      value: {
                        ...f.value,
                        price: value
                      }
                    };
                  }
                  return f;
                });
                setListSp(newData);
              }}
            />
          </div>
        )
      }
    },
    {
      title: 'Số lượng',
      render: (item) => {
        return (
          <InputNumber
            min={0}
            style={{ width: 120 }}
            formatter={formatterInputNumber}
            parser={parserInputNumber}
            value={item.quantity} // Hiển thị đúng giá trị hiện tại
            disabled={title === 'Tạo mới đơn hàng' ? false : true}
            onChange={(value) => {
              const newData = listSp.map(f => {
                if (f.value?.id === item.id) {
                  return {
                    ...f, // Sao chép toàn bộ object để tránh tham chiếu
                    detail: { ...f.detail }, // Sao chép detail để tránh thay đổi không mong muốn
                    value: {
                      ...f.value,
                      quantity: value
                    }
                  };
                }
                return f;
              });
              setListSp(newData);
            }}
          />
        )
      }
    },
    {
      title: 'Chiết khấu',
      render: (item) => {
        return (
          <div>
            <InputNumber
              min={0}
              style={{ width: 80 }}
              formatter={formatterInputNumber}
              parser={parserInputNumber}
              value={item.discountValue} // Hiển thị đúng giá trị hiện tại
              disabled={title === 'Tạo mới đơn hàng' ? false : true}
              onChange={(value) => {
                const newData = listSp.map(f => {
                  if (f.value?.id === item.id) {
                    return {
                      ...f, // Sao chép toàn bộ object để tránh tham chiếu
                      detail: { ...f.detail }, // Sao chép detail để tránh thay đổi không mong muốn
                      value: {
                        ...f.value,
                        discountValue: value
                      }
                    };
                  }
                  return f;
                });
                setListSp(newData);
              }}
            />
          </div>
          // <div>
          //   {item?.discountUnit === "percent" ? `${item?.discountValue || 0}%` : formatMoney(item?.discountValue)}
          // </div>
        )
      }
    },
    {
      title: 'Loại chiết khấu',
      render: (item) => {
        if (!item?.discountUnit) {
          item.discountUnit = 'money'; // Đặt giá trị mặc định nếu chưa có
        }

        return (
          <div>
            <Select
              value={item.discountUnit}
              disabled={title === 'Tạo mới đơn hàng' ? false : true}
              onChange={(value) => {
                const newData = listSp.map(f => {
                  if (f.value?.id === item.id) {
                    return {
                      ...f,
                      detail: { ...f.detail },
                      value: {
                        ...f.value,
                        discountUnit: value
                      }
                    };
                  }
                  return f;
                });
                setListSp(newData);
              }}
            >
              {DISCOUNT_UNIT_CONST?.map((f, id) => (
                <Select.Option key={id} value={f?.value}>{f?.text}</Select.Option>
              ))}
            </Select>
          </div>
        );
      }
    },
    {
      title: 'Tổng tiền',
      render: (item) => {
        const discount = item?.discount ? JSON.parse(item.discount) : {}; // Xử lý nếu null hoặc undefined
        const totalAmount = (item?.price || 0) * (item?.quantity || 0); // Tránh undefined

        const discountValue = item?.discountUnit === "percent"
          ? (totalAmount * (item?.discountValue || 0)) / 100
          : (item?.discountValue || 0); // Nếu không có giá trị thì mặc định là 0 
        const total = totalAmount - discountValue;

        return (
          <div>
            {formatMoney(Math.max(total, 0))}
            {/* Đảm bảo không bị giá trị âm */}
          </div>
        );
      }
    }

  ];

  const onHandleCreateOdder = async (value) => {

    if (arrayEmpty(newSp(listSp))) {
      return InAppEvent.normalInfo("Vui lòng thêm sản phẩm");
    }
    const tongdon = newSp(listSp).reduce((total, item) => total + item.price, 0);
    const newItem = (() => {
      const mergedItems = [];

      newSp(listSp)?.forEach(item => {
        const skuDetails = item?.skus?.map(sku => sku?.skuDetail).flat();
        const newTonkho = listProduct.flatMap(f => f.warehouses || []).find(v => v.skuId === item?.skuId);
        mergedItems.push({
          productId: item?.id,
          skuInfo: JSON.stringify(skuDetails),
          name: item?.name,
          skuId: item?.skuId,
          quantity: item?.quantity,
          price: item?.price,
          inventory: newTonkho?.quantity,
          discount: JSON.stringify({ discountValue: item?.discountValue, discountUnit: item?.discountUnit })
        });
      });
      return [
        {
          productName: mergedItems?.map(f => f?.name).join(", "), // Hoặc có thể lấy từ listSp[0]?.productName nếu cần động
          items: mergedItems
        }
      ];
    })();

    const params = {
      vat: 0,
      dataId: data?.id,
      paymentInfo: {
        amount: value?.optionMonney,
        method: value?.optionPrice,
        status: value?.monneyPrice && value?.optionPrice ? true : false,
        content: value?.noteMonney
      },
      note: value?.note,
      address: value?.address,
      customer: {
        saleId: customer?.iCustomer?.saleId || null,
        gender: customer?.iCustomer?.gender || formData?.gender,
        name: customer?.iCustomer?.name || formData?.name,
        email: customer?.iCustomer?.email || formData?.email,
        mobile: customer?.iCustomer?.mobile || formData?.phone,
        createdAt: customer?.iCustomer?.createdAt || Math.floor(Date.now() / 1000),
        updatedAt: customer?.iCustomer?.updatedAt || Math.floor(Date.now() / 1000),
      },
      details: newItem
    }
    const datas = await RequestUtils.Post('/order/save', params);
    if (datas?.errorCode === 200) {
      InAppEvent.emit(HASH_MODAL_CLOSE);
      f5List('order/fetch');
      InAppEvent.normalSuccess("Tạo đơn hàng thành công");
    } else {
      InAppEvent.normalError("Tạo đơn hàng thất bại");
    }
  };

  // Hàm onHandleCreateSp
  const onHandleCreateSp = (value) => {
    const checkIdSp = listSp.some(v => v?.value?.id === value?.id);
    if (checkIdSp) {
      InAppEvent.normalInfo("Sản phẩm này đã có trong danh sách ?");
      return;
    }
    setListSp((pre = []) => [
      ...pre,
      { value: { ...value, skus: Array(value?.skus[0]), skusCoppy: value?.skus }, detail: detailSp } // Bọc trong dấu `{}` để tạo object
    ]);
    InAppEvent.normalSuccess("Thêm sản phẩm thành công");
    form.resetFields();
    setFilterSp([]);
    setTextSearch('');
    setIsOpen(false);
  };

  const onHandleSearchSp = useCallback(
    debounce((value) => {
      if (value) {
        const newFilterSp = listProduct.filter(item =>
          item.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilterSp(newFilterSp);
      } else {
        setFilterSp([]);
      }
    }, 200)
  );

  const handleChange = (e) => {
    setTextSearch(e.target.value)
    onHandleSearchSp(e.target.value);
  };

  // thanh toán
  const onHandleCreatePayment = async (value) => {
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
          discount: JSON.stringify({ discountValue: item?.discountValue, discountUnit: item?.discountUnit })
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
          discountValue: item?.discountValue ? item?.discountValue : 0,
          discountUnit: item?.discountUnit ? item?.discountUnit : 0
        }))
      });
    }
    const params = {
      vat: vat || 0,
      id: data?.id,
      dataId: data?.id,
      paymentInfo: {
        amount: value?.monneyPrice,
        method: value?.optionPrice,
        status: value?.monneyPrice && value?.optionPrice ? true : false,
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
    };
    const datas = await RequestUtils.Post('/customer-order/update-cohoi', params);
    if (datas?.errorCode === 200) {
      setOnOpen(false);
      f5List('order/fetch');
      InAppEvent.normalSuccess("Thanh toán thành công");
    } else {
      InAppEvent.normalError("Tạo đơn hàng thất bại");
    }
  }

  const onHandleSearchNumber = async (e) => {
    setTextSearchPhone(e.target.value);
  }

  const onHandleEnterSearch = async (event) => {
    const phoneRegex = /^(0\d{9,10})$/; // Chỉ cho phép số bắt đầu bằng 0, có 10 hoặc 11 chữ số
    if (event.key === "Enter") {
      if (phoneRegex.test(textSearchPhone)) {
        const customer = await RequestUtils.Get(`/customer/find-by-phone?phone=${textSearchPhone}&withOrder=withOrder`);
        setCustomer(customer?.data)
        if (!customer?.data) {
          setIsCheckForm(true)
        }
      } else {
        InAppEvent.normalInfo("Số điện thoại không đúng định dạng");
      }
    }
  }

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Cập nhật giá trị cho input tương ứng
    }));
  };

  const onHandleVat = (vat) => setVat(vat);

  return <>
    <div style={{ marginTop: 15 }}>
      <p><strong>Thông tin khách hàng</strong></p>
      <div class="group-inan" style={{ background: '#f4f4f4', borderTop: '1px dashed red' }}></div>
      {!customer ? (
        isCheckForm ? (
          <Row style={{ marginTop: 20 }} gutter={[14, 14]}>
            {/* <Col md={6} xs={6}>
              <Input
                name="gender"
                onChange={handleChanges}
                style={{ width: '100%', floodOpacity: 'right', marginBottom: 20 }}
                placeholder="Nhập giới tính"
              />
            </Col> */}
            <Col md={6} xs={6}>
              <Input
                name="name"
                onChange={handleChanges}
                style={{ width: '100%', float: 'right', marginBottom: 20 }}
                placeholder="Nhập tên"
              />
            </Col>
            <Col md={6} xs={6}>
              <Input
                name="phone"
                onChange={handleChanges}
                style={{ width: '100%', float: 'right', marginBottom: 20 }}
                placeholder="Nhập số điện thoại "
              />
            </Col>
            <Col md={6} xs={6}>
              <Input
                name="email"
                onChange={handleChanges}
                style={{ width: '100%', float: 'right', marginBottom: 20 }}
                placeholder="Nhập email"
              />
            </Col>
          </Row>
        ) : (
          <div style={{ marginTop: 20 }}>
            <Input
              style={{ width: '30%', float: 'right', marginBottom: 20 }}
              prefix={<SearchOutlined />}
              value={textSearchPhone}
              onKeyDown={onHandleEnterSearch}
              placeholder="Tìm kiếm số điện thoại thông tin khách hàng"
              onChange={onHandleSearchNumber}
            />
          </div>
        )
      ) : (
        <>
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
        </>
      )}
      <br />
      <Form onFinish={onHandleCreateOdder} layout="vertical" >
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
        <div style={{ position: 'relative', width: '100%' }}>
          {title === 'Chi tiết đơn hàng #' ? '' : (
            <div>
              <Input
                style={{ width: '30%', float: 'right', marginBottom: 20 }}
                prefix={<SearchOutlined />}
                value={textSearch}
                placeholder="Thêm sản phẩm vào đơn"
                onChange={handleChange}
              />
            </div>
          )}
          {filterSp.length > 0 && (
            <ContainerSerchSp>
              {filterSp.map((item) => {
                const totalQuantity = item?.warehouses.reduce((total, v) => total + v.quantity, 0);
                return (
                  <div key={item.id} className='wrap-search-sp'>
                    {/* Hàng chính của sản phẩm */}
                    <div
                      className='btn_hover_sp'
                      style={{ display: 'flex', alignItems: 'center', width: '100%' }}
                      onClick={() => {
                        setFilterSp(filterSp.map(f =>
                          f.id === item.id ? { ...f, showSkus: !f.showSkus } : f
                        ));
                        onHandleCreateSp({ ...item, skuId: item?.skus[0]?.id, skuName: item?.name, price: item.skus[0]?.listPriceRange[0]?.price, stock: item?.skus[0]?.stock })
                      }}
                    >
                      {/* Cột hình ảnh sản phẩm */}
                      <div className='btn_wrap-sp'>
                        <Image
                          src={item.image ? `${GATEWAY}${item.image}` : '/img/image_not_found.png'}
                          alt={item.name}
                          style={{ width: 50, height: 50, marginRight: 15, objectFit: 'cover', borderRadius: 5 }}
                        />
                      </div>

                      {/* Cột thông tin sản phẩm */}
                      <div style={{ width: '55%', paddingTop: 10, paddingLeft: 10 }}>
                        <strong>{item.name}</strong>
                      </div>

                      {/* Cột giá bán và số lượng tồn */}
                      <div style={{ width: '30%', paddingTop: 10, textAlign: 'right' }}>
                        <p style={{ marginBottom: 5, fontSize: 14, fontWeight: 'bold', color: '#d9534f' }}>
                          {formatMoney(item.skus[0]?.listPriceRange[0]?.price || 0)}
                        </p>
                        <p style={{ marginBottom: 0, fontSize: 12, color: '#5bc0de' }}>
                          Tồn kho: {totalQuantity || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}

            </ContainerSerchSp>
          )}
        </div>

        <Table
          columns={columns}
          scroll={{ x: 1700 }}
          expandable={{
            expandedRowRender: (record) => {
              const newTonkho = listProduct.flatMap(f => f.warehouses || []).find(v => v.skuId === record?.skuId);
              return (
                title === 'Tạo mới đơn hàng' ? (
                  <div style={{ padding: "10px", background: "#f9f9f9", borderRadius: "8px" }}>
                    {record.skus && record.skus.length > 0 ? (
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
                            <th style={thStyle}>Tồn kho</th>
                            <th style={thStyle}>Chi tiết</th>
                          </tr>
                        </thead>
                        <tbody>
                          {record.skus?.map((sku) => (
                            <tr key={sku?.id} style={{ borderBottom: "1px solid #ddd" }}>
                              <td style={tdStyle}>{sku?.name}</td>
                              <td style={tdStyle}>
                                {sku?.listPriceRange.map((price) => price.price.toLocaleString() + " VND").join(", ")}
                              </td>
                              <td style={tdStyle}>
                                {newTonkho?.quantity}
                              </td>
                              <td style={tdStyle}>
                                <p style={{ marginRight: "10px" }}>
                                  <strong>{sku?.skuDetail[0]?.name}:</strong> {sku?.skuDetail[0]?.value}
                                </p>
                                {sku?.skuDetail.length > 1 && <span> ...</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>Không có SKU nào</p>
                    )}
                  </div>
                ) : (
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
                            <th style={thStyle}>Tồn kho</th>
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
                                {newTonkho?.quantity}
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
              )
            },
          }}

          dataSource={newSp(listSp)}
          pagination={false}
        />
        <div class="group-inan" style={{ background: '#f4f4f4', marginTop: 10, marginBottom: 20, borderTop: '1px dashed red' }}></div>
        <Row justify={'end'}>
          <Col md={24} xs={24}>
            <FormInput
              required={false}
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
          </Col>
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
        {title === 'Tạo mới đơn hàng' ? (
          <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 50 }}>
            <CustomButton title="Tạo đơn" htmlType="submit" />
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 50 }}>
            { data?.paid === data?.total ? '' : (
                <Button onClick={() => {
                  setData(record)
                  setOnOpen(true);
                }}>Thanh toán</Button>
            )}
          </div>
        )}
      </Form>

      <ModaleCreateCohoiStyle title={
        <div style={{ color: '#fff' }}>
          Thanh toán
        </div>
      } width={820}
        open={onOpen} footer={false} onCancel={() => {
          form.resetFields();
          setOnOpen(false);
        }}>
        <div style={{ padding: 15 }}>
          <p>Thanh toán đơn hàng</p>
          <Table
            columns={columnss}
            scroll={{ x: 700 }}
            dataSource={itemOrder || []}
            pagination={false}
          />
          <div style={{ border: '0.5px dashed red', marginTop: 30 }} />
          <Row style={{ marginTop: 20 }}>
            <Col md={12} xs={12}>
              <p>
                <span style={{ marginRight: 10 }}>Tổng chi phí: {formatMoney(data?.total || 0)}</span>
              </p>
            </Col>
            <Col md={12} xs={12}>
              <p>
                <span style={{ marginRight: 10 }}>Phí vận chuyển:{formatMoney(data?.shippingCost || 0)}</span>
              </p>
            </Col>
            <Col md={12} xs={12}>
              <p>
                <span style={{ marginRight: 10 }}>Đã thanh toán: {formatMoney(data?.paid || 0)}</span>
              </p>
            </Col>
            <Col md={12} xs={12}>
              <p>
                <span style={{ marginRight: 10 }}>Chiết khấu:</span>
              </p>
            </Col>
            <Col md={12} xs={12}>
              <p>
                <span style={{ marginRight: 10 }}>Vat:
                  <Select placeholder="Chọn Vat" value={vat} style={{ width: 160, marginLeft: 5 }} onChange={onHandleVat}>
                    <Select.Option value={8}>8%</Select.Option>
                    <Select.Option value={10}>10%</Select.Option>
                  </Select>
                </span>
              </p>
            </Col>
            <Col md={12} xs={12}>
              <p>
                <span style={{ marginRight: 10 }}>Hoá đơn thanh toán: </span>
              </p>
            </Col>
          </Row>
          <div style={{ border: '0.5px dashed red', marginTop: 30 }} />
          <Form form={form} layout="vertical" onFinish={onHandleCreatePayment}>
            <Row gutter={16} style={{ marginTop: 20 }}>
              <Col md={12} xs={24}>
                <FormInputNumber
                  required={false}
                  label="Số tiền thanh toán"
                  min="0"
                  name="monneyPrice"
                  placeholder={"Số tiền thanh toán"}
                />
              </Col>
              <Col md={12} xs={24} style={{ marginTop: 28 }}>
                <FormDatePicker
                  messageRequire={''}
                  name="datePrice"
                  disabled={true}
                  format='DD/MM/YYYY'
                  placeholder={"Ngày thanh toán"}
                />
              </Col>

              <Col md={12} xs={24} style={{ width: '100%' }}>
                <FormSelect
                  required
                  name="optionPrice"
                  label="Hình thức thanh toán"
                  placeholder="Hình thức thanh toán"
                  resourceData={OptionPrice || []}
                  valueProp="name"
                  titleProp="title"
                />
              </Col>
              <Col md={12} xs={24}>
                <FormInput
                  required
                  label="Nội dung thanh toán"
                  name="noteMonney"
                  placeholder={"Nội dung thanh toán"}
                />
              </Col>
              <Col md={24} xs={24} style={{ display: 'flex', justifyContent: 'end', marginBottom: 50 }}>
                <Button htmlType="submit" >Hoàn thành</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </ModaleCreateCohoiStyle>
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