import React, { useState, useEffect } from 'react';
import RestEditModal from 'components/RestLayout/RestEditModal';
import { PhoneOutlined, MailOutlined, UserAddOutlined, FacebookOutlined, AimOutlined } from '@ant-design/icons';
import ProductForm from './ProductForm';
import RequestUtils from 'utils/RequestUtils';
import { InAppEvent } from 'utils/FuseUtils';
import { GATEWAY, HASH_MODAL_CLOSE } from 'configs';
import { f5List, formatMoney } from 'utils/dataUtils';
import { Col, Form, Image, InputNumber, Row, Select, Table } from 'antd';
import { formatterInputNumber, parserInputNumber } from 'utils/tools';
import { DISCOUNT_UNIT_CONST } from 'configs/localData';

const thStyle = {
    padding: "8px 12px",
    borderBottom: "2px solid #ddd",
    fontWeight: "bold",
};

const tdStyle = {
    padding: "8px 12px",
    borderBottom: "1px solid #ddd",
};

const newSp = (data) => {
    const newData = data.map((item, i) => {
        const newItem = item?.items?.map((subItem) => ({
            ...subItem,
            code: item.code,
            key: i,
        }));
        return newItem;
    });
    return newData.flat();
};

const TakeNotLead = ({ closeModal, title, data }) => {
    const [ record, setRecord ] = useState({});
    const [ customer, setCustomer ] = useState({});
    const [ listSp, setListSp ] = useState(data?.details || []);
    const [ productDetails, setProductDetails ] = useState([]);
    const [ listProduct, setListProduct ] = useState([]);

    useEffect(() => {
        const productIds = data?.details
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
    }, [data]);

    useEffect(() => {
        (async () => {
            const customer = await RequestUtils.Get(`/customer/find-by-phone?phone=${data?.customerMobilePhone}&withOrder=withOrder`);
            setCustomer(customer?.data);
        })()
    }, [data])

    useEffect(() => {
        (async () => {
            const { data } = await RequestUtils.Get(`/product/fetch`);
            setListProduct(data?.embedded);
        })()
    }, [])

    const columns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => {
                const product = productDetails.find((p) => p.id === record.productId);
                return product?.name || "N/A";
            },
        },
        {
            title: 'Mã sản phẩm',
            dataIndex: 'code',
            key: 'code',
            render: (_, record) => {
                const product = productDetails.find((p) => p.id === record.productId);
                return product?.code || "N/A";
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
                        src={`${product?.image ? `${GATEWAY}${product?.image}` : '/img/image_not_found.png'}`}
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
                return product?.unit || "N/A";
            },
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
                    <div>
                        {formatMoney(item?.price)}
                    </div>
                )
            }
        },
        {
            title: 'Chiết khấu',
            render: (item) => {
                // try {
                const discount = JSON.parse(item?.discount)

                return (
                    <div>
                        <InputNumber
                            min={0}
                            style={{ width: 80 }}
                            formatter={formatterInputNumber}
                            parser={parserInputNumber}
                            value={discount?.discountValue} // Hiển thị đúng giá trị hiện tại
                            onChange={(value) => {
                                const newData = listSp?.map(f => ({
                                    ...f,
                                    items: f?.items?.map(v =>
                                        v?.id === item.id ? {
                                            ...v, discount: JSON.stringify(
                                                {
                                                    discountUnit: discount?.discountUnit,
                                                    discountValue: value
                                                }
                                            )
                                        } : v
                                    )
                                }));
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
                const discount = JSON.parse(item?.discount)
                return (
                    <div>
                        <Select
                            value={discount?.discountUnit}
                            onChange={(value) => {
                                const newData = listSp?.map(f => ({
                                    ...f,
                                    items: f?.items?.map(v =>
                                        v?.id === item.id ? {
                                            ...v, discount: JSON.stringify(
                                                {
                                                    discountUnit: value,
                                                    discountValue: discount?.discountValue
                                                }
                                            )
                                        } : v
                                    )
                                }));
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
            title: 'Số lượng',
            render: (item) => (
                <InputNumber
                    min={1}
                    value={item?.quantity}
                    onChange={(value) => {
                        const newData = listSp?.map(f => ({
                            ...f,
                            items: f?.items?.map(v =>
                                v?.id === item.id ? { ...v, quantity: value } : v
                            )
                        }));
                        setListSp(newData);
                    }}
                />
            )
        },
        {
            title: 'Tổng tiền',
            render: (item) => {
                const discount = JSON.parse(item?.discount);
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
        // {
        //   title: 'Hành động',
        //   dataIndex: '',
        //   key: 'x',
        //   render: (record) => (
        //     <div style={{ display: 'flex', gap: 10 }}>
        //       <div onClick={() => onHandleDeleteSp(record)}>
        //         <a>Xoá sản phẩm</a>
        //       </div>
        //     </div>
        //   ),
        // },
    ];


    const onSubmit = async (dataCreate) => {
        const params = {
            orderCode: data?.code,
            note: dataCreate?.note,
            cause: dataCreate?.cause
        }
        const newData = await RequestUtils.Post('/customer-order/take-care-order', params);
        if (newData?.errorCode === 200) {
            f5List('customer-order/fetch-order-take-care');
            InAppEvent.normalSuccess("Cập nhật thành công");
            InAppEvent.emit(HASH_MODAL_CLOSE);
        }
    }
    return <>
        <Form layout="vertical" >
            <p><strong>Thông tin khách hàng</strong></p>
            <div className="group-inan" style={{ background: '#f4f4f4', borderTop: '1px dashed red' }}></div>
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
            <div style={{ height: 15 }}></div>
            <p>
                <strong>Thông tin sản phẩm</strong>
            </p>
            <div className="group-inan" style={{ background: '#f4f4f4', marginTop: 10, marginBottom: 20, borderTop: '1px dashed red' }}></div>
            {/* <Button
              type="dashed"
              style={{ float: 'right', marginBottom: 20 }}
              icon={<PlusOutlined />}
              onClick={() => setIsOpen(true)}
            >
              Thêm sản phẩm
            </Button> */}
            <div style={{ position: 'relative', width: '100%' }}>
                <div>
                    {/* <Input
            style={{ width: '30%', float: 'right', marginBottom: 20 }}
            prefix={<SearchOutlined />}
            value={textSearch}
            placeholder="Thêm sản phẩm vào đơn"
            onChange={handleChange}
          /> */}
                </div>


            </div>

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
                                                        return (
                                                            <>
                                                                <p style={{ marginRight: "10px" }}>
                                                                    <strong>{parsedSkuInfo[0]?.name}:</strong> {parsedSkuInfo[0]?.value}
                                                                </p>
                                                                {parsedSkuInfo?.length > 1 && <span> ...</span>}
                                                            </>
                                                        )
                                                    })()}
                                                </td>
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
            <div className="group-inan" style={{ background: '#f4f4f4', marginTop: 10, marginBottom: 20, borderTop: '1px dashed red' }}></div>
        </Form>
        <RestEditModal
            isMergeRecordOnSubmit={false}
            updateRecord={(values) => setRecord(curvals => ({ ...curvals, ...values }))}
            onSubmit={onSubmit}
            record={record}
            closeModal={closeModal}
        >
            <ProductForm />
        </RestEditModal>
    </>
}

export default TakeNotLead;