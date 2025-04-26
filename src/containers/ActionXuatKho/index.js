import { Col, Form, Image, Input, InputNumber, Row, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import CustomButton from 'components/CustomButton';
import FormInput from 'components/form/FormInput';
import FormSelectAPI from 'components/form/FormSelectAPI';
import { GATEWAY, HASH_MODAL_CLOSE } from 'configs';
import { ContainerSerchSp } from 'containers/Lead/styles';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react'
import { dateFormatOnSubmit, formatMoney } from 'utils/dataUtils';
import { InAppEvent } from 'utils/FuseUtils';
import RequestUtils from 'utils/RequestUtils';
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

const ActionXuatKho = ({ data }) => {
  const { orderWarhouse, result } = data;
  const [listProduct, setListProduct] = useState([]);
  const [listSp, setListSp] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [newOrder, setNewOrder] = useState(orderWarhouse);
  const [filterSp, setFilterSp] = useState([]);
  const [textSearch, setTextSearch] = useState('');

  useEffect(() => {
    (async () => {
      // const order = await RequestUtils.Get(`/warehouse-export/find-order-id?orderId=${result?.id}`);
      const listProduct = await RequestUtils.Get(`/product/fetch`);
      setListProduct(listProduct?.data?.embedded);
      // setDataOrder(order?.data)
    })()
  }, [data])

  useEffect(() => {
    const productIds = result?.details
      ?.flatMap((detail) => detail.items?.map((item) => item.productId) || [])
      .filter(Boolean); // Loại bỏ giá trị null hoặc undefined
    (async () => {
      if (!Array.isArray(productIds) || productIds.length === 0) return;
      try {
        if (productIds) {
          const productDetails = await RequestUtils.Get(`/product/find-list-id?ids=${productIds.join(",")}`);
          setProductDetails(Array.isArray(productDetails?.data) ? productDetails.data : []);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    })();
  }, []);

  const columns = [
    Table.EXPAND_COLUMN,
    {
      title: 'Số lần xuất kho',
      render: (record) => {
        return (
          <div>Lần {record?.stt}</div>
        )
      },
    },
    {
      title: 'Trạng thái Confirm',
      render: (record) => {
        return (
          <div>
            {record.statusConfirm === 0 ? 'Chưa Confirm' : 'Đã Confirm'}
          </div>
        )
      },
    },
    // {
    //   title: 'Hình ảnh',
    //   dataIndex: 'image',
    //   key: 'image',
    //   render: (_, record) => {
    //     const product = productDetails.find((p) => p.id === record.productId);
    //     return (
    //       <Image
    //         width={70}
    //         src={`${product?.image ? `${GATEWAY}${product?.image}` : (record?.image ? `${GATEWAY}${record?.image}` : '/img/image_not_found.png')}`}
    //         alt='image'
    //       />
    //     )
    //   },
    // },
    // {
    //   title: 'Đơn vi tính',
    //   dataIndex: 'unit',
    //   key: 'unit',
    //   render: (_, record) => {
    //     const product = productDetails.find((p) => p.id === record.productId);
    //     return (
    //       <>{`${record.quantity} ${product?.unit || record?.unit}`}</>
    //     )
    //   },
    // },
    // {
    //   title: 'Đơn giá',
    //   render: (item) => {
    //     return (
    //       <div>
    //         {formatMoney(item.price)}
    //       </div>
    //     )
    //   }
    // },
    // {
    //   title: 'Số lượng',
    //   render: (item) => {
    //     return (
    //       <>{item.quantity}</>
    //     )
    //   }
    // },
    // {
    //   title: 'Tổng tiền',
    //   render: (item) => {
    //     const discount = item?.discount ? JSON.parse(item.discount) : {}; // Xử lý nếu null hoặc undefined
    //     const totalAmount = (item?.price || 0) * (item?.quantity || 0); // Tránh undefined

    //     const discountValue = item?.discountUnit === "percent"
    //       ? (totalAmount * (item?.discountValue || 0)) / 100
    //       : (item?.discountValue || 0); // Nếu không có giá trị thì mặc định là 0 
    //     const total = totalAmount - discountValue;

    //     return (
    //       <div>
    //         {formatMoney(Math.max(total, 0))}
    //         {/* Đảm bảo không bị giá trị âm */}
    //       </div>
    //     );
    //   }
    // }

  ];

  const columnsCreate = [
    Table.EXPAND_COLUMN,
    {
      title: 'Tên sản phẩm',
      render: (record) => {
        return record?.name || "N/A";
      },
    },
    {
      title: 'Mã sản phẩm',
      render: (record) => {
        return record?.code || "N/A";
      },
    },
    {
      title: 'Hình ảnh',
      render: (record) => {
        return (
          <Image
            width={70}
            src={`${record?.image ? `${GATEWAY}${record?.image}` : '/img/image_not_found.png'}`}
            alt='image'
          />
        )
      },
    },
    {
      title: 'Đơn vi tính',
      render: (record) => {
        return record?.unit || "N/A";
      },
    },
    {
      title: 'Đơn giá',
      render: (item) => {
        return (
          <div>
            {formatMoney(item?.skus[0]?.listPriceRange[0]?.price)}
          </div>
        )
      }
    },
    // {
    //   title: 'Chiết khấu',
    //   render: (item) => {
    //     // try {
    //     const discount = JSON.parse(item?.discount)
    //     return (
    //       <div>
    //         <InputNumber
    //           min={0}
    //           style={{ width: 80 }}
    //           formatter={formatterInputNumber}
    //           parser={parserInputNumber}
    //           value={discount?.discountValue} // Hiển thị đúng giá trị hiện tại
    //           onChange={(value) => {
    //             const newData = listSp?.map(f => ({
    //               ...f,
    //               items: f?.items?.map(v =>
    //                 v?.id === item.id ? {
    //                   ...v, discount: JSON.stringify(
    //                     {
    //                       discountUnit: discount?.discountUnit,
    //                       discountValue: value
    //                     }
    //                   )
    //                 } : v
    //               )
    //             }));
    //             setListSp(newData);
    //           }}
    //         />
    //       </div>
    //     )
    //   }
    // },
    // {
    //   title: 'Loại chiết khấu',
    //   render: (item) => {
    //     const discount = JSON.parse(item?.discount)
    //     return (
    //       <div>
    //         <Select
    //           value={discount?.discountUnit}
    //           onChange={(value) => {
    //             const newData = listSp?.map(f => ({
    //               ...f,
    //               items: f?.items?.map(v =>
    //                 v?.id === item.id ? {
    //                   ...v, discount: JSON.stringify(
    //                     {
    //                       discountUnit: value,
    //                       discountValue: discount?.discountValue
    //                     }
    //                   )
    //                 } : v
    //               )
    //             }));
    //             setListSp(newData);
    //           }}
    //         >
    //           {DISCOUNT_UNIT_CONST?.map((f, id) => (
    //             <Select.Option key={id} value={f?.value}>{f?.text}</Select.Option>
    //           ))}
    //         </Select>
    //       </div>
    //     );
    //   }
    // },
    {
      title: 'Số lượng',
      render: (item) => (
        <InputNumber
          min={1}
          value={item?.quantity || 1}
          onChange={(value) => {
            const newData = listSp?.map(f => ({
              ...f,
              quantity: f?.id === item.id ? value : null,
              total: item?.skus[0]?.listPriceRange[0]?.price * (item?.quantity || 1),
            }));
            setListSp(newData);
          }}
        />
      )
    },
    {
      title: 'Tổng tiền',
      render: (item) => {
        let total = item?.skus[0]?.listPriceRange[0]?.price * (item?.quantity || 1);
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
    const newItem = listSp.filter(it => it?.id !== record?.id);
    setListSp(newItem)
  }

  const onHandleCreateOdder = async (value) => {
    // nếu có dataOrder thì dùng update còn ngược lại thì add
    if (!newOrder) {
      const newDetail = data?.details.map(v => {
        const newItems = v?.items.map(v => {
          const product = productDetails.find((p) => p.id === v.productId);
          return {
            name: product?.name || v?.name,
            productId: product?.productId || v?.productId,
            skuId: v?.skuId,
            skuInfo: v?.skuInfo,
            price: v?.price,
            quantity: v?.quantity,
            total: v?.total,
            createdAt: v?.createdAt,
            updatedAt: v?.updatedAt,
            status: v.status,
            warehouseId: v?.warehouseId
          }
        })
        return {
          createdAt: v?.createdAt,
          updatedAt: v?.updatedAt,
          items: newItems
        }
      })

      const params = {
        orderId: result?.id,
        note: value?.note,
        status: value?.name,
        details: newDetail
      }
      await RequestUtils.Post('/warehouse-export/created', params).then(data => {
        if (data?.errorCode === 200) {
          InAppEvent.emit(HASH_MODAL_CLOSE);
          InAppEvent.normalSuccess("Xuất kho thành công");
        }
      })
    } else {
      const param = {
        ...newOrder,
        status: value?.name,
      }
      const cleanedData = {
        ...param,
        items: param.items.map(({ stt, ...rest }) => rest)
      };
      await RequestUtils.Post('/warehouse-export/updated', cleanedData).then(data => {
        if (data?.errorCode === 200) {
          InAppEvent.emit(HASH_MODAL_CLOSE);
          InAppEvent.normalSuccess("Cập nhật xuất kho thành công");
        }
      })
    }
  }

  const createOrdernotFound = async (value) => {
    const newDetail = listSp.map(v => {
      const newItem = {
        name: v?.name,
        productId: v.productId,
        skuId: v.skus[0]?.id,
        skuInfo: JSON.stringify(v.skus[0]?.skuDetail),
        price: v.price,
        quantity: v?.quantity,
        total: v?.total,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: v.status,
        warehouseId: v.warehouse[0]?.id
      };
      return {
        createdAt: v?.createdAt,
        updatedAt: v?.updatedAt,
        items: newItem
      }
    })
    const params = {
      orderId: result?.id,
      note: value?.note,
      status: value?.name,
      details: newDetail
    }
    await RequestUtils.Post('/warehouse-export/created', params).then(data => {
      if (data?.errorCode === 200) {
        InAppEvent.emit(HASH_MODAL_CLOSE);
        InAppEvent.normalSuccess("Xuất kho thành công");
      }
    })
  }
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
    value.quantity = value?.quantity || 1;
    value.price = value?.skus[0]?.listPriceRange[0]?.price;
    value.total = value.price * value.quantity;
    setListSp(pre => ([...pre, value]));
    InAppEvent.normalSuccess("Thêm sản phẩm thành công");
    setFilterSp([]);
    setTextSearch('');
  };

  return (
    <div>
      <Form onFinish={!newOrder ? createOrdernotFound : onHandleCreateOdder} layout="vertical" >
        <div style={{ height: 15 }}></div>
        <p>
          <strong>Thông tin sản phẩm</strong>
        </p>
        <div class="group-inan" style={{ background: '#f4f4f4', marginTop: 10, marginBottom: 20, borderTop: '1px dashed red' }}></div>
        {!orderWarhouse ? (
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
                          onHandleCreateSp({ ...item })
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
            <Table
              columns={columnsCreate}
              scroll={{ x: 1700 }}
              expandable={{
                expandedRowRender: (record) => {
                  const newTonkho = listProduct.flatMap(f => f.warehouses || []).find(v => v.skuId === record?.skuId);
                  return (
                    <div style={{ padding: "10px", background: "#f9f9f9", borderRadius: "8px" }}>
                      {record?.detaiItems ? (
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
                              <th style={thStyle}>Tên sản phầm</th>
                              <th style={thStyle}>Ngày tạo</th>
                              <th style={thStyle}>Đơn giá</th>
                              <th style={thStyle}>Số lượng</th>
                              <th style={thStyle}>SKU</th>
                              <th style={thStyle}>Tổng tiền</th>
                            </tr>
                          </thead>
                          <tbody>
                            {record?.detaiItems.map((item, i) => {
                              return (
                                <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
                                  <td style={tdStyle}>{item?.name}</td>
                                  <td style={tdStyle}>
                                    {dateFormatOnSubmit(item?.createdAt)}
                                  </td>
                                  <td style={tdStyle}>
                                    <InputNumber
                                      min={0}
                                      style={{ width: 120 }}
                                      formatter={formatterInputNumber}
                                      parser={parserInputNumber}
                                      value={item?.price} // Hiển thị đúng giá trị hiện tại
                                      onChange={(value) => {
                                        setNewOrder(prev => {
                                          const updatedItems = prev.items.map(v => {
                                            return {
                                              ...v,
                                              detaiItems: v.detaiItems.map(sp => {
                                                if (sp.skuId === item.skuId) {
                                                  return { ...sp, price: value };
                                                }
                                                return sp;
                                              })
                                            };
                                          });
                                          // Cập nhật info đồng bộ với items
                                          const updatedInfo = updatedItems.map(item => ({
                                            status: item.status,
                                            statusConfirm: item.statusConfirm,
                                            detaiItems: item.detaiItems,
                                            stt: item.stt
                                          }));
                                          return {
                                            ...prev,
                                            items: updatedItems,
                                            info: JSON.stringify(updatedInfo)
                                          };
                                        });
                                      }}
                                    />
                                  </td>
                                  <td style={tdStyle}>
                                    <InputNumber
                                      min={0}
                                      style={{ width: 120 }}
                                      formatter={formatterInputNumber}
                                      parser={parserInputNumber}
                                      value={item?.quantity}
                                      onChange={(value) => {
                                        if (value == null) return; // tránh set null hoặc undefined
                                        setNewOrder(prev => {
                                          const updatedItems = prev.items.map(v => {
                                            return {
                                              ...v,
                                              detaiItems: v.detaiItems.map(sp => {
                                                if (sp.skuId === item.skuId) {
                                                  return { ...sp, quantity: value, total: value * sp.price };
                                                }
                                                return sp; // các item khác thì giữ nguyên, không thông báo
                                              })
                                            };
                                          });
                                          const updatedInfo = updatedItems.map(item => ({
                                            status: item.status,
                                            statusConfirm: item.statusConfirm,
                                            detaiItems: item.detaiItems,
                                            stt: item.stt
                                          }));
                                          return {
                                            ...prev,
                                            items: updatedItems,
                                            info: JSON.stringify(updatedInfo)
                                          };
                                        });
                                      }}
                                    />
                                  </td>
                                  <td style={tdStyle}>
                                    {(() => {
                                      let parsedSkuInfo = [];
                                      try {
                                        if (item?.skuInfo) {
                                          parsedSkuInfo = JSON.parse(item?.skuInfo);
                                        }
                                      } catch (error) {
                                        console.error("Lỗi parse JSON:", error);
                                      }
                                      return (
                                        <p style={{ marginRight: "10px" }}>
                                          <strong>{parsedSkuInfo[0]?.name}:</strong> {parsedSkuInfo[1]?.value}...
                                        </p>
                                      )
                                    })()}
                                  </td>
                                  <td style={tdStyle}>
                                    {formatMoney(item?.total)}
                                  </td>
                                  {/* <td style={tdStyle}>
                          {parsedSkuInfo.map((detail) => (
                            <p key={detail.id} style={{ marginRight: "10px" }}>
                              <strong>{detail.name}:</strong> {detail.value}
                            </p>
                          ))}
                        </td> */}
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <p>Không có SKU nào</p>
                      )}
                    </div>
                  )
                },
              }}
              dataSource={listSp}
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
            </Row>
            <Row justify={'end'}>
              <Col xl={6}>
                <b style={{ paddingBottom: 10 }}>Trạng thái</b>
                <FormSelectAPI
                  required
                  apiPath='warehouse-export/fetch-status'
                  apiAddNewItem='warehouse-export/created-status'
                  onData={(data) => data ?? []}
                  label=""
                  title="Xuất kho"
                  name="name"
                  placeholder="Trạng thái"
                />
              </Col>
            </Row>
            <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 50 }}>
              <CustomButton title="Xuất đơn" htmlType="submit" />
            </div>
          </div>
        ) : (
          <div>
            <Table
              columns={columns}
              scroll={{ x: 1700 }}
              expandable={{
                expandedRowRender: (record) => {
                  const newTonkho = listProduct.flatMap(f => f.warehouses || []).find(v => v.skuId === record?.skuId);
                  return (
                    <div style={{ padding: "10px", background: "#f9f9f9", borderRadius: "8px" }}>
                      {record?.detaiItems ? (
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
                              <th style={thStyle}>Tên sản phầm</th>
                              <th style={thStyle}>Ngày tạo</th>
                              <th style={thStyle}>Đơn giá</th>
                              <th style={thStyle}>Số lượng</th>
                              <th style={thStyle}>SKU</th>
                              <th style={thStyle}>Tổng tiền</th>
                            </tr>
                          </thead>
                          <tbody>
                            {record?.detaiItems.map((item, i) => {
                              return (
                                <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
                                  <td style={tdStyle}>{item?.name}</td>
                                  <td style={tdStyle}>
                                    {dateFormatOnSubmit(item?.createdAt)}
                                  </td>
                                  <td style={tdStyle}>
                                    <InputNumber
                                      min={0}
                                      style={{ width: 120 }}
                                      formatter={formatterInputNumber}
                                      parser={parserInputNumber}
                                      value={item?.price} // Hiển thị đúng giá trị hiện tại
                                      onChange={(value) => {
                                        setNewOrder(prev => {
                                          const updatedItems = prev.items.map(v => {
                                            return {
                                              ...v,
                                              detaiItems: v.detaiItems.map(sp => {
                                                if (sp.skuId === item.skuId) {
                                                  return { ...sp, price: value };
                                                }
                                                return sp;
                                              })
                                            };
                                          });
                                          // Cập nhật info đồng bộ với items
                                          const updatedInfo = updatedItems.map(item => ({
                                            status: item.status,
                                            statusConfirm: item.statusConfirm,
                                            detaiItems: item.detaiItems,
                                            stt: item.stt
                                          }));
                                          return {
                                            ...prev,
                                            items: updatedItems,
                                            info: JSON.stringify(updatedInfo)
                                          };
                                        });
                                      }}
                                    />
                                  </td>
                                  <td style={tdStyle}>
                                    <InputNumber
                                      min={0}
                                      style={{ width: 120 }}
                                      formatter={formatterInputNumber}
                                      parser={parserInputNumber}
                                      value={item?.quantity}
                                      onChange={(value) => {
                                        if (value == null) return; // tránh set null hoặc undefined
                                        setNewOrder(prev => {
                                          const updatedItems = prev.items.map(v => {
                                            return {
                                              ...v,
                                              detaiItems: v.detaiItems.map(sp => {
                                                if (sp.skuId === item.skuId) {
                                                  return { ...sp, quantity: value, total: value * sp.price };
                                                }
                                                return sp; // các item khác thì giữ nguyên, không thông báo
                                              })
                                            };
                                          });
                                          const updatedInfo = updatedItems.map(item => ({
                                            status: item.status,
                                            statusConfirm: item.statusConfirm,
                                            detaiItems: item.detaiItems,
                                            stt: item.stt
                                          }));
                                          return {
                                            ...prev,
                                            items: updatedItems,
                                            info: JSON.stringify(updatedInfo)
                                          };
                                        });
                                      }}
                                    />
                                  </td>
                                  <td style={tdStyle}>
                                    {(() => {
                                      let parsedSkuInfo = [];
                                      try {
                                        if (item?.skuInfo) {
                                          parsedSkuInfo = JSON.parse(item?.skuInfo);
                                        }
                                      } catch (error) {
                                        console.error("Lỗi parse JSON:", error);
                                      }
                                      return (
                                        <p style={{ marginRight: "10px" }}>
                                          <strong>{parsedSkuInfo[0]?.name}:</strong> {parsedSkuInfo[1]?.value}...
                                        </p>
                                      )
                                    })()}
                                  </td>
                                  <td style={tdStyle}>
                                    {formatMoney(item?.total)}
                                  </td>
                                  {/* <td style={tdStyle}>
                          {parsedSkuInfo.map((detail) => (
                            <p key={detail.id} style={{ marginRight: "10px" }}>
                              <strong>{detail.name}:</strong> {detail.value}
                            </p>
                          ))}
                        </td> */}
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <p>Không có SKU nào</p>
                      )}
                    </div>
                  )
                },
              }}
              dataSource={newOrder?.items}
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
                {/* <FormTextArea
              rows={3}
              name="address"
              label="Địa chỉ giao hàng"
              placeholder="Địa chỉ giao hàng"
            /> */}
              </Col>
              <Col md={6} xs={6}>
                {/* <p>
              <strong>Đơn giá tổng: {formatMoney(totalPrice)}</strong>
            </p> */}
              </Col>
              <Col md={6} xs={6}>
                {/* <p>
              <strong> Số lượng sản phẩm: {totalQuanlity} sản phẩm</strong>
            </p> */}
              </Col>
            </Row>
            <Row justify={'end'}>
              <Col md={6} xs={6}>
              </Col>
              <Col md={6} xs={6}>
              </Col>
            </Row>
            <Row justify={'end'}>
              <Col xl={6}>
                <b style={{ paddingBottom: 10 }}>Trạng thái</b>
                <FormSelectAPI
                  required
                  apiPath='warehouse-export/fetch-status'
                  apiAddNewItem='warehouse-export/created-status'
                  onData={(data) => data ?? []}
                  label=""
                  title="Xuất kho"
                  name="name"
                  placeholder="Trạng thái"
                />
              </Col>
            </Row>
            <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 50 }}>
              <CustomButton title="Xuất đơn" htmlType="submit" />
            </div>
          </div>
        )}
      </Form>
    </div>
  )
}

export default ActionXuatKho
