import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import ListOrder from 'containers/Order/List';

const CoHoiPage = () => {
  const [ title ] = useState("Danh sách cơ hội bán hàng");
  const filter = { type: "cohoi"}
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

export default CoHoiPage;