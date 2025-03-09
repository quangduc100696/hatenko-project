import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import RestList from 'components/RestLayout/RestList';
import Filter from './Filter';
import useGetList from "hooks/useGetList";
import { arrayEmpty, dateFormatOnSubmit, formatMoney, formatTime } from 'utils/dataUtils';
import { HASH_MODAL } from 'configs';
import { InAppEvent } from 'utils/FuseUtils';
import { Button } from 'antd';
import { cloneDeep } from 'lodash';

const thStyle = {
    padding: "8px 12px",
    borderBottom: "2px solid #ddd",
    fontWeight: "bold",
};

const tdStyle = {
    padding: "8px 12px",
    borderBottom: "1px solid #ddd",
};

const CohoiPage = () => {

    const [title] = useState("Danh sách cơ hội");

    const onEdit = (item) => {
        let title = 'Chi tiết cơ hội# ';
        let hash = '#draw/cohoi.edit';
        let data = cloneDeep(item);
        InAppEvent.emit(HASH_MODAL, { hash, title, data });
    }

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
        {
            title: "Sản phẩm",
            width: 200,
            ellipsis: true,
            render: (item) => {
                return (
                    <div>
                        {item?.details?.map(item => (
                            <div>
                                {item?.productName}
                            </div>
                        ))}
                    </div>
                )
            }
        },
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
            width: 150,
            fixed: 'right',
            ellipsis: true,
            render: (record) => (
                <div>
                    <Button color="primary" variant="dashed" onClick={() => onEdit(record)} size='small'>
                        Thanh toán
                    </Button>
                </div>
            )
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
                                                <th style={thStyle}>Mã đơn</th>
                                                <th style={thStyle}>Tên Sản phẩm</th>
                                                <th style={thStyle}>Giá bán</th>
                                                <th style={thStyle}>Chi tiết</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {record.details.map((sku) => {
                                                return (
                                                    <tr key={sku.id} style={{ borderBottom: "1px solid #ddd" }}>
                                                        <td style={tdStyle}>{sku?.code}</td>
                                                        { }
                                                        <td style={tdStyle}>{sku?.items[0]?.name || 'N/A'}</td>
                                                        <td style={tdStyle}>
                                                            {formatMoney(sku?.items[0]?.price) || 'N/A'}
                                                        </td>
                                                        <td style={tdStyle}>
                                                            {(() => {
                                                                let parsedSkuInfo = [];
                                                                try {
                                                                    if (sku?.items?.[0]?.skuInfo) {
                                                                        parsedSkuInfo = JSON.parse(sku.items[0].skuInfo);
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
                columns={CUSTOM_ACTION}
            />
        </div>
    )
}

export default CohoiPage
