import { Col, Form, Image, Input, InputNumber, Row, Select, Table } from 'antd';
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
  const [results, setResults] = useState(result);
  const [filterSp, setFilterSp] = useState([]);
  const [textSearch, setTextSearch] = useState('');
  const [listStatus, setListStatus] = useState([]);

  useEffect(() => {
    (async () => {
      const listProduct = await RequestUtils.Get(`/product/fetch`);
      const listStatus = await RequestUtils.Get(`/warehouse-export/fetch-status`);
      setListStatus(listStatus.data);
      setListProduct(listProduct?.data?.embedded);
    })()
  }, [data])

  useEffect(() => {
    const productIds = results?.details
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
      width: 150,
      render: (record) => {
        return (
          <div>Lần {record?.stt}</div>
        )
      },
    },
    {
      title: 'Trạng thái Confirm',
      width: 150,
      render: (record) => {
        const nameStatus = listStatus.find(f => f.type === record.statusConfirm);
        return (
          <div>
            {record.statusConfirm === 0 ? 'Chưa Confirm' : 'Đã Confirm'}
            {/* <Select
              style={{ width: 200 }}
              value={nameStatus?.name}
              onChange={(e) => {
                console.log(e);
              }}
            >
              {listStatus.map((item, i) => {
                return (
                  <Select.Option key={i} value={item.type}>{item.name}</Select.Option>
                )
              })}
            </Select> */}
          </div>
        )
      },
    },
  ];
  const colums2 = [
    {
      title: 'Tên sản phẩm',
      render: (record) => {
        return (
          <div>{record?.name}</div>
        )
      },
    },
    {
      title: 'Ngày tạo',
      render: (record) => {
        return (
          <div>{dateFormatOnSubmit(record?.createdAt)}</div>
        )
      },
    },
    {
      title: 'SKU',
      render: (record) => {
        const decodeSkus = JSON.parse(record.skuInfo)
        return (
          <div>
            <p style={{ marginRight: "10px" }}>
              <strong>{decodeSkus[0]?.name}:</strong> {decodeSkus[1]?.value}...
            </p>
          </div>
        )
      },
    },
    {
      title: 'Đơn giá',
      render: (record) => {
        return (
          <div>{formatMoney(record.price)}</div>
        )
      },
    },
    {
      title: 'Số lượng cần xuất',
      render: (record) => {
        const order = result?.details[0]?.items.find(o => o?.productId === record?.productId);
        const remaining = order?.quantity - record?.quantity;
        return (
          !newOrder ? (
            <InputNumber
              min={1}
              value={record?.quantity}
              onChange={(value) => {
                if (value <= order.quantity) {
                  const newDetails = results.details?.map((f) => {
                    return {
                      ...f,
                      items: f.items.map((item) =>
                        item.id === record.id ? { ...item, quantity: value } : item
                      ),
                    };
                  });
                  setResults({ ...results, details: newDetails });
                } else {
                  return InAppEvent.normalInfo(
                    "Số lượng phải nhỏ hơn hoặc bằng số lượng đơn hàng"
                  );
                }
              }}
            />
          ) : (
            <InputNumber
              min={1}
              value={remaining || 1}
              onChange={(value) => {
                if (value > order.quantity) {
                  return InAppEvent.normalInfo('Số lượng phải nhỏ hơn hoặc bằng số lượng đơn hàng');
                }
                // ✅ Update state hợp lệ ở đây
                const newItem = newOrder?.items.map(f => {
                  const chidItem = f.detaiItems.map(v => {
                    if (v.productId === record.productId) {
                      return {
                        ...v,
                        quantity: value
                      }
                    }
                    return v;
                  })
                  return { ...f, detaiItems: chidItem };
                })
                setNewOrder(pre => ({ ...pre, items: newItem }))
              }}
            />
          )
        )
      },
    },
    {
      title: 'Tổng tiền',
      render: (record) => {
        return (
          <div>
            {formatMoney(record.total)}
          </div>
        )
      },
    },
  ]

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
        orderId: results?.id,
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
    const now = new Date();
    const formatted = now.toISOString().replace('T', ' ').substring(0, 19);
    const newDetail = results?.details[0].items?.map(v => {
      const newItem = {
        name: v?.name,
        productId: v?.productId,
        skuId: v?.skuId,
        skuInfo: v?.skuInfo,
        price: v.price,
        quantity: v?.quantity,
        total: v?.total,
        createdAt: v?.createdAt,
        updatedAt: v?.updatedAt,
        status: v.status,
        warehouseId: v?.warehouseId
      };
      return newItem
    })

    const params = {
      orderId: results?.id,
      note: value?.note,
      status: value?.name,
      details: [{ createdAt: formatted, updatedAt: formatted, items: newDetail, }]
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

  const filteredWarehouseList = newOrder?.items[0].detaiItems.filter(warehouseItem => {
    const matchedOrder = results.details[0]?.items.find(orderItem =>
      orderItem.productId === warehouseItem.productId &&
      orderItem.skuId === warehouseItem.skuId
    );
    const orderQty = matchedOrder?.quantity || 0;
    const warehouseQty = warehouseItem.quantity ?? 0; // dùng ?? để giữ số 0 nếu quantity là null
    const diff = orderQty - warehouseQty;
    return diff !== 0; // chỉ giữ nếu còn thiếu hoặc dư
  });

  return (
    <div>
      <Form onFinish={!newOrder ? createOrdernotFound : onHandleCreateOdder} layout="vertical" >
        <div style={{ height: 15 }}></div>
        <p>
          <strong>Thông tin xuất kho</strong>
        </p>
        <div class="group-inan" style={{ background: '#f4f4f4', marginTop: 10, marginBottom: 20, borderTop: '1px dashed red' }}></div>
        <div>
          {!newOrder ? (
            <div style={{ color: 'red' }}>Chưa có thông tin xuất kho!</div>
          ) : (
            <Table
              columns={columns}
              scroll={{ x: 1700 }}
              expandable={{
                expandedRowRender: (record) => {
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
                                    {formatMoney(item?.price)}
                                  </td>
                                  <td style={tdStyle}>
                                    {item?.quantity || 'N/A'}
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
          )}
          <br />
          <br />
          <p>
            <strong>Thông tin cần xuất</strong>
          </p>
          <div class="group-inan" style={{ background: '#f4f4f4', marginTop: 10, marginBottom: 20, borderTop: '1px dashed red' }}></div>
          {!newOrder ? (
            <Table
              columns={colums2}
              scroll={{ x: 1700 }}
              dataSource={results.details[0]?.items}
              pagination={false}
            />
          ) : (
            !filteredWarehouseList || filteredWarehouseList?.length <= 0 ? (
              <div style={{ color: 'red' }}>Đã xuất hết sản phẩm theo đơn!</div>
            ) : (
              <Table
                columns={colums2}
                scroll={{ x: 1700 }}
                dataSource={filteredWarehouseList}
                pagination={false}
              />
            )
          )}
          <br />
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
            </Col>
            <Col md={6} xs={6}>
            </Col>
            <Col md={6} xs={6}>
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

      </Form>
    </div>
  )
}

export default ActionXuatKho
