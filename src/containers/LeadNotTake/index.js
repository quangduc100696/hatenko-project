import React, { useEffect, useState } from 'react';
import RestEditModal from 'components/RestLayout/RestEditModal';
import { PhoneOutlined, MailOutlined, UserAddOutlined, FacebookOutlined, AimOutlined, FundOutlined} from '@ant-design/icons';
import ProductForm from './ProductForm';
import RequestUtils from 'utils/RequestUtils';
import { InAppEvent } from 'utils/FuseUtils';
import { HASH_MODAL_CLOSE } from 'configs';
import { Col, Row, Table, Tabs } from 'antd';
import { columnsTake, TableColumnInteract, TableColumnOrderUnfinished } from './ColumTable';
import { f5List } from 'utils/dataUtils';

const log = (value) => console.log('[container.product.index] ', value);
const TakeNotLead = ({ closeModal, title, data }) => {
  const [record, setRecord] = useState({});
  const [customer, setCustomer] = useState({});
  useEffect(() => {
    (async () => {
      const customerData = await RequestUtils.Get(`/customer/find-by-phone?phone=${data?.customerMobile}&withOrder=withOrder`);
      setCustomer(customerData?.data);
    })()
  }, [data])

  const onSubmit = async (dataCreate) => {
    log(data);
    const customerData = await RequestUtils.Get(`/customer/find-by-phone?phone=${data?.customerMobile}&withOrder=withOrder`)
    const params = {
      customerId: customerData?.data?.iCustomer?.id,
      sale: data?.saleId,
      type: 'lead',
      dataId: data?.id,
      ...dataCreate,
    }
    const newData = await RequestUtils.Post('/data/create-lead-care', params);
    if (newData?.errorCode === 200) {
      f5List('data/not-taken-care');
      InAppEvent.normalSuccess("Cập nhật thành công");
      InAppEvent.emit(HASH_MODAL_CLOSE);
    }
  }
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
              children: <Table dataSource={customer?.dataCares} pagination={false} columns={columnsTake} />,
            },
            {
              label: <div style={{fontSize: 12,  fontWeight: 500 }}><FundOutlined style={{paddingRight: 8}}/>L/S TƯƠNG TÁC</div>,
              key: '2',
              children: <Table style={{marginBottom: 20}} dataSource={customer?.lichSuTuongTac} pagination={false} columns={TableColumnInteract()} />,
            },
            {
              label: <div style={{fontSize: 12, fontWeight: 500 }}><FundOutlined style={{paddingRight: 8}}/>ĐƠN CHƯA H/T</div>,
              key: '3',
               children: <Table style={{ marginBottom: 20 }} dataSource={customer?.donChuaHoanThanh} pagination={false} columns={TableColumnOrderUnfinished} />,
            },
          ]}
        />
      </div>
      <div style={{ height: 20 }}></div>
        <p>
          <strong>Cập nhật tương tác mới</strong>
        </p>
      <div class="group-inan" style={{ background: '#f4f4f4', borderTop: '1px dashed red' }}></div>
      <RestEditModal
        isMergeRecordOnSubmit={false}
        updateRecord={(values) => setRecord(curvals => ({ ...curvals, ...values }))}
        onSubmit={onSubmit}
        record={record}
        closeModal={closeModal}
      >
        <ProductForm />
      </RestEditModal>
  </>
}

export default TakeNotLead;