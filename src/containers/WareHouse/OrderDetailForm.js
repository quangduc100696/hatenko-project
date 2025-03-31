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
};

const thStyle = {
  padding: "8px 12px",
  borderBottom: "2px solid #ddd",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "8px 12px",
  borderBottom: "1px solid #ddd",
};

const OrderDetailForm = () => {

  const [form] = Form.useForm();
  const [customer, setCustomer] = useState(null);
  const [isCheckForm, setIsCheckForm] = useState(false);
  const [textSearch, setTextSearch] = useState('');
  const [filterSp, setFilterSp] = useState([]);
  const [textSearchPhone, setTextSearchPhone] = useState('');
  const [listProduct, setListProduct] = useState([]);
  const [listSp, setListSp] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [listProvince, setListProvince] = useState([]);

  const [formData, setFormData] = useState({
    gender: "",
    name: "",
    phone: "",
    email: "",
  });

  let totalPrice = newSp(listSp).reduce((sum, item) => sum + item?.price, 0);
  let totalQuanlity = newSp(listSp)?.reduce((sum, item) => sum + item?.quantity, 0);
  let total = newSp(listSp)?.reduce((sum, item) => sum + item?.price * item?.quantity, 0);

  useEffect(() => {
    (async () => {
      const [product, province] = await Promise.all([
        await RequestUtils.Get(`/product/fetch`),
        await RequestUtils.Get(`/provider/fetch?page=${page}&limit=${limit}`)
      ])
      setListProduct(product?.data?.embedded);
      setListProvince(province?.data?.embedded);
    })()
  }, [])

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
      render: (item) => <span>{formatMoney(item?.price)}</span>
    },
    {
      title: 'Số lượng',
      render: (item) => {

        return (
          <InputNumber
            min={1}
            value={item?.quantity}
            onChange={(value) => {
              const newData = listSp?.map(f => ({
                ...f,
                value: f?.value?.id === item.id ? { ...f?.value, quantity: value } : f?.value
              }));
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
              value={item?.discountValue} // Hiển thị đúng giá trị hiện tại
              onChange={(value) => {
                const newData = listSp.map(f => {
                  if (f.value?.id === item.id) {
                    return {
                      ...f, // Sao chép toàn bộ object để tránh tham chiếu
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
        )
      }
    },
    {
      title: 'Loại chiết khấu',
      render: (item) => {

        return (
          <div>
            <Select
              value={item?.discountUnit}
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
      title: 'Thành tiền',
      render: (item) => {
        const discount = item;
        const totalAmount = item?.price * item?.quantity || 0;
        const discountValue = discount?.discountUnit === "percent"
          ? (totalAmount * discount?.discountValue) / 100
          : discount?.discountValue;

        let total = item?.price * item?.quantity - discountValue;

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

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Cập nhật giá trị cho input tương ứng
    }));
  };

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

  const onHandleSearchNumber = async (e) => {
    setTextSearchPhone(e.target.value);
  }

  const onHandleCreateOdder = async (value) => {
    if (arrayEmpty(newSp(listSp))) {
      return InAppEvent.normalInfo("Vui lòng thêm sản phẩm");
    }
    if (!customer?.iCustomer) {
      return InAppEvent.normalInfo("Vui lòng nhập số điện thoại thông tin khách hàng");
    }

    const producs = newSp(listSp)?.map(item => {
      return {
        providerId: item?.providerId,
        productId: item?.id,
        productName: item?.name,
        skuId: item?.skuId,
        skuInfo: item?.skus.map(item => item?.id).join(", "),
        quality: item?.quantity,
        price: item?.price,
        fee: item?.price * item?.quantity,
      }
    })
    const tongdon = newSp(listSp).reduce((total, item) => total + (item.price * item.quantity), 0);

    const params = {
      userName: customer?.iCustomer?.name || formData?.name,
      status: value?.name,
      providerId: value?.providerId,
      items: producs,
      fee: tongdon
    }

    const datas = await RequestUtils.Post('/warehouse-history/created', params);
    if (datas?.errorCode === 200) {
      InAppEvent.emit(HASH_MODAL_CLOSE);
      f5List('warehouse-history/fetch');
      InAppEvent.normalSuccess("Tạo kho thành công");
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
    form.resetFields();
    setFilterSp([]);
    setTextSearch('');
  };

  return (
    <div style={{ marginTop: 15 }}>
      <p><strong>Thông tin khách hàng</strong></p>
      <div class="group-inan" style={{ background: '#f4f4f4', borderTop: '1px dashed red' }}></div>
      {!customer ? (
        isCheckForm ? (
          <Row style={{ marginTop: 20 }} gutter={[14, 14]}>
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

        <div style={{ position: 'relative', width: '100%' }}>
          <Row gutter={[16, 16]} justify={'end'}>
            <Col xl={6}>
              <FormSelect
                required
                name="providerId"
                label="Nhà cung cấp"
                placeholder="Nhà cung cấp"
                resourceData={listProvince || []}
                valueProp="id"
                titleProp="name"
              />
            </Col>
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
              <strong>Giá trị chiết khấu </strong>
            </p>
          </Col>
        </Row>
        <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 50 }}>
          <CustomButton title="Tạo kho" htmlType="submit" />
        </div>
      </Form>
    </div>
  )
}

export default OrderDetailForm
