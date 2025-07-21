import { Button, Card, Col, Divider, Progress, Row, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import RequestUtils from 'utils/RequestUtils';
import ChartActivityRevenue from './ChartActivityRevenue'
import { LayoutWrapper } from './style';
import ChartActivityLead from './ChartActivityLead';
import ChartSale from './ChartSale';
import { Text } from '@react-email/components';
import { Option } from 'antd/es/mentions';
import Title from 'antd/es/typography/Title';
import {
  UserOutlined,
  ContactsOutlined,
  PlusOutlined,
  FileTextOutlined,
  DollarCircleOutlined,
  FileDoneOutlined,
  BookOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import MiniLineChart from './MiniChart';

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

  const data = [
    {
      title: 'Khách hàng đã thêm',
      icon: <UserOutlined style={{ fontSize: 20 }} />,
      value: '2.906 Người',
      change: -5.4,
      chart: [10, 80, 120, 140, 130, 125, 110], // có xu hướng giảm
    },
    {
      title: 'SL người liên hệ',
      icon: <ContactsOutlined style={{ fontSize: 20 }} />,
      value: '0 Người',
      change: 0,
      chart: [0, 0, 80, 300, 600, 300, 80, 0, 0]
    },
    {
      title: 'Cơ hội đã thêm',
      icon: <PlusOutlined style={{ fontSize: 20 }} />,
      value: '5 Cái',
      change: 80,
      chart: [1, 2, 3, 3, 4, 5, 5], // tăng mạnh
    },
    {
      title: 'Hợp đồng đã tạo',
      icon: <FileTextOutlined style={{ fontSize: 20 }} />,
      value: '0 cái',
      change: 0,
      chart: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      title: 'Số tiền hợp đồng',
      icon: <FileDoneOutlined style={{ fontSize: 20 }} />,
      value: '0 đ',
      change: 0,
      chart: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      title: 'Số tiền cơ hội',
      icon: <DollarCircleOutlined style={{ fontSize: 20 }} />,
      value: '0 đ',
      change: 0,
      chart: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      title: 'Số tiền công nợ',
      icon: <DollarCircleOutlined style={{ fontSize: 20 }} />,
      value: '0 đ',
      change: 0,
      chart: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      title: 'Ghi chép theo điều',
      icon: <BookOutlined style={{ fontSize: 20 }} />,
      value: '4.724 Điều',
      change: -7.07,
      chart: [5000, 4900, 4800, 4700, 4650, 4600, 4550], // giảm đều
    },
  ];


  return (<div>
    <Row gutter={[16, 16]}>
      {data.map((item, index) => {
        const isPositive = item.change > 0;
        const isZero = item.change === 0;
        const changeColor = isZero ? 'gray' : isPositive ? 'red' : 'green'; // thường tăng là màu đỏ theo ảnh
        const ArrowIcon = isZero ? null : isPositive ? ArrowUpOutlined : ArrowDownOutlined;

        return (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <Card size="small" style={{ height: "100%" }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ marginRight: 8 }}>{item.icon}</div>
                <Text strong>{item.title}</Text>
              </div>
              <Title level={4} style={{ margin: 0 }}>{item.value}</Title>
              <Text type="secondary">So với tháng trước nữa</Text><br />
              {!isZero && (
                <span style={{ color: changeColor, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ArrowIcon />
                  {Math.abs(item.change).toFixed(2)}%
                </span>
              )}
              {isZero && (
                <Text style={{ color: 'gray' }}>0%</Text>
              )}
              {/* Biểu đồ mô phỏng */}

              <MiniLineChart data={item.chart} />
            </Card>
          </Col>
        );
      })}
    </Row>
    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
      <Col md={8} xs={24}>
        <div style={{ width: '100%', background: '#fff', padding: 15, minHeight: 500 }}>
          <h2 style={{ fontSize: 14, fontWeight: 'bold' }}>Hợp đồng số tiền mục tiêu và trạng thái hoàn thành</h2>
          <ChartActivityRevenue activityRevenue={activityRevenue} />
        </div>
      </Col>

      <Col md={8} xs={24}>
        <div style={{ width: '100%', background: '#fff', padding: 15, minHeight: 500 }}>
          <h2 style={{ fontSize: 14, fontWeight: 'bold' }}>Hợp đồng số tiền mục tiêu và trạng thái hoàn thành</h2>
          <ChartSale activityRevenue={activityRevenue} />
        </div>
      </Col>

      <Col md={8} xs={24}>
        <Card
          style={{ height: '100%' }}
          title={
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text strong style={{ fontSize: 16 }}>Tỷ lệ hoàn thành chỉ tiêu hiệu suất</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>Tôi và cấp dưới | Tháng trước</Text>
            </div>
          }
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Select defaultValue="Số tiền công nợ" style={{ width: 180 }}>
              <Option value="Số tiền công nợ">Số tiền công nợ</Option>
              {/* Thêm các lựa chọn khác nếu cần */}
            </Select>
            <Button>Cài đặt mục tiêu</Button>
          </div>

          <div style={{ textAlign: 'left', marginBottom: 16 }}>
            <Title level={2} style={{ margin: 0 }}>20%</Title>
            <Text type="secondary">Tỷ lệ hoàn thành chỉ số</Text>
          </div>

          <Progress percent={20} showInfo={false} />

          <Divider style={{ margin: '16px 0' }} />

          <div>
            <Space style={{ display: 'flex', columnGap: 20, width: '100%' }}>
              <Text style={{ fontWeight: 'bold' }}>Số tiền thực tế</Text>
              <Text strong style={{ fontWeight: 'bold' }}>0 đ</Text>
            </Space>
            <Space style={{ display: 'flex', columnGap: 20, width: '100%', marginTop: 12 }}>
              <Text style={{ fontWeight: 'bold' }}>Doanh số mục tiêu</Text>
              <Text strong style={{ fontWeight: 'bold' }}>0 đ</Text>
            </Space>
          </div>
        </Card>
      </Col>
    </Row>
  </div >
  )
}

export default NewFeed
