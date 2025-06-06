import React, { useState } from 'react'
import { Helmet } from 'react-helmet';

import CustomBreadcrumb from 'components/BreadcrumbCustom';
import UncontrolledBoard from './UncontrolledBoard';


const DragDropOrderPage = () => {
  const [title] = useState("Quy trình đơn hàng");

  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <CustomBreadcrumb
        data={[{ title: 'Trang chủ' }, { title: title }]}
      />
      <UncontrolledBoard/>
    </div>
  )
}

export default DragDropOrderPage
