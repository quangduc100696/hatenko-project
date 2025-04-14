import { Button, Col, Form, Image, InputNumber, Row, Select, Table } from 'antd'
import FormDatePicker from 'components/form/FormDatePicker';
import FormInput from 'components/form/FormInput';
import FormInputNumber from 'components/form/FormInputNumber';
import FormSelect from 'components/form/FormSelect';
import { GATEWAY, HASH_MODAL_CLOSE } from 'configs';
import React, { useEffect, useState } from 'react'
import { arrayEmpty, arrayNotEmpty, f5List, formatMoney, formatTime } from 'utils/dataUtils'
import { InAppEvent } from 'utils/FuseUtils';
import RequestUtils from 'utils/RequestUtils';
import { useOrderContext } from './OrderContext';
import { formatterInputNumber, parserInputNumber } from 'utils/tools';
import { DISCOUNT_UNIT_CONST } from 'configs/localData';

const columnss = [
  {
    title: 'Mã đơn hàng',
    render: (item) => {
      return (
        <div>
          {item?.code}
        </div>
      )
    }
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

const OptionPrice = [{ title: 'Tiền mặt', name: 'tienmat' }, { title: 'MoMo', name: 'momo' }, { title: 'VNpay', name: 'vnpay' }]

const OrderPayment = ({ data, title }) => {

  const [form] = Form.useForm();
  const [itemOrder, setItemOrder] = useState([]);
  // const [customer, setCustomer] = useState({});
  const { listSp, customer, setListSp, setCustomer } = useOrderContext();
  // const [listSp, setListSp] = useState(data?.details || []);
  const [vat, setVat] = useState(data?.vat);
  const [total, setTotal] = useState(data?.total);
  const [discount, setDisCount] = useState(null);
  const [listProduct, setListProduct] = useState([]);
  const [discountType, setDiscountType] = useState(null);
  console.log('customer', customer);
  
  const newSp = (datas) => {
    if (title === 'Tạo mới đơn hàng') {
      const mergedData = datas.map((item, i) => ({
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
      const newData = datas.map((item, i) => {
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

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => {
        return record?.name;
      },
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'code',
      key: 'code',
      render: (_, record) => {
        return record?.code;
      },
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (_, record) => {
        return (
          <Image
            width={70}
            src={`${GATEWAY}${record?.image}` || '/img/image_not_found.png'}
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
        return record?.unit;
      },
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
              onChange={(value) => {
                setDisCount(value)
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
                setDiscountType(value)
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
        setTotal(total)
        return (
          <div>
            {formatMoney(Math.max(total, 0))}
            {/* Đảm bảo không bị giá trị âm */}
          </div>
        );
      }
    }
  ];

  useEffect(() => {
    (async () => {
      if (data?.id) {
        const items = await RequestUtils.Get(`/pay/list-by-order-id?orderId=${data?.id}`);
        setItemOrder(items?.data)
      }
    })()
  }, [data])

  useEffect(() => {
    (async () => {
      if (data?.customerMobilePhone) {
        const customer = await RequestUtils.Get(`/customer/find-by-phone?phone=${data?.customerMobilePhone}&withOrder=withOrder`);
        setCustomer(customer?.data);
      }
      const listProduct = await RequestUtils.Get(`/product/fetch`);
      setListProduct(listProduct?.data?.embedded);
    })()
  }, [])

  const onHandleVat = (vat) => setVat(vat);

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
    const onHandleParams = () => {
      if (title === 'Tạo mới đơn hàng') {
        const newItem = (() => {
          const mergedItems = [];

          newSp(listSp)?.forEach(item => {
            const skuDetails = item?.skus?.map(sku => sku?.skuDetail).flat();
            const newTonkho = listProduct.flatMap(f => f.warehouses || []).find(v => v.skuId === item?.skuId);
            mergedItems.push({
              productId: item?.id,
              skuInfo: JSON.stringify(skuDetails),
              name: item?.productName,
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
            amount: value?.monneyPrice,
            method: value?.optionPrice,
            status: value?.monneyPrice && value?.optionPrice ? true : false,
            content: value?.noteMonney
          },
          note: value?.noteMonney,
          address: value?.noteMonney,
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
        return params
      } else {
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
        return params
      }
    }
    const datas = title === 'Tạo mới đơn hàng' ? await RequestUtils.Post('/customer-order/sale-create-co-hoi', onHandleParams()) : await RequestUtils.Post('/customer-order/update-cohoi', onHandleParams());
    if (datas?.errorCode === 200) {
      f5List('order/fetch');
      InAppEvent.emit(HASH_MODAL_CLOSE);
      InAppEvent.normalSuccess("Thanh toán thành công");
    } else {
      InAppEvent.normalError("Tạo đơn hàng thất bại");
    }
  }

  return (
    <div style={{ padding: 15 }}>
      <p>Thanh toán đơn hàng</p>
      <Table
        columns={title === 'Chi tiết đơn hàng #' ? columnss : columns}
        scroll={{ x: 700 }}
        dataSource={arrayNotEmpty(itemOrder) ? itemOrder : newSp(listSp)}
        pagination={false}
      />
      <div style={{ border: '0.5px dashed red', marginTop: 30 }} />
      <Row style={{ marginTop: 20 }}>
        <Col md={12} xs={12}>
          <p>
            <span style={{ marginRight: 10 }}>Tổng chi phí: {formatMoney(total || 0)}</span>
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
            <span style={{ marginRight: 10 }}>Chiết khấu: {discountType === 'money' ? `${formatMoney(discount)}` : `${discount} %`}</span>
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
  )
}

export default OrderPayment
