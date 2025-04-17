import { Checkbox, Col, Form, Image, InputNumber, Row, Select, Table } from 'antd';
import CustomButton from 'components/CustomButton';
import FormInput from 'components/form/FormInput';
import FormSelectAPI from 'components/form/FormSelectAPI';
import FormTextArea from 'components/form/FormTextArea';
import { GATEWAY, HASH_MODAL_CLOSE } from 'configs';
import { DISCOUNT_UNIT_CONST } from 'configs/localData';
import React, { useEffect, useState } from 'react'
import { formatMoney } from 'utils/dataUtils';
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
  const [dataOrder, setDataOrder] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const [listSp, setListSp] = useState(data?.details || []);
  const [productDetails, setProductDetails] = useState([]);
  const [checkStatus, setCheckStatus] = useState(false);

  useEffect(() => {
    (async () => {
      const order = await RequestUtils.Get(`/warehouse-export/find-order-id?orderId=${data?.id}`);
      const listProduct = await RequestUtils.Get(`/product/fetch`);
      setListProduct(listProduct?.data?.embedded);
      setDataOrder(order?.data)
    })()
  }, [data])

  useEffect(() => {
    const productIds = data?.details
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

  const columns = [
    Table.EXPAND_COLUMN,
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
        return (
          <>{`${record.quantity} ${product?.unit || record?.unit}`}</>
        )
      },
    },
    // {
    //   title: 'SKU',
    //   render: (item) => {
    //     return (
    //       <div>
    //         <Select
    //           style={{ width: 200 }}
    //           value={!item?.skus ? '' : item?.skus[0]?.name}
    //           onChange={(value) => {
    //             const newData = listSp.map(f => {
    //               if (f.value?.id === item.id) {
    //                 return {
    //                   ...f,
    //                   detail: { ...f.detail },
    //                   value: {
    //                     ...f.value,
    //                     skus: [JSON.parse(value)]
    //                   }
    //                 };
    //               }
    //               return f;
    //             });
    //             setListSp(newData);
    //           }}
    //         >
    //           {item?.skusCoppy?.map((f, id) => (
    //             <Select.Option key={id} value={JSON.stringify(f)}>{f?.name}</Select.Option>
    //           ))}
    //         </Select>
    //       </div>
    //     );
    //   }
    // },
    {
      title: 'Đơn giá',
      render: (item) => {
        return (
          <div>
            {formatMoney(item.price)}
          </div>
        )
      }
    },
    {
      title: 'Số lượng',
      render: (item) => {
        return (
          <>{item.quantity}</>
        )
      }
    },
    // {
    //   title: 'Chiết khấu',
    //   render: (item) => {
    //     return (
    //       <div>
    //         {item.discountValue || 'N/A'}
    //       </div>
    //     )
    //   }
    // },
    // {
    //   title: 'Loại chiết khấu',
    //   render: (item) => {
    //     console.log(DISCOUNT_UNIT_CONST.filter(v => v.value === item?.discountUnit));
    //     console.log(item);

    //     return (
    //       <div>
    //         {DISCOUNT_UNIT_CONST.filter(v => v.value === item?.discountUnit)?.map((f, id) => (
    //           <div key={id}>{f?.text}</div>
    //         ))}
    //       </div>
    //     );
    //   }
    // },
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

  const onHandleCheck = (e) => {
    setCheckStatus(e.target.checked);
  }

  const onHandleCreateOdder = async (value) => {
    // nếu có dataOrder thì dùng update còn ngược lại thì add
    if (!dataOrder) {
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
        orderId: data?.id,
        note: value?.note,
        status: value?.name,
        details: newDetail
      }
      await RequestUtils.Post('/warehouse-export/created', params).then(data => {
        if(data?.errorCode === 200) {
          InAppEvent.emit(HASH_MODAL_CLOSE);
          InAppEvent.normalSuccess("Xuất kho thành công");
        }
      })
    } else {
      const param = {
        ...dataOrder,
        status: value?.name
      }
      const cleanedData = {
        ...param,
        items: param.items.map(({ stt, ...rest }) => rest)
      };
      await RequestUtils.Post('/warehouse-export/updated', cleanedData).then(data => {
        if(data?.errorCode === 200) {
          InAppEvent.emit(HASH_MODAL_CLOSE);
          InAppEvent.normalSuccess("Cập nhật xuất kho thành công");
        }
      })
    }
  }

  return (
    <div>

      <Form onFinish={onHandleCreateOdder} layout="vertical" >
        <div style={{ height: 15 }}></div>
        <Row>
          <Col xl={6}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <b>Trạng thái</b>
              <Checkbox onChange={onHandleCheck}>Confirm xuất kho</Checkbox>
            </div>
            <FormSelectAPI
              required
              apiPath='warehouse-export/fetch-status'
              apiAddNewItem='warehouse-export/created-status'
              onData={(data) => data ?? []}
              label=""
              checked={checkStatus}
              title="xuat kho"
              name="name"
              placeholder="Trạng thái"
            />
          </Col>
          <Col xl={6}>
          </Col>
        </Row>
        <p>
          <strong>Thông tin sản phẩm</strong>
        </p>
        <div class="group-inan" style={{ background: '#f4f4f4', marginTop: 10, marginBottom: 20, borderTop: '1px dashed red' }}></div>
        <Table
          columns={columns}
          scroll={{ x: 1700 }}
          expandable={{
            expandedRowRender: (record) => {
              const newTonkho = listProduct.flatMap(f => f.warehouses || []).find(v => v.skuId === record?.skuId);
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
            {/* <p>
              <strong> Tổng tiền: {formatMoney(total)}</strong>
            </p> */}
          </Col>
          <Col md={6} xs={6}>
            {/* <p>
              <strong>Giá trị chiết khấu </strong>
            </p> */}
          </Col>
        </Row>
        <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 50 }}>
          <CustomButton title="Xuất đơn" htmlType="submit" />
        </div>
      </Form>
    </div>
  )
}

export default ActionXuatKho
