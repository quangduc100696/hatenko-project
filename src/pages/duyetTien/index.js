import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import RestList from 'components/RestLayout/RestList';
import LeadFilter from './Filter';
import useGetList from "hooks/useGetList";
import { Button, Col, Form, Row, Select, Table } from 'antd';
import { arrayEmpty, dateFormatOnSubmit, f5List, formatMoney, formatTime } from 'utils/dataUtils';
import { InAppEvent } from 'utils/FuseUtils';
import RequestUtils from 'utils/RequestUtils';
import { ModaleCreateCohoiStyle } from 'containers/Lead/styles';
import FormInputNumber from 'components/form/FormInputNumber';
import FormDatePicker from 'components/form/FormDatePicker';
import FormSelect from 'components/form/FormSelect';
import FormInput from 'components/form/FormInput';

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
const OptionPrice = [{ title: 'Tiền mặt', name: 'tienmat' }, { title: 'MoMo', name: 'momo' }, { title: 'VNpay', name: 'vnpay' }]

const DuyetTienPage = () => {
  const [form] = Form.useForm();
  const [onOpen, setOnOpen] = useState(false);
  const [title] = useState("Danh sách duyệt tiền");
  const [itemOrder, setItemOrder] = useState([]);
  const [detailData, setDetailData] = useState({});
  const [customer, setCustomer] = useState({});
  const [vat, setVat] = useState(detailData?.vat);
  let totalAmount = itemOrder?.reduce((sum, item) => sum + item?.amount, 0);

  useEffect(() => {
    (async () => {
      const items = await RequestUtils.Get(`/pay/list-by-order-id?orderId=${detailData?.id}`);
      const customer = await RequestUtils.Get(`/customer/find-by-phone?phone=${detailData?.customerMobilePhone}&withOrder=withOrder`);
      setCustomer(customer?.data);
      setItemOrder(items?.data)
    })()
  }, [detailData])

  useEffect(() => {
    (() => {
      if (itemOrder?.length > 0) {
        form.setFieldsValue({ monneyPrice: totalAmount });
        form.setFieldsValue({ content: itemOrder[0]?.content })
        form.setFieldsValue({ datePrice: itemOrder[0]?.confirmTime })
      }
    })()
  }, [itemOrder, form, totalAmount])

  const onHandleVat = (vat) => setVat(vat);
  const CUSTOM_ACTION = [
    {
      title: "Mã đơn hàng",
      dataIndex: 'code',
      width: 200
    },
    {
      title: "Số điện thoại",
      ataIndex: 'customerMobilePhone',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item.customerMobilePhone}
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
      title: "Khách hàng",
      ataIndex: 'customerReceiverName',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.customerReceiverName}
          </div>
        )
      }
    },
    {
      title: "Sale",
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
      title: "Đã thanh toán",
      ataIndex: 'paid',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {formatMoney(item?.paid)}
          </div>
        )
      }
    },
    {
      title: "Thao tác",
      width: 120,
      fixed: 'right',
      render: (record) => {
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            {record?.paid === record?.total ? '' : (
              <Button color="primary" variant="dashed" onClick={() => {
                setDetailData(record)
                setOnOpen(true);
              }} size='small'>
                Thanh toán
              </Button>
            )}
            {/* <Button color="primary" variant="dashed" onClick={() => onEdit(record)} size='small'>
            Chi tiết
          </Button> */}
          </div>
        )
      }
    }
  ];

  const onData = useCallback((values) => {
    if (arrayEmpty(values)) {
      return values;
    }
    const newData = { embedded: values, page: { pageSize: 10, total: 1 } }
    return newData;
  }, []);

  const beforeSubmitFilter = useCallback((values) => {
    dateFormatOnSubmit(values, ['from', 'to']);
    return values;
  }, []);

  // thanh toán
  const onHandleCreatePayment = async (value) => {
    const newDetails = (detailData?.details || []).map((detail) => {
      const matchingItems = detailData?.details
        .filter(sp => sp.code === detail.code)
        .flatMap(sp => sp.items || []);
      const items = matchingItems.length > 0
        ? matchingItems
        : detailData?.details?.flatMap(sp => sp.items || []);

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
    if (!detailData?.details?.length && detailData?.details?.length) {
      newDetails.push({
        productName: detailData?.details[0]?.productName || "N/A",
        id: null,
        items: detailData?.details?.flatMap(sp => sp.items || []).map(item => ({
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
      id: detailData?.id,
      dataId: detailData?.id,
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

  const onCreateLead = () => {

  }

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
        initialFilter={{ limit: 10, page: 1, code: '', saleId: '', phone: '', from: '', to: '' }}
        filter={<LeadFilter />}
        beforeSubmitFilter={beforeSubmitFilter}
        useGetAllQuery={useGetList}
        hasCreate={false}
        apiPath={'pay/list-order-payment'}
        expandable={{
          expandedRowRender: (record) => {
            return (
              <div style={{ padding: "10px", background: "#f9f9f9", borderRadius: "8px" }}>
                {record.payments && record.payments.length > 0 ? (
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
                        <th style={thStyle}>Số lần</th>
                        <th style={thStyle}>Thời gian thanh toán</th>
                        <th style={thStyle}>Nội dung</th>
                        <th style={thStyle}>Trạng thái</th>
                        <th style={thStyle}>Phương thức</th>
                        <th style={thStyle}>Tổng tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {record?.payments?.map((item, i) =>
                        <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
                          {/* Chỉ hiển thị sku.code ở hàng đầu tiên của detail */}
                          <td style={tdStyle}>
                            {i + 1}
                          </td>
                          <td style={tdStyle}>
                            {dateFormatOnSubmit(item?.confirmTime)}
                          </td>
                          <td style={tdStyle}>
                            {(item?.content)}
                          </td>
                          <td style={tdStyle}>
                            {item?.isConfirm === 1 ? "Đã duyệt" : "Chưa duyệt"}
                          </td>
                          <td style={tdStyle}>
                            {item?.method}
                          </td>
                          <td style={tdStyle}>
                            {formatMoney(item?.amount) || "N/A"}
                          </td>

                        </tr>
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
        customClickCreate={onCreateLead}
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
            columns={columnss}
            scroll={{ x: 700 }}
            dataSource={itemOrder || []}
            pagination={false}
          />
          <div style={{ border: '0.5px dashed red', marginTop: 30 }} />
          <Row style={{ marginTop: 20 }}>
            <Col md={12} xs={12}>
              <p>
                <span style={{ marginRight: 10 }}>Tổng chi phí: {formatMoney(detailData?.total || 0)}</span>
              </p>
            </Col>
            <Col md={12} xs={12}>
              <p>
                <span style={{ marginRight: 10 }}>Phí vận chuyển:{formatMoney(detailData?.shippingCost || 0)}</span>
              </p>
            </Col>
            <Col md={12} xs={12}>
              <p>
                <span style={{ marginRight: 10 }}>Đã thanh toán: {formatMoney(detailData?.paid || 0)}</span>
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
  )
}

export default DuyetTienPage
