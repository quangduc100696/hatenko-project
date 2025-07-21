import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import RestList from 'components/RestLayout/RestList';
import LeadFilter from './Filter';
import useGetList from "hooks/useGetList";
import { arrayEmpty, dateFormatOnSubmit, formatMoney } from 'utils/dataUtils';
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

const CongnoPage = () => {

    const [listSale, setListSale] = useState([]);
    const [title] = useState("Danh sách Công nơ theo đơn");

    useEffect(() => {
    (async() => {
        const listSalse = await RequestUtils.Get('/user/list-sale');
        setListSale(listSalse?.data);
    })()
    },[])

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
                initialFilter={{ limit: 10, page: 1, phone: '', cause: '', userId: '', from: '', to: '', }}
                filter={<LeadFilter sale={listSale}/>}
                beforeSubmitFilter={beforeSubmitFilter}
                useGetAllQuery={useGetList}
                hasCreate={false}
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
                                                <th style={thStyle}>Mã đơn </th>
                                                <th style={thStyle}>Thời gian tạo</th>
                                                <th style={thStyle}>Tên sản phẩm</th>
                                                <th style={thStyle}>Số lượng</th>
                                                <th style={thStyle}>Tổng tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {record?.details?.map((item, i) =>
                                                <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
                                                    {/* Chỉ hiển thị sku.code ở hàng đầu tiên của detail */}
                                                    <td style={tdStyle}>
                                                        {item?.code}
                                                    </td>
                                                    <td style={tdStyle}>
                                                        {dateFormatOnSubmit(item?.createdAt)}
                                                    </td>
                                                    <td style={tdStyle}>
                                                        {(item?.productName)}
                                                    </td>
                                                    <td style={tdStyle}>
                                                        {item?.quantity}
                                                    </td>
                                                    <td style={tdStyle}>
                                                        {formatMoney(item?.total) || "N/A"}
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
                apiPath={'accountant/fetch-receivable'}
                customClickCreate={onCreateLead}
                columns={CUSTOM_ACTION}
            />
        </div>
    )
}

export default CongnoPage
