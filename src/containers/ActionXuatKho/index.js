import { Button, Checkbox, Col, Form, InputNumber, Row, Select, Table, Tag } from 'antd';
import CustomButton from 'components/CustomButton';
import FormInput from 'components/form/FormInput';
import FormSelectAPI from 'components/form/FormSelectAPI';
import { HASH_MODAL_CLOSE } from 'configs';
import React, { useEffect, useRef, useState } from 'react'
import { dateFormatOnSubmit, formatMoney } from 'utils/dataUtils';
import { InAppEvent } from 'utils/FuseUtils';
import RequestUtils from 'utils/RequestUtils';

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
  const [productDetails, setProductDetails] = useState([]);
  const [newOrder, setNewOrder] = useState(orderWarhouse);
  const [results, setResults] = useState(result);
  const [listStatus, setListStatus] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [filterWareHouse, setFilterWareHouse] = useState([]);
  const [listWareHouse, setListWareHouse] = useState([])
  const [ProductIdWareHouse, setProductIdWareHouse] = useState(null);
  const sttRef = useRef(null);
  const resultsRef = useRef([]);

  // Tính tổng số lượng đã xuất
  const totalQuantity = newOrder?.items?.reduce((total, item) => {
    const itemQuantity = item.detaiItems?.reduce((sum, detail) => sum + detail.quantity, 0);
    return total + itemQuantity;
  }, 0);

  useEffect(() => {
    if (newOrder) {
      const exportedQuantities = {};
      newOrder?.items?.forEach(item => {
        item.detaiItems?.forEach(detail => {
          const key = `${detail.productId}_${detail.skuId}`;
          exportedQuantities[key] = (exportedQuantities[key] || 0) + detail.quantity;
        });
      });

      const newFilteredWarehouseList = result.details[0]?.items
        .map(orderItem => {
          const key = `${orderItem.productId}_${orderItem.skuId}`;
          const exportedQty = exportedQuantities[key] || 0;
          const remainingQty = orderItem.quantity - exportedQty;

          return {
            ...orderItem,
            diff: remainingQty,
            orderQty: orderItem.quantity,
            warehouseQty: exportedQty
          };
        })
        .filter(item => item.diff > 0);

      setFilterWareHouse(newFilteredWarehouseList || []);
    }
  }, [newOrder, result]);

  useEffect(() => {
    (async () => {
      const listProduct = await RequestUtils.Get(`/product/fetch`);
      const listStatus = await RequestUtils.Get(`/warehouse-export/fetch-status`);
      const listWareHouse = await RequestUtils.Get(`/warehouse/fetch-stock`);
      setListStatus(listStatus.data);
      setListProduct(listProduct?.data?.embedded);
      setListWareHouse(listWareHouse?.data);
    })()
  }, [data])

  useEffect(() => {
    const productIds = results?.details
      ?.flatMap((detail) => detail.items?.map((item) => item.productId) || [])
      .filter(Boolean);

    (async () => {
      if (!Array.isArray(productIds) || productIds.length === 0) return;
      try {
        const productDetails = await RequestUtils.Get(`/product/find-list-id?ids=${productIds.join(",")}`);
        setProductDetails(Array.isArray(productDetails?.data) ? productDetails.data : []);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    })();
  }, []);

  // Hàm xử lý thay đổi số lượng
  const handleQuantityChange = (productId, skuId, value) => {
    setProductQuantities(prev => ({
      ...prev,
      [`${productId}_${skuId}`]: value
    }));
  };

  const columns = [
    Table.EXPAND_COLUMN,
    {
      title: 'Số lần xuất kho',
      render: (record) => <div>Lần {record?.stt}</div>,
    },
    {
      title: 'Trạng thái Confirm',
      render: (record) => {
        const nameDetail = listStatus.find(f => f.id === record.status);
        return (
          <>
            <Select placeholder="Vui lòng chọn trạng thái" style={{ maxWidth: 160 }} value={nameDetail?.name} onChange={(id) => onHandleSubmitStatus(id, record)}>
              {listStatus.map(item => (
                <Select.Option value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </>
        )
      },
    },
    {
      title: 'Action',
      render: (record) => <div onClick={() => onHandleRemove(record)}>
        <CustomButton title="Xoá đơn xuất kho" htmlType="submit" />
      </div>,
    },
  ];

  const colums2 = [
    {
      title: 'Tên sản phẩm',
      render: (record) => <div>{record?.name}</div>,
    },
    {
      title: 'Ngày tạo',
      render: (record) => <div>{dateFormatOnSubmit(record?.createdAt)}</div>,
    },
    {
      title: 'SKU',
      render: (record) => {
        const decodeSkus = JSON.parse(record.skuInfo);
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
      render: (record) => <div>{formatMoney(record.price)}</div>,
    },
    {
      title: 'Số lượng cần xuất',
      render: (record) => {
        const orderItem = result?.details[0]?.items.find(
          o => o?.productId === record?.productId && o?.skuId === record?.skuId
        );
        const quantityKey = `${record.productId}_${record.skuId}`;
        // Sửa ở đây: lấy số lượng từ orderItem nếu chưa có newOrder
        const defaultValue = !newOrder ? (orderItem?.quantity || 1) : (record.diff || 1);

        return (
          <InputNumber
            min={1}
            max={orderItem?.quantity}
            defaultValue={defaultValue}
            onChange={(value) => {
              if (value > orderItem.quantity) {
                InAppEvent.normalInfo('Số lượng phải nhỏ hơn hoặc bằng số lượng đơn hàng');
                return;
              }
              handleQuantityChange(record.productId, record.skuId, value);
            }}
          />
        );
      },
    },
    {
      title: 'Hành động',
      render: (record) => (
        <div style={{ display: 'flex', gap: 10 }}>
          <Checkbox onChange={(e) => onHandleChecked(e, record)}>
            Chọn sản phẩm để xuất
          </Checkbox>
        </div>
      ),
    },
  ];

  const onHandleRemove = (record) => {
    const data = newOrder.items.filter(f => {
      if (f.stt === record.stt && f.statusConfirm === 0) {
        return false;
      }
      return true; // giữ lại các phần tử khác
    });
    setNewOrder(pre => ({ ...pre, items: data }))
    resultsRef.current = [];
  }

  /* Lấy id của kho theo đơn */
  const onHandleSelectWareHouse = (id) => {
    setProductIdWareHouse(id)
  }

  const onHandleChecked = (e, record) => {
    const { checked } = e.target;
    const { productId, skuId } = record;
    const quantityKey = `${productId}_${skuId}`;
    if (newOrder) {
      if (checked) {
        const totalExported = newOrder.items.reduce((total, item) => {
          return item.detaiItems?.reduce((sum, detail) => {
            if (detail.productId === productId && detail.skuId === skuId) {
              return sum + detail.quantity;
            }
            return sum;
          }, total);
        }, 0);

        const orderItem = result.details[0]?.items.find(
          o => o?.productId === productId && o?.skuId === skuId
        );

        const remainingQty = orderItem.quantity - totalExported;
        const exportQty = Math.min(productQuantities[quantityKey] || remainingQty, remainingQty);
        // const newWarehouseDeliveryId = Math.min(ProductIdWareHouse[quantityKey]);
        if (exportQty <= 0) {
          InAppEvent.normalInfo("Sản phẩm đã được xuất đủ số lượng");
          return;
        }
        if (sttRef.current === null) {
          sttRef.current = Math.max(...(newOrder?.items.map(i => i.stt || 0) || [0])) + 1;
        }
        const newItem = {
          ...record,
          quantity: exportQty,
        };
        resultsRef.current = resultsRef.current.filter(
          i => !(i.productId === record.productId && i.skuId === record.skuId)
        );

        // Thêm mới
        resultsRef.current.push(newItem);
        const params = {
          detaiItems: resultsRef?.current,
          warehouseDeliveryId: ProductIdWareHouse,
          statusConfirm: 0,
          stt: sttRef.current
        };
        setNewOrder(prev => {
          const filteredItems = prev.items.filter(item => item.stt !== params.stt);
          return {
            ...prev,
            items: [...filteredItems, params]
          };
        });
      } else {
        // setNewOrder(prev => ({
        //   ...prev,
        //   items: prev.items.slice(0, -1)
        // }));
      }
    } else {
      setResults(prev => {
        const updatedDetails = [...prev.details];
        updatedDetails[0] = {
          ...updatedDetails[0],
          items: updatedDetails[0].items.map(item => {
            if (item.productId === productId && item.skuId === skuId) {
              // Sửa ở đây: lấy số lượng từ orderItem nếu chưa có newOrder
              const orderItem = result.details[0]?.items.find(
                o => o?.productId === productId && o?.skuId === skuId
              );
              const defaultQty = orderItem?.quantity || 1;

              return {
                ...item,
                isSelected: checked,
                quantity: checked ? (productQuantities[quantityKey] || defaultQty) : 0
              };
            }
            return item;
          })
        };
        return {
          ...prev,
          details: updatedDetails
        };
      });
    }
  };

  const createOrdernotFound = async (value) => {
    const now = new Date();
    const formatted = now.toISOString().replace('T', ' ').substring(0, 19);
    const selectedItems = results.details[0]?.items
      .filter(item => item.isSelected && item.quantity > 0)
      .map(item => {
        const product = productDetails.find(p => p.id === item.productId);
        return {
          name: product?.name || item?.name,
          productId: item.productId,
          skuId: item.skuId,
          skuInfo: item.skuInfo,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
          status: item.status || 1,
          warehouseId: item.warehouseId,
          createdAt: formatted,
          updatedAt: formatted,
        };
      });

    if (selectedItems.length === 0) {
      return InAppEvent.normalInfo("Vui lòng chọn ít nhất một sản phẩm để xuất kho");
    }

    const params = {
      orderId: results?.id,
      note: value?.note || '',
      status: value?.name || 1,
      details: [{
        createdAt: formatted,
        updatedAt: formatted,
        items: selectedItems,
      }],
      warehouseDeliveryId: ProductIdWareHouse,
    };
    try {
      const response = await RequestUtils.Post('/warehouse-export/created', params);
      if (response?.errorCode === 200) {
        InAppEvent.emit(HASH_MODAL_CLOSE);
        InAppEvent.normalSuccess("Xuất kho thành công");
      }
    } catch (error) {
      console.error('Lỗi khi xuất kho:', error);
      InAppEvent.normalError("Có lỗi xảy ra khi xuất kho");
    }
  };

  const onHandleCreateOdder = async (value) => {
    if (!newOrder) {
      await createOrdernotFound(value);
    } else {
      const param = {
        ...newOrder,
        status: value?.name,
      };
      const cleanedData = {
        ...param,
        items: param.items.map(({ stt, ...rest }) => rest)
      };
      try {
        const response = await RequestUtils.Post('/warehouse-export/updated', cleanedData);
        if (response?.errorCode === 200) {
          InAppEvent.emit(HASH_MODAL_CLOSE);
          InAppEvent.normalSuccess("Cập nhật xuất kho thành công");
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật xuất kho:', error);
        InAppEvent.normalError("Có lỗi xảy ra khi cập nhật xuất kho");
      }
    }
  };

  /* update trang thai xuat kho */
  const onHandleSubmitStatus = async (id, record) => {
    try {
      const newOrderStt = newOrder.items.map(f => {
        return {
          ...f,
          status: f.stt === record?.stt ? id : f.status
        }
      })
      const params = {
        ...newOrder,
        items: newOrderStt
      }
      const response = await RequestUtils.Post('/warehouse-export/updated', params);
      if (response?.errorCode === 200) {
        InAppEvent.normalSuccess("Cập nhật trạng thái xuất kho thành công");
      }
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái ', error);
      InAppEvent.normalError("Lỗi cập nhật trạng thái");
    }
  }

  return (
    <div>
      <Form onFinish={onHandleCreateOdder} layout="vertical">
        <div style={{ height: 15 }}></div>
        <p><strong>Thông tin xuất kho</strong></p>
        <div className="group-inan" style={{ background: '#f4f4f4', marginTop: 10, marginBottom: 20, borderTop: '1px dashed red' }}></div>

        {!newOrder ? (
          <div style={{ color: 'red' }}>Chưa có thông tin xuất kho!</div>
        ) : (
          <Table
            columns={columns}
            scroll={{ x: 1700 }}
            rowKey={(record) => record.stt}
            expandable={{
              expandedRowRender: (record) => (
                <div style={{ padding: "10px", background: "#f9f9f9", borderRadius: "8px" }}>
                  {record?.detaiItems ? (
                    <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "8px", overflow: "hidden" }}>
                      <thead>
                        <tr style={{ background: "#f0f0f0", textAlign: "left" }}>
                          <th style={thStyle}>Tên sản phầm</th>
                          <th style={thStyle}>Ngày tạo</th>
                          <th style={thStyle}>Đơn giá</th>
                          <th style={thStyle}>Số lượng</th>
                          <th style={thStyle}>SKU</th>
                        </tr>
                      </thead>
                      <tbody>
                        {record?.detaiItems.map((item, i) => (
                          <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
                            <td style={tdStyle}>{item?.name}</td>
                            <td style={tdStyle}>{dateFormatOnSubmit(item?.createdAt)}</td>
                            <td style={tdStyle}>{formatMoney(item?.price)}</td>
                            <td style={tdStyle}>{item?.quantity || 'N/A'}</td>
                            <td style={tdStyle}>
                              {(() => {
                                try {
                                  const parsedSkuInfo = item?.skuInfo ? JSON.parse(item?.skuInfo) : [];
                                  return (
                                    <p style={{ marginRight: "10px" }}>
                                      <strong>{parsedSkuInfo[0]?.name}:</strong> {parsedSkuInfo[1]?.value}...
                                    </p>
                                  );
                                } catch (error) {
                                  console.error("Lỗi parse JSON:", error);
                                  return 'N/A';
                                }
                              })()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : <p>Không có SKU nào</p>}
                </div>
              ),
            }}
            dataSource={newOrder?.items}
            pagination={false}
          />
        )}
        <br />
        <br />
        <p><strong>Thông tin cần xuất</strong></p>
        <div className="group-inan" style={{ background: '#f4f4f4', marginTop: 10, marginBottom: 20, borderTop: '1px dashed red' }}></div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 20 }}>
            <Select style={{ width: '20%' }}
              placeholder="Chọn kho xuất" onChange={onHandleSelectWareHouse}>
              {listWareHouse?.map((item, i) => {
                return (
                  <Select.Option key={i} value={item.id}>
                    {item.name}
                  </Select.Option>
                )
              })}
            </Select>
          </div>
        </div>
        {!newOrder ? (
          <Table
            columns={colums2}
            scroll={{ x: 1700 }}
            dataSource={result.details[0]?.items}
            pagination={false}
          />
        ) : (
          result.details[0].items[0].quantity === totalQuantity ? (
            <div style={{ color: 'red' }}>Đã xuất hết sản phẩm theo đơn!</div>
          ) : (
            <Table
              columns={colums2}
              scroll={{ x: 1700 }}
              dataSource={filterWareHouse}
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
      </Form>
    </div>
  );
};

export default ActionXuatKho;