import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import ListOrder from 'containers/Order/List';

const OrderPage = () => {
  const [ title ] = useState("Danh sách đơn hàng");
  const filter = { type: "order"}
  return <>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    <CustomBreadcrumb
      data={[{ title: 'Trang chủ' }, { title: title }]}
    />
    <ListOrder filter={filter} />
  </>
};

export default OrderPage;