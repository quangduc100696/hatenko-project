import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import RequestUtils from 'utils/RequestUtils';
import ChartActivityRevenue from './ChartActivityRevenue'
import { LayoutWrapper } from './style';
import { formatMoney } from 'utils/dataUtils';
import ChartActivityLead from './ChartActivityLead';

const NewFeed = () => {
  const [listDataActivity, setListDataActivity] = useState({});
  const { activityGroup, activityLead, activityRevenue, activitySale } = listDataActivity;
  console.log(activityGroup)
  useEffect(() => {
    (async () => {
      const { data } = await RequestUtils.Get('/sale-report/data-activity');
      setListDataActivity(data);
    })()
  }, [])

  return (
    <div>
      <div style={{ width: '100%', background: '#fff', height: 'auto', padding: 10 }}>
        <Row gutter={16}>
          <Col md={14} xs={24}>
            <h2 style={{ fontSize: 14 }}>Biển đồ biến động doanh số</h2>
            <ChartActivityRevenue activityRevenue={activityRevenue} />
          </Col>
          <Col md={10} xs={24}>
            <LayoutWrapper>
              <div style={{ marginLeft: -12, marginRight: -12 }}></div>
              <div className='main__no__over'>
                <Row style={{ marginTop: 70 }}>
                  {activityGroup?.map((item, i) => (
                    <Col span={8}>
                      <b>Team {i + 1}: {formatMoney(Number(item?.total))}</b>
                    </Col>
                  ))}
                </Row>
                <Row>
                  <Col span={2}>
                    {/* <img src="/img/top_revenue_1.png" width={25} height={30} alt="icon"/> */}
                  </Col>
                  <Col span={22}>
                      {activityGroup?.map((item, i) => (
                        <div key={i} className='ct_sale'>
                          <Row>
                            <Col span={12}>
                              <p style={{ margin: 0, padding: 0, paddingLeft: 10}}>{item.leader}</p>
                            </Col>
                            <Col span={12}>
                            {formatMoney(Number(item?.total))}
                            </Col>
                          </Row>
                        </div>
                      ))}
                  </Col>
                </Row>
              </div>
            </LayoutWrapper>
          </Col>
        </Row>
      </div>
      <br/>
        <br/>
        <br/>
      <Row>
          <Col span={12}>
            <ChartActivityLead activityLead={activityLead}/>
          </Col>
          <Col span={12}>
          </Col>
        </Row>
    </div>
  )
}

export default NewFeed
