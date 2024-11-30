import React from 'react';
import { Row, Col } from 'antd';
import { GiftTwoTone, StrikethroughOutlined } from "@ant-design/icons";
import SkuView, { PriceView } from './SkuView';

const ProductSumary = ({ data }) => {
  return (
    <div className="lead__info">
      <div style={{height: 10}}></div>
      <p><strong>Thông tin sản phẩm</strong></p>
      <div className="line-dash"></div>
      <Row gutter={24} style={{marginTop: 10}}>
        <Col span={12}>
          <p>Sản phẩm: {data?.name}</p>
        </Col>
        <Col span={12}>
          <p>Mã S/P: {data?.code}</p>
        </Col>
      </Row>
      <Row gutter={24} style={{marginTop: 10}}>
        <Col span={12}>
          <p><GiftTwoTone style={{fontSize: 20}} /> SKUS</p>
          <SkuView skus={data?.skus ?? []}/>
        </Col>
        <Col span={12}>
          <p><StrikethroughOutlined style={{fontSize: 20}}/> Giá bán</p>
          <PriceView skus={data?.skus ?? []}/>
        </Col>
      </Row>
    </div>
  )
}

export default ProductSumary;