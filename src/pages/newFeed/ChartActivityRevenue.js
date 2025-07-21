import React from 'react';
import { Column, DualAxes } from '@ant-design/plots';

const formatDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}`;
};

const ChartActivityRevenue = ({ activityRevenue }) => {
  // Tách dữ liệu thành 2 bộ dataset cho 2 trục y
  // Trục y trái: Doanh thu
  // const dataRevenue = activityRevenue?.map((item, idx) => ({
  //   year: formatDate(item.date),
  //   'Doanh thu': item.data[0]?.total || 0,
  // })) || [];

  const dataOrderOpportunity = activityRevenue?.flatMap(item => ([
    {
      year: formatDate(item.date),
      value: item.data[0]?.order || 0,
      type: 'Đơn hàng',
    },
    {
      year: formatDate(item.date),
      value: item.data[0]?.cohoi || 0,
      type: 'Cơ hội',
    }
  ])) || [];

  const dataRevenue = activityRevenue?.map((item, idx) => ({
    year: formatDate(item.date),
    value: 100000 * (idx + 1),
    type: 'Doanh số hoàn thành thực tế'
  })) || [];

  if (!dataRevenue || dataRevenue.length == 0) return <></>
  const config = {
    data: dataRevenue,
    xField: 'year',
    yField: 'value',
    seriesField: 'type',
    columnWidthRatio: 0.4,
    color: ['#2B6CB0'],
    tooltip: {
      formatter: (datum) => ({
        name: datum.type,
        value: `${datum.value.toLocaleString('vi-VN')} ₫`,
      }),
    },
    yAxis: {
      label: {
        formatter: (v) => `${Number(v).toLocaleString('vi-VN')} ₫`,
      },
    },
    legend: {
      position: 'bottom',
    },
  };
  return (
    <div style={{ height: '100%' }}>
      <Column {...config} />
    </div>
  );
};

export default ChartActivityRevenue;
