import React, { useEffect, useState } from 'react';
import { Column } from '@ant-design/plots';
import RequestUtils from 'utils/RequestUtils';

const ChartActivityLead = ({ activityLead }) => {
  const [listSale, setListSale] = useState([]);
  const result = [];

  useEffect(() => {
    (async () => {
      const { data } = await RequestUtils.Get('/user/list-sale');
      if (data) {
        setListSale(data);
      }
    })()
  }, [])

  activityLead?.forEach((item) => {
    const date = new Date(item.date);
    const dateStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
    // Ví dụ kết quả: "20/05"    
    item.data.forEach((entry) => {
      const nameSale = listSale.find(f => f.id === entry.saleId);

      result.push({
        name: nameSale?.ssoId, // hoặc dùng entry.saleId nếu bạn muốn giữ nguyên
        day: dateStr,
        value: entry.total,
        type: nameSale?.ssoId,
      });
    });
  });

  const config = {
    data: result || [],
    xField: 'day',
    yField: 'value',
    isGroup: true,
    isStack: true,
    seriesField: 'type',
    groupField: 'name',
    columnWidthRatio: 1,
  };

  return (
    <div>
      <Column {...config} />
    </div>
  )
}

export default ChartActivityLead
