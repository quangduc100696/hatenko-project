import React from 'react';
import { DualAxes } from '@ant-design/plots';

const formatDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}`;
};

const ChartActivityRevenue = ({ activityRevenue }) => {
  // Tách dữ liệu thành 2 bộ dataset cho 2 trục y
  // Trục y trái: Doanh thu
  const dataRevenue = activityRevenue?.map(item => ({
    year: formatDate(item.date),
    'Doanh thu': item.data[0]?.total || 0,
  })) || [];
  
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
  
  const config = {
    data: [dataRevenue, dataOrderOpportunity],
    xField: 'year',
    yField: ['Doanh thu', 'value'],
    geometryOptions: [
      {
        geometry: 'line',
        lineStyle: {
          lineWidth: 3,
          lineDash: [5, 5],
        },
        color: '#5B8FF9',
        // label: {
        //   formatter: (datum) => `${datum['Doanh thu'].toLocaleString('vi-VN')} ₫`,
        // },
        yAxis: {
          label: {
            formatter: (v) => `${Number(v).toLocaleString('vi-VN')} ₫`,
          },
          title: {
            text: 'Doanh thu',
            style: { fill: '#5B8FF9' },
          },
        },
        tooltip: {
          formatter: (datum) => ({
            name: 'Doanh thu',
            value: `${datum['Doanh thu'].toLocaleString('vi-VN')} ₫`,
          }),
        },
      },
      {
        geometry: 'line',
        seriesField: 'type',
        color: ['#5AD8A6', '#F6BD16'],
        lineStyle: (datum) => {
          if (datum.type === 'Đơn hàng') return { lineWidth: 4, opacity: 0.5 };
          if (datum.type === 'Cơ hội') return { lineWidth: 3, opacity: 0.7 };
          return {};
        },
        point: {
          visible: true,
          style: (datum) => {
            if (datum.type === 'Đơn hàng') return { stroke: '#5AD8A6', fill: '#fff' };
            if (datum.type === 'Cơ hội') return { stroke: '#F6BD16', fill: '#fff' };
            return {};
          },
        },
        yAxis: {
          position: 'right',
          // label: {
          //   formatter: (v) => v.toString(),
          // },
          title: {
            text: 'Đơn hàng / Cơ hội',
            style: { fill: '#5AD8A6' },
          },
        },
        tooltip: {
          formatter: (datum) => ({
            name: datum.type,
            value: datum.value.toLocaleString('vi-VN'),
          }),
        },
      }
    ],
    legend: {
      position: 'top',
    },
  };
  
  
  return (
    <div>
      <DualAxes {...config} />
    </div>
  );
};

export default ChartActivityRevenue;
