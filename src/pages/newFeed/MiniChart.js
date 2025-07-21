import React from 'react';
import { Area, Line } from '@ant-design/plots';



const MiniLineChart = ({
    data
}) => {
    const chartData = data.map((y, index) => ({ x: index, y }));

    const config = {
        data: chartData,
        xField: 'x',
        yField: 'y',
        height: 36,
        padding: [0, 0, 0, 0],
        smooth: true,
        xAxis: false,
        yAxis: false,
        tooltip: false,
        line: {
            style: {
                stroke: '#2f3e94',
                lineWidth: 2,
            },
        },
        areaStyle: () => {
            return {
                fill: 'l(270) 0:#ffffff 0.4:#c5d1f4 0.8:#9fb4f4 1:#ffffff00',
            };
        },
        animation: false,
    };

    return <Area {...config} />;
};

export default MiniLineChart;
