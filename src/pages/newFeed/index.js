import { Col, Progress, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import RequestUtils from 'utils/RequestUtils';
import ChartActivityRevenue from './ChartActivityRevenue'
import { LayoutWrapper } from './style';
import ChartActivityLead from './ChartActivityLead';

function formatToMillion(value) {
  const number = Number(value);
  if (isNaN(number)) return '0M';
  return (number / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
}

const getRankIcon = (index) => {
  const icons = [
    <img src="/img/top_revenue_1.png" width={25} height={30} alt="icon" />,
    <img src="/img/top_revenue_2.png" width={25} height={30} alt="icon" />,
    <img src="/img/top_revenue_3.png" width={25} height={30} alt="icon" />,
  ];
  return index < 3 ? icons[index] : `${index + 1}`;
};

const NewFeed = () => {
  const [ listDataActivity, setListDataActivity ] = useState({});
  const { activityGroup, activityLead, activityRevenue } = listDataActivity;

  useEffect(() => {
    (async () => {
      const { data } = await RequestUtils.Get('/sale-report/data-activity');
      setListDataActivity(data);
    })()
  }, [])
  const grandTotal = activityGroup?.reduce((sum, item) => sum + Number(item.total), 0);

  return (
    <div>
      <div style={{ width: '100%', background: '#fff', height: 'auto', padding: 10 }}>
        <Row gutter={16}>
          <Col md={14} xs={24}>
            <h2 style={{ fontSize: 14, fontWeight: 'bold' }}>Biển đồ biến động doanh số</h2>
            <ChartActivityRevenue activityRevenue={activityRevenue} />
          </Col>
          <Col md={10} xs={24}>
            <LayoutWrapper>
              <div style={{ marginLeft: -12, marginRight: -12 }}></div>
              <div className='main__no__over'>
                {/* <Row style={{ marginTop: 70 }}>
                  {activityGroup?.map((item, i) => (
                    <Col span={8}>
                      <b>Team {i + 1}: {formatMoney(Number(item?.total))}</b>
                    </Col>
                  ))}
                </Row> */}
                <div style={{marginTop: 70}}>
                  {activityGroup?.sort((a, b) => Number(b.total) - Number(a.total)).map((item, i) => (
                    <Row key={i} align={'bottom'}>
                      <Col span={2}>
                        {getRankIcon(i)}
                      </Col>
                      <Col span={22}>
                        <div className='ct_sale'>
                          <Row>
                            <Col span={6}>
                              <p style={{ margin: 0, padding: 0, paddingLeft: 10 }}>{item.leader}</p>
                            </Col>
                            <Col span={10} style={{borderLeft: '1px solid #fff',paddingLeft: 12, paddingRight: 12}}>
                              <Progress percent={((item.total / grandTotal) * 100).toFixed(2)} strokeColor="#ffc016"/>
                            </Col>
                            <Col span={8} style={{fontSize: 14, borderLeft: '1px solid #fff', paddingLeft: 15}}>
                              {formatToMillion(Number(item?.total))}
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  ))}
                </div>
              </div>
            </LayoutWrapper>
          </Col>
        </Row>
      </div>
      <br />
      <br />
      <br />
      <Row>
        <Col span={14}>
          <h2 style={{ fontSize: 14, fontWeight: 'bold' }}>Biểu đồ biến động lead theo các sale</h2>
          <ChartActivityLead activityLead={activityLead} />
        </Col>
        <Col span={10} style={{ height: 40 }}>
          {/* <h2 style={{ fontSize: 14, fontWeight: 'bold' }}>Báo cáo hoạt động ngày:</h2>
          { activitySale?.map((item, i) => (
            <div style={{width: '100%', background: '#e6e6e8', display: 'flex', justifyContent: 'space-between', padding: 5}} key={i}>
              <p>Tên: {item?.sale}</p>
              <p>Tổng tiền: {formatMoney(item?.total)}</p>
            </div>
          ))} */}
        </Col>
      </Row>
    </div>
  )
}

export default NewFeed
