import { Button, Col, Form, Row, Select, Table } from 'antd'
import FormDatePicker from 'components/form/FormDatePicker';
import FormInput from 'components/form/FormInput';
import FormInputNumber from 'components/form/FormInputNumber';
import FormSelect from 'components/form/FormSelect';
import { HASH_MODAL_CLOSE } from 'configs';
import React, { useEffect, useState } from 'react'
import { f5List, formatMoney, formatTime } from 'utils/dataUtils'
import { InAppEvent } from 'utils/FuseUtils';
import RequestUtils from 'utils/RequestUtils';

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

const OrderPayment = ({ data, title}) => {

    const [form] = Form.useForm();
    const [itemOrder, setItemOrder] = useState([]);
    const [customer, setCustomer] = useState({});
    const [listSp, setListSp] = useState(data?.details || []);
    const [vat, setVat] = useState(data?.vat);

    const newSp = (data) => {
        if (title === 'Tạo mới đơn hàng') {
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
        } else {
            const newData = data.map((item, i) => {
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


    useEffect(() => {
        (async () => {
            const items = await RequestUtils.Get(`/pay/list-by-order-id?orderId=${data?.id}`);
            setItemOrder(items?.data)
        })()
    }, [data])

    useEffect(() => {
        (async () => {
            const customer = await RequestUtils.Get(`/customer/find-by-phone?phone=${data?.customerMobilePhone}&withOrder=withOrder`);
            setCustomer(customer?.data);
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
                columns={columnss}
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
