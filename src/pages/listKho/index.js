import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import RestList from 'components/RestLayout/RestList';
import LeadFilter from './Filter';
import useGetList from "hooks/useGetList";
import {dateFormatOnSubmit } from 'utils/dataUtils';
import { HASH_MODAL } from 'configs';
import { InAppEvent } from 'utils/FuseUtils';
import useGetMe from 'hooks/useGetMe';

const ListWareHouse = () => {

    const { user: profile } = useGetMe();
    const [title] = useState("Danh sách kho");
    const CUSTOM_ACTION = [
        {
            title: "Tên kho",
            ataIndex: 'status',
            width: 200,
            ellipsis: true,
            render: (item) => {
                return (
                    <div>
                        {item?.name}
                    </div>
                )
            }
        },
        {
            title: "Số điện thoại",
            ataIndex: 'mobile',
            width: 200,
            ellipsis: true,
            render: (item) => {
                return (
                    <div>
                        {item?.mobile}
                    </div>
                )
            }
        },
        {
            title: "Địa chỉ",
            ataIndex: 'address',
            width: 200,
            ellipsis: true,
            render: (item) => {
                return (
                    <div>
                        {item?.address || 'N/A'}
                    </div>
                )
            }
        },
        {
            title: "Khu vực",
            ataIndex: 'area',
            width: 200,
            ellipsis: true,
            render: (item) => {
                return (
                    <div>
                        {item?.area}
                    </div>
                )
            }
        }
    ];

    const onData = useCallback((values) => {
        const newData = {embedded: values, page: {pageSize: 10, total: 1}}
        return newData;
    }, []);

    const beforeSubmitFilter = useCallback((values) => {
        dateFormatOnSubmit(values, ['from', 'to']);
        return values;
    }, []);

    const onCreateLead = () => InAppEvent.emit(HASH_MODAL, {

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
                filter={<LeadFilter />}
                hasCreate={false}
                beforeSubmitFilter={beforeSubmitFilter}
                useGetAllQuery={useGetList}
                apiPath={'warehouse/fetch-stock'}
                customClickCreate={onCreateLead}
                columns={CUSTOM_ACTION}
            />
        </div>
    )
}

export default ListWareHouse

