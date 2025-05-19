import React, { useEffect, useState } from 'react';
import { Column } from '@ant-design/plots';

const ChartActivityLead = ({ activityLead }) => {
    console.log(activityLead);
    const result = [];

    activityLead?.forEach((item) => {
        const date = new Date(item.date);
        const monthName = date.toLocaleString('en-US', { month: 'short' }); // "May", "Jun", ...

        item.data.forEach((entry) => {
            result.push({
                name: `${entry.saleId}`, // hoặc dùng entry.saleId nếu bạn muốn giữ nguyên
                month: `${monthName}.`,
                value: entry.total,
                type: `${entry.saleId}`,
            });
        });
    });

    const config = {
        data: result || [],
        xField: 'month',
        yField: 'value',
        isGroup: true,
        isStack: true,
        seriesField: 'type',
        groupField: 'name',
    };

    return (
        <div>
            <Column {...config} />
        </div>
    )
}

export default ChartActivityLead
