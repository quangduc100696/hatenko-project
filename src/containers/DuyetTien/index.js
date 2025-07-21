import React from 'react';
import { Table } from 'antd';
import { formatMoney, formatTime } from 'utils/dataUtils';

const DuyetTienPage = ({ closeModal, title, data }) => {
    const CUSTOM_ACTION = [
        {
            title: "Code",
            dataIndex: 'code',
        },
        {
            title: "Thời gian",
            ataIndex: 'confirmTime',
            ellipsis: true,
            render: (item) => {
                return (
                    <div>
                        {formatTime(item.confirmTime)}
                    </div>
                )
            }
        },
        {
            title: "Nội dung",
            ataIndex: 'content',
            ellipsis: true,
            render: (item) => {
                return (
                    <div>
                        {item?.content}
                    </div>
                )
            }
        },
        {
            title: "Trạng thái",
            ataIndex: 'isConfirm',
            ellipsis: true,
            render: (item) => {
                return (
                    <div>
                        {item?.isConfirm}
                    </div>
                )
            }
        },
        {
            title: "Phương thức",
            ataIndex: 'method',
            ellipsis: true,
            render: (item) => {
                return (
                    <div>
                        {item?.method}
                    </div>
                )
            }
        },
        {
            title: "Tổng tiền",
            ataIndex: 'amount',
            ellipsis: true,
            render: (item) => {
                return (
                    <div>
                        {formatMoney(item?.amount)}
                    </div>
                )
            }
        },
    ];

    return <>
        <div>
            <p>
                <strong>Danh sách chi tiết thanh toán</strong>
            </p>
            <div class="group-inan" style={{ background: '#f4f4f4', borderTop: '1px dashed red', marginBottom: 20 }}></div>
            <Table dataSource={data} pagination={false} scroll={{ x: 1700 }} columns={CUSTOM_ACTION} />
        </div>
    </>
}

export default DuyetTienPage;