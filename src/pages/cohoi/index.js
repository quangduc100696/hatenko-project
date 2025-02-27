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

const CohoiPage = () => {

    const [title] = useState("Danh sách cơ hội");

    const onEdit = (item) => {
        let title = 'Chi tiết cơ hội# ' + item.id;
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
            width: 100,
            fixed: 'right',
            ellipsis: true,
            render: (record) => (
                <div>
                    <Button color="primary" variant="dashed" onClick={() => onEdit(record)} size='small'>
                        Detail
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
                columns={CUSTOM_ACTION}
            />
        </div>
    )
}

export default CohoiPage
