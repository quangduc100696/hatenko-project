import React, { useCallback, useEffect, useState } from 'react';
import { Col, Form, Input, Row, Table, InputNumber, Image, Select } from 'antd';
import { PhoneOutlined, MailOutlined, FacebookOutlined, AimOutlined } from '@ant-design/icons';
import { debounce } from "lodash";
import { SearchOutlined } from '@ant-design/icons';
import FormSelect from 'components/form/FormSelect';
import FormInputNumber from 'components/form/FormInputNumber';
import { DISCOUNT_UNIT_CONST } from 'configs/localData';
import FormTextArea from 'components/form/FormTextArea';
import { calPriceOff, formatterInputNumber, parserInputNumber } from 'utils/tools';
import { arrayEmpty, arrayNotEmpty, f5List, formatMoney } from 'utils/dataUtils';
import CustomButton from 'components/CustomButton';
import RequestUtils from 'utils/RequestUtils';
import { ContainerSerchSp, ModaleCreateCohoiStyle } from './styles';
import { InAppEvent } from 'utils/FuseUtils';
import { HASH_MODAL_CLOSE, GATEWAY } from 'configs';
import FormInput from 'components/form/FormInput';
import FormDatePicker from 'components/form/FormDatePicker';

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
}

const thStyle = {
  padding: "8px 12px",
  borderBottom: "2px solid #ddd",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "8px 12px",
  borderBottom: "1px solid #ddd",
};

const OptionPrice = [{ title: 'Tiền mặt', name: 'tienmat' }, { title: 'MoMo', name: 'momo' }, { title: 'VNpay', name: 'vnpay' }]

const FormBase = ({ setDetailSp, detailCohoi, setDetailCohoi, detailSp, setTotal, data }) => {
 
  const [ priceSp ] = useState(null);
  const [ form ] = Form.useForm();
  const [ FormQuanlity ] = Form.useForm();
  const [ customer, setCustomer ] = useState({});
  const [ listSp, setListSp ] = useState([]);
  const [ recordetail ] = useState({});
  const [ itemOrder, setItemOrder ] = useState([]);
  const [ onOpen, setOnOpen ] = useState(false);
  const [ listProduct, setListProduct ] = useState([]);
  const [ filterSp, setFilterSp ] = useState([]);
  const [ textSearch, setTextSearch ] = useState('');

  let totalAmount = itemOrder?.reduce((sum, item) => sum + item?.amount, 0);
  let totalPrice = newSp(listSp)?.reduce((sum, item) => sum + item.price, 0);
  let totalQuanlity = newSp(listSp)?.reduce((sum, item) => sum + item.quantity, 0);
  let total = newSp(listSp)?.reduce((sum, item) => {
    let discount = 0;
    if (item?.discountUnit === "percent") {
      discount = (item?.price * item?.quantity) * (item?.discountValue / 100);
    } else if (item?.discountUnit === "amount") {
      discount = item?.discountValue;
    }
    return sum + (item?.price * item?.quantity - discount);
  }, 0);

  useEffect(() => {
    if (recordetail) {
      FormQuanlity.setFieldsValue({ quantity: recordetail?.quantity })
    }
  }, [recordetail, FormQuanlity])

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
      const customer = await RequestUtils.Get(`/customer/find-by-phone?phone=${data?.customerMobile}&withOrder=withOrder`);
      setCustomer(customer?.data);
    })()
  }, [data])

  useEffect(() => {
    (async () => {
      const items = await RequestUtils.Get(`/pay/list-by-order-id?orderId=${data?.id}`);
      setItemOrder(items?.data)
    })()
  }, [data])

  useEffect(() => {
    (async () => {
      const { data } = await RequestUtils.Get(`/product/fetch`);
      setListProduct(data?.embedded);
    })()
  }, [])

  const onHandleDeleteSp = (record) => {
    const newItem = listSp?.filter(f => f?.value.id !== record.id);
    setListSp(newItem)
  }

  const columns = [
    {
      title: 'Sản phẩm',
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
    {
      title: 'SKU',
      render: (item) => {
        return (
          <div>
            <Select
              style={{width: 200}}
              value={item?.skus[0]?.name}
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
          <InputNumber
            min={1}
            value={item.price}
            formatter={formatterInputNumber}
            parser={parserInputNumber}
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
        );
      }
    },
    {
      title: 'Số lượng',
      render: (item) => (
        <InputNumber
          min={1}
          style={{ width: 80 }}
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
    },
    {
      title: 'Chiết khấu',
      render: (item) => {
        return (
          <div>
            <InputNumber
              min={0}
              style={{ width: 70 }}
              value={item.discountValue}
              onChange={(value) => {
                const newData = listSp.map(f => {
                  if (f.value?.id === item.id) {
                    return {
                      ...f,
                      detail: { ...f.detail },
                      value: {
                        ...f.value,
                        discountValue: value,
                        discountUnit: f.value?.discountUnit || "money" // Đặt mặc định là "money" nếu chưa có
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
      title: 'Loại chiết khấu',
      render: (item) => {
        if (!item?.discountUnit) {
          item.discountUnit = 'money'; // Đặt giá trị mặc định nếu chưa có
        }
        
        return (
          <div>
            <Select
              value={item.discountUnit}
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
        return (
          <div>
            {formatMoney(
              (() => {
                const totalPrice = item?.price * item?.quantity;
                if (item?.discountUnit === "money") {
                  return Math.max(totalPrice - Number(item?.discountValue), 0); // Đảm bảo không âm
                }
                if (item?.discountUnit === "percent") {
                  return Math.max(totalPrice * (1 - Number(item?.discountValue) / 100), 0);
                }
                return totalPrice;
              })()
            )}
          </div>
        )
      }
    },
    {
      title: 'Kho',
      dataIndex: 'Kho',
      key: 'Kho',
      render: (item) => {
        return (
          <div>
            N/A
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
          <a href='/#' onClick={() => onHandleDeleteSp(record)}>
            Xoá sản phẩm
          </a>
        </div>
      ),
    },
  ];

  const onHandleCreateSp = (value) => {
    const checkIdSp = listSp.some(v => v?.value?.id === value?.id);
    if(checkIdSp) {
      InAppEvent.normalInfo("Sản phẩm này đã có trong danh sách ?");
      return ;
    }
    setListSp((pre = []) => [
      ...pre,
      { value: { ...value, skus: Array(value?.skus[0]), skusCoppy: value?.skus}, detail: detailSp } // Bọc trong dấu `{}` để tạo object
    ]);
    InAppEvent.normalSuccess("Tạo sản phẩm thành công");
    form.resetFields();
    setTextSearch('');
    setFilterSp([])
  }

  const onHandleCreateOdder = async (value) => {
    if (arrayEmpty(newSp(listSp))) {
      return InAppEvent.normalInfo("Vui lòng thêm sản phẩm");
    }
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
        content: value?.noteMonney,
        status: value?.monneyPrice && value?.optionPrice ? true : false,
      },
      note: value?.note,
      address: value?.address,
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
    if (datas?.errorCode === 200) {
      InAppEvent.emit(HASH_MODAL_CLOSE);
      f5List('data/lists');
      InAppEvent.normalSuccess("Tạo cơ hội thành công");
    } else {
      InAppEvent.normalError("Tạo cơ hội thất bại");
    }
  }

  const onHandleSearchSp = useCallback(() => {
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
  }, [listProduct]);

  const handleChange = (e) => {
    setTextSearch(e.target.value)
    onHandleSearchSp(e.target.value);
  };

  return (
    <div style={{ marginTop: 15 }} layout="">
      <p><strong>Thông tin khách hàng</strong></p>
      <div class="group-inan" style={{ background: '#f4f4f4', borderTop: '1px dashed red' }}></div>
      <Row style={{ marginTop: 20 }}>
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
      <div style={{ position: 'relative', width: '100%' }}>
        <div>
          <Input
            style={{ width: '30%', float: 'right', marginBottom: 20 }}
            prefix={<SearchOutlined />}
            value={textSearch}
            placeholder="Thêm sản phẩm vào đơn"
            onChange={handleChange}
          />
        </div>

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

      <Form onFinish={onHandleCreateOdder} layout="vertical">
        <Table
          columns={columns}
          scroll={{ x: 1700 }}
          expandable={{
            expandedRowRender: (record) => {
              const newTonkho = listProduct.flatMap(f => f.warehouses || []).find(v => v.skuId === record?.skuId);
              return (
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
              <strong> Số lượng tổng: {totalQuanlity} đơn</strong>
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
              <strong>Giá trị triết khấu </strong>
            </p>
          </Col>
        </Row>
        <div style={{ marginTop: 20, marginBottom: 30, display: 'flex', justifyContent: 'end', gap: 15 }}>
          {/* <Button color="primary" style={{height: 30, marginTop: 2}} 
            variant="dashed" size='small'
            onClick={() => setOnOpen(true)}
            >
            Thanh toán
          </Button> */}
          <CustomButton title="Tạo đơn" htmlType="submit" />
        </div>
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
            columns={columns}
            scroll={{ x: 1700 }}
            dataSource={itemOrder || []}
            pagination={false}
          />
          <div style={{ border: '0.5px dashed red', marginTop: 30 }} />
          <Row style={{ marginTop: 20 }}>
            <Col md={12} xs={12}>
              <p>
                <span style={{ marginRight: 10 }}>Tổng chi phí: {formatMoney(totalAmount)}</span>
              </p>
            </Col>
            <Col md={12} xs={12}>
              <p>
                <span style={{ marginRight: 10 }}>Phí vận chuyển:</span>
              </p>
            </Col>
            <Col md={12} xs={12}>
              <p>
                <span style={{ marginRight: 10 }}>Đã thanh toán:</span>
              </p>
            </Col>
            <Col md={12} xs={12}>
              <p>
                <span style={{ marginRight: 10 }}>Triết khấu:</span>
              </p>
            </Col>
            <Col md={12} xs={12}>
              <p>
                <span style={{ marginRight: 10 }}>Vat:</span>
              </p>
            </Col>
            <Col md={12} xs={12}>
              <p>
                <span style={{ marginRight: 10 }}>Hoá đơn thanh toán: </span>
              </p>
            </Col>
          </Row>
          <div style={{ border: '0.5px dashed red', marginTop: 30 }} />
          <Form form={form} layout="vertical" onFinish={onHandleCreateSp}>
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
                {/* <FormInput
                  required={false}
                  label="Ngày thanh toán"
                  name="datePrice"
                  placeholder={"Ngày thanh toán"}
                /> */}
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
                <CustomButton htmlType="submit" />
              </Col>
            </Row>
          </Form>
        </div>
      </ModaleCreateCohoiStyle>
    </div>
  )
}

export default FormBase
