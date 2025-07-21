import React, { useState } from 'react';
import { Tabs } from 'antd';
import { arrayNotEmpty, f5List } from 'utils/dataUtils';
import OrderService from 'services/OrderService';
import { useEffectAsync } from 'hooks/MyHooks';
import OrderPayment from './OrderPayment';
import { DollarOutlined, FileTextOutlined, BankOutlined } from '@ant-design/icons';
import Invoice from './Invoice';

const OrderTabs = ({ data, title }) => {

  const { customerOrder } = data;
  const [ details, setDetails ] = useState([]);
  const [ customer, setCustomer ] = useState();

  useEffectAsync(async (isMounted) => {
    const { customer, data } = await OrderService.getOrderOnEdit(customerOrder.id);
    if(customer) {
      setCustomer(customer);
    }
    if(arrayNotEmpty(data)) {
      setDetails(data);
    }
  }, [customerOrder]);

  const dataInTabs = { details, customer, customerOrder }
  const tabData = [
    {
      key: 'pay',
      label: 'Thanh toán',
      icon: <DollarOutlined />,
      component: <OrderPayment data={{
        ...dataInTabs,
        onSave: (values) => f5List("order/fetch")
      }} />
    },
    {
      key: 'invoice',
      label: 'Hóa đơn',
      icon: <FileTextOutlined />,
      component: <Invoice data={dataInTabs} />
    },
    {
      key: 'company',
      label: 'Thông tin công ty',
      icon: <BankOutlined />,
      component: <span />
    }
  ];

  const items = tabData.map(({ key, icon, label, component }) => ({
    key,
    label: (
      <span> {icon} {label} </span>
    ),
    children: component
  }));
  return <Tabs defaultActiveKey="1" items={items} />;
}

export default OrderTabs;