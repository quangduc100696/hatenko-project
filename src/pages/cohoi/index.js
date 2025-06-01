import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import RestList from 'components/RestLayout/RestList';
import Filter from './Filter';
import useGetList from "hooks/useGetList";
import { arrayEmpty, dateFormatOnSubmit, f5List, formatMoney, formatTime, renderSkuInfo } from 'utils/dataUtils';
import { HASH_MODAL, HASH_MODAL_CLOSE } from 'configs';
import { InAppEvent } from 'utils/FuseUtils';
import { Button, Col, Form, InputNumber, Row, Select, Table } from 'antd';
import { cloneDeep } from 'lodash';
import { ModaleCreateCohoiStyle } from 'containers/Lead/styles';
import CustomButton from 'components/CustomButton';
import RequestUtils from 'utils/RequestUtils';
import FormInput from 'components/form/FormInput';
import FormSelect from 'components/form/FormSelect';
import FormTextArea from 'components/form/FormTextArea';
import FormInputNumber from 'components/form/FormInputNumber';
import FormTimePicker from 'components/form/FormTimePicker';
import FormDatePicker from 'components/form/FormDatePicker';


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

const CohoiPage = () => {

  const [title] = useState("Danh sách cơ hội");
  const [listSp, setListSp] = useState([]);
  const [onOpen, setOnOpen] = useState(false);
  const [data, setData] = useState({})
  const [customer, setCustomer] = useState({});
  const [productDetails, setProductDetails] = useState([]);
  const [itemOrder, setItemOrder] = useState([]);
  const [vat, setVat] = useState(data?.vat);
  const [form] = Form.useForm();

  let total = newSp(listSp)?.reduce((sum, item) => sum + item?.price * item?.quantity, 0);
  let totalAmount = itemOrder?.reduce((sum, item) => sum + item?.amount, 0);
  let totalPain = itemOrder?.reduce((sum, item) => sum + (item?.paid || 0), 0);

  const onEdit = (item) => {
    let title = 'Chi tiết cơ hội# ';
    let hash = '#draw/cohoi.edit';
    let data = cloneDeep(item);
    InAppEvent.emit(HASH_MODAL, { hash, title, data });
  }

  useEffect(() => {
    (async () => {
      const customer = await RequestUtils.Get(`/customer/find-by-phone?phone=${data?.customerMobilePhone}&withOrder=withOrder`);
      setCustomer(customer?.data);
    })()
  }, [data])

  useEffect(() => {

    const productIds = data?.details?.map((item) => item.productId).filter(Boolean);
    if (productIds?.length) {
      (async () => {
        const productDetails = await RequestUtils.Get(`/product/find-list-id?id=${productIds.join(",")}`);
        setProductDetails(productDetails?.data);
      })();
    }
  }, [data]);

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

  const CUSTOM_ACTION = [
    {
      title: "Mã đơn",
      ataIndex: 'code',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.code}
          </div>
        )
      }
    },
    // {
    //   title: "Sản phẩm",
    //   width: 200,
    //   ellipsis: true,
    //   render: (item) => {
    //     return (
    //       <div>
    //         {item?.details?.map(item => (
    //           <div>
    //             {item?.productName}
    //           </div>
    //         ))}
    //       </div>
    //     )
    //   }
    // },
    {
      title: "Ngày tạo",
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {formatTime(item.createdAt)}
          </div>
        )
      }
    },
    {
      title: "Người tạo",
      ataIndex: 'userCreateUsername',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.userCreateUsername}
          </div>
        )
      }
    },
    {
      title: "Số d/t",
      ataIndex: 'customerMobilePhone',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.customerMobilePhone}
          </div>
        )
      }
    },
    {
      title: "Email",
      ataIndex: 'customerEmail',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.customerEmail}
          </div>
        )
      }
    },
    {
      title: "Tỉnh T/P",
      ataIndex: 'customerAddress',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.customerAddress || 'N/A'}
          </div>
        )
      }
    },
    {
      title: "Tổng tiền",
      ataIndex: 'total',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {formatMoney(item?.total)}
          </div>
        )
      }
    },
    {
      title: "Thao tác",
      width: 200,
      fixed: 'right',
      ellipsis: true,
      render: (record) => (
        <div style={{ display: 'flex', gap: 10 }}>
          {record?.paid === record?.total ? '' : (
            <Button color="primary" variant="dashed" onClick={() => {
              setListSp(record?.details);
              setData(record)
              setOnOpen(true);
            }} size='small'>
              Thanh toán
            </Button>
          )}
          <Button color="primary" variant="dashed" onClick={() => onEdit(record)} size='small'>
            Chi tiết
          </Button>
        </div>
      )
    }
  ];

  const columns = [
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

  const onData = useCallback((values) => {
    if (arrayEmpty(values.embedded)) {
      return values;
    }
    return values;
  }, []);

  const beforeSubmitFilter = useCallback((values) => {
    dateFormatOnSubmit(values, ['from', 'to']);
    return values;
  }, []);

  const onCreateLead = () => InAppEvent.emit(HASH_MODAL, {
    hash: '#draw/lead.edit',
    title: 'Tạo mới Lead',
    data: {}
  });

  const onHandleCreateSp = async (value) => {
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
      InAppEvent.normalSuccess("Thanh toán thành công");
      f5List('customer-order/fetch-cohoi');
    } else {
      InAppEvent.normalError("Tạo cơ hội thất bại");
    }
  }

  const onHandleVat = (vat) => setVat(vat);

  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <CustomBreadcrumb
        data={[{ title: 'Trang chủ' }, { title: title }]}
      />
      <RestList
        xScroll={1200}
        onData={onData}
        initialFilter={{ limit: 10, page: 1 }}
        filter={<Filter />}
        hasCreate={false}
        beforeSubmitFilter={beforeSubmitFilter}
        useGetAllQuery={useGetList}
        apiPath={'customer-order/fetch-cohoi'}
        customClickCreate={onCreateLead}
        expandable={{
          expandedRowRender: (record) => {
            return (
              <div style={{ padding: "10px", background: "#f9f9f9", borderRadius: "8px" }}>
                {record.details && record.details.length > 0 ? (
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
                        <th style={thStyle}>Mã sản phẩm</th>
                        <th style={thStyle}>Tên Sản phẩm</th>
                        <th style={thStyle}>Đơn vị tính</th>
                        <th style={thStyle}>Chi tiết</th>
                        <th style={thStyle}>Giá bán</th>
                        <th style={thStyle}>Số lượng</th>
                        <th style={thStyle}>Chiết khấu</th>
                        <th style={thStyle}>Tổng tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {record.details.map((sku) =>
                        sku.items.map((item, index) => (
                          <tr key={`${sku.id}-${item.id || index}`} style={{ borderBottom: "1px solid #ddd" }}>
                            {/* Chỉ hiển thị sku.code ở hàng đầu tiên của detail */}
                            <td style={tdStyle}>
                              {index === 0 ? sku?.code : ""}
                            </td>
                            <td style={tdStyle}>
                              {item?.name || "N/A"}
                            </td>
                            <td></td> {/* Cột trống */}
                            <td style={tdStyle}>
                              {(() => {
                                let parsedSkuInfo = [];
                                try {
                                  if (item?.skuInfo) {
                                    parsedSkuInfo = JSON.parse(item.skuInfo);
                                  }
                                } catch (error) {
                                  console.error("Lỗi parse JSON:", error);
                                }
                                return (
                                  <>
                                    {parsedSkuInfo.length > 0 && (
                                      <p key={parsedSkuInfo[0].id} style={{ marginRight: "10px", display: "inline" }}>
                                        <strong>{parsedSkuInfo[0].name}:</strong> {parsedSkuInfo[0].value}
                                      </p>
                                    )}
                                    {parsedSkuInfo.length > 1 && <span> ...</span>}
                                  </>
                                );
                              })()}
                            </td>
                            <td style={tdStyle}>
                              {formatMoney(item?.price) || "N/A"}
                            </td>
                            <td style={tdStyle}>
                              {item?.quantity || "N/A"}
                            </td>
                            <td style={tdStyle}>
                              {(() => {
                                let discount = {};
                                try {
                                  discount = JSON.parse(item?.discount);
                                } catch (error) {
                                  console.error("Lỗi parse JSON:", error);
                                }
                                return discount?.discountUnit === "percent"
                                  ? `${discount?.discountValue}%`
                                  : formatMoney(discount?.discountValue);
                              })()}
                            </td>
                            <td style={tdStyle}>
                              {formatMoney(item?.total) || "N/A"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                ) : (
                  <p>Không có SKU nào</p>
                )}
              </div>
            )
          },
        }}
        columns={CUSTOM_ACTION}
      />
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
                  <Select placeholder="Chọn Vat" style={{width: 160, marginLeft: 5}} onChange={onHandleVat}>
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

export default CohoiPage
