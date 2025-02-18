import React, { useEffect, useState } from 'react';
import { PhoneOutlined, MailOutlined, UserAddOutlined, FacebookOutlined, AimOutlined, FundOutlined} from '@ant-design/icons';
import { Col, Row, Table, Tabs } from 'antd';
import RequestUtils from 'utils/RequestUtils';
import { columnsTake, TableColumnInteract } from './ColumTable';

const newDataCare = (dataCares, data) => {
  const newData = dataCares?.map(item => {
    return {
      ...item, 
      newIntime: data?.inTime
    }
  });
  return newData
}

const TakeLead = ({ data }) => {
  const [customer, setCustomer] = useState({});
 
  useEffect(() => {
    (async () => {
      const customerData = await RequestUtils.Get(`/customer/find-by-phone?phone=${data?.customerMobile}&withOrder=withOrder`);
      setCustomer(customerData?.data);
    })()
  }, [data])

  return <>
      <div>
        <div style={{ height: 30 }}></div>
        <p>
          <strong>Thông tin khách hàng</strong>
        </p>
        <div class="group-inan" style={{ background: '#f4f4f4', borderTop: '1px dashed red' }}></div>
        <Row style={{ marginTop: 20 }}>
          <Col span={12}>
            <p>
              <span style={{ marginRight: 10 }}><PhoneOutlined /></span>
              <span>Số điện thoại: {customer?.iCustomer?.mobile}</span>
            </p>
          </Col>
          <Col span={12}>
            <p>
              <span style={{ marginRight: 10 }}><MailOutlined /></span>
              <span>Email: {customer?.iCustomer?.email}</span>
            </p>
          </Col>
        </Row>
        <Row style={{ marginTop: 15 }}>
          <Col span={12}>
            <p>
              <span style={{ marginRight: 10 }}><UserAddOutlined /></span>
              <span>User: {customer?.iCustomer?.name}</span>
            </p>
          </Col>
          <Col span={12}>
            <p>
              <span style={{ marginRight: 10 }}><FacebookOutlined /></span>
              <span>Facebook: {customer?.iCustomer?.facebookId || 'N/A'}</span>
            </p>
          </Col>
        </Row>
        <Row style={{ marginTop: 15 }}>
          <Col span={12}>
            <p>
              <span style={{ marginRight: 10 }}><AimOutlined /></span>
              <span>Tỉnh T/P: {customer?.iCustomer?.address || 'Chưa cập nhật'}</span>
            </p>
          </Col>
          <Col span={12}>
          </Col>
        </Row>
        <div style={{ height: 20 }}></div>
        <p>
          <strong>Lịch sửa khách hàng</strong>
        </p>
        <div class="group-inan" style={{ background: '#f4f4f4', borderTop: '1px dashed red' }}></div>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              label: <div style={{fontSize: 12, fontWeight: 500 }}><FundOutlined style={{ paddingRight: 8}}/>CHƯA CHĂM SÓC</div>,
              key: '1',
              children: <Table dataSource={newDataCare(customer?.dataCares, data)} pagination={false} columns={columnsTake} />,
            },
            {
              label: <div style={{fontSize: 12,  fontWeight: 500 }}><FundOutlined style={{paddingRight: 8}}/>L/S TƯƠNG TÁC</div>,
              key: '2',
              children: <Table style={{marginBottom: 20}} dataSource={customer?.lichSuTuongTac} pagination={false} columns={TableColumnInteract()} />,
            },
            {
              label: <div style={{fontSize: 12, fontWeight: 500 }}><FundOutlined style={{paddingRight: 8}}/>ĐƠN CHƯA H/T</div>,
              key: '3',
              children: '',
            },
          ]}
        />
      </div>
  </>
}

export default TakeLead;