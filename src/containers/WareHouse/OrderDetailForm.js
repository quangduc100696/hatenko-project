import { Col, Form, Image, Input, InputNumber, Row, Select, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import { PhoneOutlined, MailOutlined, UserAddOutlined, FacebookOutlined, AimOutlined, SearchOutlined } from '@ant-design/icons';
import RequestUtils from 'utils/RequestUtils';
import { InAppEvent } from 'utils/FuseUtils';
import { GATEWAY, HASH_MODAL_CLOSE } from 'configs';
import { arrayEmpty, f5List, formatMoney } from 'utils/dataUtils';
import CustomButton from 'components/CustomButton';
import { debounce } from 'lodash';
import { DISCOUNT_UNIT_CONST } from 'configs/localData';
import { ContainerSerchSp } from 'containers/Lead/styles';
import FormSelect from 'components/form/FormSelect';
import FormSelectAPI from 'components/form/FormSelectAPI';
import useGetMe from 'hooks/useGetMe';
import { formatterInputNumber, parserInputNumber } from 'utils/tools';

const thStyle = {
  padding: "8px 12px",
  borderBottom: "2px solid #ddd",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "8px 12px",
  borderBottom: "1px solid #ddd",
};

const OrderDetailForm = ({title, data}) => {

  const { user: profile } = useGetMe();
  const [form] = Form.useForm();
  const [textSearch, setTextSearch] = useState('');
  const [filterSp, setFilterSp] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const [listSp, setListSp] = useState(data?.items || []);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [listProvince, setListProvince] = useState([]);
  const [dtProvider, setDtProvider] = useState({});
  const [listWareHouse, setListWareHose] = useState([]);
  const [dtWarehose, setDtWarehose] = useState({});
  const [feeout, setFee] = useState(null);

  const newSp = (data) => {
    if(title === 'Chi tiết kho') {
      let result = [];
      for (const item of data) {
        const newData = listProduct?.filter(f => f?.id === item?.productId);
        const mergedData = newData.map((v, i) => ({
          ...v,
          discountValue: item.value?.discountValue,
          discountUnit: item.value?.discountUnit,
          skuId: item?.skuId,
          price: item?.price,
          priceRef: item?.priceRef || v?.priceRef,
          quantity: item?.quantity || v?.quantity,
          providerId: item?.providerId,
          key: i
        }));
        result.push(mergedData);
      }
      return result.flat();
    } else {
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
  };

  let totalPrice = newSp(listSp).reduce((sum, item) => sum + item?.priceRef, 0);
  let totalQuanlity = newSp(listSp)?.reduce((sum, item) => sum + item?.quantity, 0);
  let total = newSp(listSp)?.reduce((sum, item) => sum + item?.priceRef * item?.quantity, 0);
  useEffect(() => {
    (async () => {
      const [product, province, warhouse] = await Promise.all([
        await RequestUtils.Get(`/product/fetch`),
        await RequestUtils.Get(`/provider/fetch?page=${page}&limit=${limit}`),
        await RequestUtils.Get(`/warehouse/fetch-stock`)
      ])
      setListProduct(product?.data?.embedded);
      setListProvince(province?.data?.embedded);
      setListWareHose(warhouse?.data)
    })()
  }, [])

  useEffect(() => {
    if(data) {
      const detailProvince = listProvince?.find(f => f?.id === data?.providerId);
      const detailWarehoseId = listWareHouse?.find(f => f?.id === data?.stockId);
      setDtProvider(detailProvince);   
      setDtWarehose(detailWarehoseId);
      form.setFieldsValue({ providerId: data?.providerId, warehouseId: data?.stockId, name: data?.status}); 
    }
  },[data, listProvince, listWareHouse])

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
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (record) => {
        return (
          <Image
            width={70}
            src={`${record ? `${GATEWAY}${record}` : '/img/image_not_found.png'}`}
            alt='image'
          />
        )
      },
    },
    {
      title: 'Đơn vi tính',
      dataIndex: 'unit',
      key: 'unit',
      render: (record) => {
        return record || "N/A";
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
            formatter={formatterInputNumber}
            parser={parserInputNumber}
            value={item.priceRef}
            onChange={(value) => {
              const newData = (title === 'Chi tiết kho' ? newSp(listSp) : listSp).map(f => {  
                if(title === 'Chi tiết kho') {
                  if (f.id === item.id) {
                    return {
                      ...f, // Sao chép toàn bộ object để tránh tham chiếu
                      priceRef: f?.id === item.id ? value : null,
                      productId: item?.id
                    };
                  }
                } else {
                  if (f.value?.id === item.id) {
                    return {
                      ...f, // Sao chép toàn bộ object để tránh tham chiếu
                      value: f?.value?.id === item.id ? { ...f?.value, priceRef: value } : f?.value
                    };
                  }
                }
              });
              setListSp(newData)          
            }}
          />
        )
      }
    },
    {
      title: 'Số lượng',
      render: (item) => {
        return (
          <InputNumber
            min={1}
            value={item?.quantity}
            onChange={(value) => {
              const newData = (title === 'Chi tiết kho' ? newSp(listSp) : listSp).map(f => {  
                if(title === 'Chi tiết kho') {
                  if (f.id === item.id) {
                    return {
                      ...f, // Sao chép toàn bộ object để tránh tham chiếu
                      quantity: f?.id === item.id ? value : null,
                      productId: item?.id
                    };
                  }
                } else {
                  if (f.value?.id === item.id) {
                    return {
                      ...f, // Sao chép toàn bộ object để tránh tham chiếu
                      value: f?.value?.id === item.id ? { ...f?.value, quantity: value } : f?.value
                    };
                  }
                }
              });
              setListSp(newData);  
            }}
          />
        )
      }
    },
    {
      title: 'Thành tiền',
      render: (item) => {

        const discount = item;
        const totalAmount = item?.priceRef * item?.quantity || 0;
        const discountValue = discount?.discountUnit === "percent"
          ? (totalAmount * discount?.discountValue) / 100
          : discount?.discountValue;
        let total = item?.priceRef * item?.quantity
        return (
          <div>
            {formatMoney(total)}
          </div>
        );
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

  const onHandleDeleteSp = (record) => {
    const items = listSp?.filter(f => f?.value?.id !== record?.id);
    setListSp(items)
  }

  const onHandleCreateOdder = async (value) => {
    if (arrayEmpty(newSp(listSp))) {
      return InAppEvent.normalInfo("Vui lòng thêm sản phẩm");
    }

    const producs = newSp(listSp)?.map(item => {
      return {
        providerId: item?.providerId,
        productId: item?.id,
        productName: item?.name,
        skuId: item?.skuId,
        skuInfo: JSON.stringify(item?.skus.map(item => item?.skuDetail)),
        quantity: item?.quantity,
        price: item?.price,
        fee: item?.price * item?.quantity,
      }
    })
    const tongdon = newSp(listSp).reduce((total, item) => total + (item.price * item.quantity), 0);

    const params = {
      id: data?.id || null,
      userName: profile?.fullName,
      status: value?.name,
      stockId: value?.warehouseId,
      providerId: value?.providerId,
      items: producs,
      fee: feeout ? feeout : tongdon
    }
    const datas = title === 'Chi tiết kho' ? await RequestUtils.Post('/warehouse-history/updated', params) : await RequestUtils.Post('/warehouse-history/created', params);
    if (datas?.errorCode === 200) {
      InAppEvent.emit(HASH_MODAL_CLOSE);
      f5List('warehouse-history/fetch');
      InAppEvent.normalSuccess( title === 'Chi tiết kho' ? "Cập nhật thành công" : "Tạo kho thành công");
    } else {
      InAppEvent.normalError("Tạo kho thất bại");
    }
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

  // Hàm onHandleCreateSp
  const onHandleCreateSp = (value) => {
    const checkIdSp = listSp.some(v => v?.value?.id === value?.id);
    if (checkIdSp) {
      InAppEvent.normalInfo("Sản phẩm này đã có trong danh sách ?");
      return;
    }
    setListSp((pre = []) => [
      ...pre,
      { value: { ...value, skus: Array(value?.skus[0]), skusCoppy: value?.skus }, detail: [] } // Bọc trong dấu `{}` để tạo object
    ]);
    InAppEvent.normalSuccess("Thêm sản phẩm thành công");
    setFilterSp([]);
    setTextSearch('');
  };

  const onHandleProvider = (id) => {
    const detailPrivider = listProvince.find(f => f.id === id);
    setDtProvider(detailPrivider);
  }
  const onHandleWareHose = (id) => {
    const detailWareHose = listWareHouse.find(f => f.id === id);
    setDtWarehose(detailWareHose);
  }

  const onHandleFee = (fee) => {
    setFee(fee)
  }

  return (
    <div style={{ marginTop: 15 }}>
      <Form form={form} onFinish={onHandleCreateOdder} layout="vertical" >
        <Row gutter={[16, 16]}>
          <Col xl={14}>
            <div style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', padding: 10, borderRadius: 3, minHeight: 220 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontWeight: 700, margin: 0, padding: 0 }}>Thông tin nhà cung cấp</p>
                <div style={{ margin: 0, padding: 0 }}>
                  <FormSelect
                    required
                    name="providerId"
                    label=""
                    placeholder="Nhà cung cấp"
                    resourceData={listProvince || []}
                    valueProp="id"
                    onChange={onHandleProvider}
                    titleProp="name"
                  />
                </div>
              </div>
              <div class="group-inan" style={{ background: '#f4f4f4', borderTop: '1px dashed red' }}></div>
              <br />
              <div style={{ paddingBottom: 5 }}><span style={{ color: '#b5acae', fontWeight: 500, paddingRight: 10 }}>Tên NCC:</span> {dtProvider?.name || 'N/A'}</div>
              <div style={{ paddingBottom: 10 }}><span style={{ color: '#b5acae', fontWeight: 500, paddingRight: 20 }}>Địa chỉ:</span> {dtProvider?.address || 'N/A'}</div>
              <div style={{ paddingBottom: 10 }}><span style={{ color: '#b5acae', fontWeight: 500, paddingRight: 20 }}>Liên hệ:</span> {dtProvider?.phoneContact || 'N/A'}</div>
              <div style={{ paddingBottom: 10 }}><span style={{ color: '#b5acae', fontWeight: 500, paddingRight: 20 }}>Đại diện:</span> {dtProvider?.representative || 'N/A'}</div>
            </div>
          </Col>
          <Col xl={10}>
            <div style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', padding: 10, borderRadius: 3, minHeight: 220 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontWeight: 700, margin: 0, padding: 0 }}>Thông tin kho</p>
                <div style={{ margin: 0, padding: 0 }}>
                  <FormSelect
                    required
                    name="warehouseId"
                    label=""
                    placeholder="Kho"
                    resourceData={listWareHouse || []}
                    valueProp="id"
                    onChange={onHandleWareHose}
                    titleProp="name"
                  />
                </div>
              </div>
              <div class="group-inan" style={{ background: '#f4f4f4', borderTop: '1px dashed red' }}></div>
              <br />
              <div style={{ paddingBottom: 5 }}><span style={{ color: '#b5acae', fontWeight: 500, paddingRight: 34 }}>Tên:</span>
                <span>{profile?.fullName || 'N/A'}</span>
              </div>
              <div style={{ paddingBottom: 5 }}><span style={{ color: '#b5acae', fontWeight: 500, paddingRight: 8 }}>Tên kho:</span>
                <span>{dtWarehose?.name || 'N/A'}</span>
              </div>
              <div style={{ paddingBottom: 10 }}><span style={{ color: '#b5acae', fontWeight: 500, paddingRight: 14 }}>Địa chỉ:</span>
                <span>{dtWarehose?.address || 'N/A'}</span>
              </div>
              <div style={{ paddingBottom: 10 }}><span style={{ color: '#b5acae', fontWeight: 500, paddingRight: 30 }}>SĐT:</span>
                <span>{dtWarehose?.mobile || 'N/A'}</span>
              </div>
            </div>
          </Col>
        </Row>
        <div style={{ height: 15 }}></div>
        <div style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', padding: 10, borderRadius: 3, marginTop: 10 }}>
          <p>
            <strong>Thông tin sản phẩm</strong>
          </p>
          <div class="group-inan" style={{ background: '#f4f4f4', marginTop: 10, marginBottom: 20, borderTop: '1px dashed red' }}></div>

          <div style={{ position: 'relative', width: '100%' }}>
            <Row gutter={[16, 16]} justify={'end'}>
              <Col xl={6}>
                <FormSelectAPI
                  required
                  apiPath='warehouse-history/fetch-status'
                  apiAddNewItem='warehouse-history/created-status'
                  onData={(data) => data ?? []}
                  label="Trạng thái"
                  name="name"
                  placeholder="Trạng thái"
                />
              </Col>
              {title !== 'Chi tiết kho' && (
                <Col xl={6}>
                  <b><label>Sản phẩm</label></b>
                  <Input
                    prefix={<SearchOutlined />}
                    style={{ marginTop: 8 }}
                    value={textSearch}
                    placeholder="Thêm sản phẩm vào đơn"
                    onChange={handleChange}
                  />
                </Col>
              )}
            </Row>
            {filterSp.length > 0 && (
              <ContainerSerchSp>
                {filterSp.map((item) => (
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
                          Tồn kho: {item.stock || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </ContainerSerchSp>
            )}
          </div>
          <Table
            columns={columns}
            scroll={{ x: 1700 }}
            dataSource={newSp(listSp)}
            expandable={{
              expandedRowRender: (record) => (
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
              ),
            }}
            pagination={false}
          />
        </div>
        <div class="group-inan" style={{ background: '#f4f4f4', marginTop: 10, marginBottom: 20, borderTop: '1px dashed red' }}></div>
        <Row justify={'end'}>
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
              <InputNumber
                min={1}
                formatter={formatterInputNumber}
                parser={parserInputNumber}
                placeholder='Tổng tiền sau nhập'
                onChange={onHandleFee}
              />
            </p>
          </Col>
        </Row>
        <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 50 }}>
          <CustomButton title={title === 'Chi tiết kho' ? 'Cập nhật' : "Tạo kho"} htmlType="submit" />
        </div>
      </Form>
    </div>
  )
}

export default OrderDetailForm
