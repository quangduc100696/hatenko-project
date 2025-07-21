import React from 'react';
import { Line } from '@ant-design/plots';

const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}`;
};

const ChartSale = ({ activityRevenue }) => {

    const data = [
        {
            step: 'Phương án/ Báo giá',
            value: 1,
        },
        {
            step: 'Xác minh khách hàng',
            value: 4,
        },
    ];
    if (!data || data.length == 0) return <></>
    const config = {
        data,
        xField: 'step',
        yField: 'value',
        smooth: true,
        lineStyle: {
            stroke: '#2B6CB0', // Màu xanh dương
            lineWidth: 3,
        },
        point: {
            size: 4,
            shape: 'circle',
            style: {
                fill: '#2B6CB0',
                stroke: '#fff',
                lineWidth: 1,
            },
        },
        tooltip: {
            formatter: (datum) => ({
                name: 'Số tiền',
                value: `${datum.value.toLocaleString('vi-VN')} ₫`,
            }),
        },
        yAxis: {
            label: {
                formatter: (v) => `${Number(v).toLocaleString('vi-VN')} ₫`,
            },
            title: {
                text: 'Số tiền',
            },
        },
        xAxis: {
            title: {
                text: '',
            },
        },
    };
    return (
        <div style={{ height: '100%' }}>
            <Line {...config} />
        </div>
    );
};

export default ChartSale;
