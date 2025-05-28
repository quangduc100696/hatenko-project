import { Col, Form, Image, Row, Table } from 'antd'
import CustomButton from 'components/CustomButton';
import FormHidden from 'components/form/FormHidden';
import FormInput from 'components/form/FormInput';
import FormInputNumber from 'components/form/FormInputNumber';
import FormSelect from 'components/form/FormSelect';
import FormTextArea from 'components/form/FormTextArea';
import { GATEWAY, HASH_MODAL_CLOSE } from 'configs';
import React, { useEffect, useState } from 'react'
import { dateFormatOnSubmit, f5List, formatMoney } from 'utils/dataUtils';
import { InAppEvent } from 'utils/FuseUtils';
import RequestUtils from 'utils/RequestUtils';

const OrderDetaiWareHouselForm = ({ title, data }) => {
  const [province, setProvince] = useState([]);
  const [shipStatus, setShipStatus] = useState([]);
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await RequestUtils.Get(`/province/find`);
      /* Lấy danh sách theo id và name */
      const newData = data.map(f => {
        return { id: f?.id, name: f?.name }
      })
      const shipData = await RequestUtils.Get('/shipping/fetch-status');
      const stockData = await RequestUtils.Get(`/warehouse/fetch-stock`)
      setShipStatus(shipData?.data);
      setStockData(stockData?.data)
      setProvince(newData);
    })()
  }, [data])

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ngày tạo',
      render: (record) => {
        return (
          <div>{dateFormatOnSubmit(record?.createdAt)}</div>
        )
      }
    },
    {
      title: 'Đơn giá',
      render: (record) => {
        return (
          <div>{formatMoney(record.price)}</div>
        )
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      render: (record) => {
        return (
          <div>{record?.quantity || 'N/A'}</div>
        )
      },
    },
    {
      title: 'SKU',
      render: (item) => {
        let parsedSkuInfo = [];
        try {
          if (item?.skuInfo) {
            parsedSkuInfo = JSON.parse(item?.skuInfo);
          }
        } catch (error) {
          console.error("Lỗi parse JSON:", error);
        }
        return (
          <>
            <p style={{ marginRight: "10px" }}>
              <strong>{parsedSkuInfo[0]?.name}:</strong> {parsedSkuInfo[1]?.value}...
            </p>
          </>
        );
      }
    },
    {
      title: 'Thành tiền',
      render: (item) => {
        return (
          <div>
            {formatMoney(item.total)}
          </div>
        );
      }
    }
  ];

  const onHandleCreateOdder = async (value) => {
    const params = {
      id: data?.id,
      stockId: value?.stockId,
      orderCode: data?.orderCode || "",
      customerPhone: value?.customerPhone,
      customerName: value?.customerName,
      warehouseId: value?.stockId,
      productId: value?.productId || '',
      userName: value?.userName,
      transporterId: Number(value?.transporterId),
      transporterName: value?.transporterName,
      transporterCode: value?.transporterCode,
      fee: value?.fee,
      cod: value?.cod,
      quality: value?.quality,
      provinceId: Number(value?.provinceId),
      districtId: Number(value?.provinceIdistrictIdd),
      wardId: Number(value?.wardId),
      address: value?.address,
      status: value?.status
    }
    const item = await RequestUtils.Post('/shipping/created', params);
    if (item?.errorCode === 200) {
      f5List('warehouse-export/fetch');
      InAppEvent.emit(HASH_MODAL_CLOSE);
      return InAppEvent.normalSuccess('Cập nhập thành công')
    } else {
      return InAppEvent.normalError('Cập nhập thất bại')
    }
  }

  return (
    <div>
      <Form onFinish={onHandleCreateOdder} layout="vertical">
        {/* <p style={{ fontWeight: 700, margin: 0, padding: 0 }}>Thông tin sản phẩm</p><br />
        <div class="group-inan" style={{ background: '#f4f4f4', borderTop: '1px dashed red', marginBottom: 20 }}></div>
        <Table
          columns={columns}
          scroll={{ x: 1700 }}
          dataSource={data?.items[0]?.detaiItems}
          pagination={false}
        />
        <FormInput
          required={false}
          name="note"
          label="Note khách hàng"
          placeholder="Note khách hàng"
        />
        <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 50 }}>
          <CustomButton title="Tạo đơn" htmlType="submit" />
        </div> */}
        <Row gutter={16} style={{ marginTop: 20 }}>
          <FormHidden name={'id'} />
          <Col md={24} xs={24}>
            <FormInput
              required
              label="Họ tên"
              name="customerName"
              placeholder={"Nhập họ tên"}
            />
          </Col>
          <Col md={12} xs={24}>
            <FormInput
              required
              label="Số điện thoại"
              name="customerPhone"
              placeholder={"Số điện thoại"}
            />
          </Col>
          <Col md={12} xs={24}>
            <FormInput
              required={false}
              label="Địa chỉ"
              name="address"
              placeholder={"Địa chỉ"}
            />
          </Col>
          <Col md={12} xs={24}>
            <FormSelect
              required
              name="provinceId"
              label="Tỉnh / TP"
              placeholder="Chọn Tỉnh / TP"
              resourceData={province || []}
              valueProp="id"
              titleProp="name"
            />
          </Col>
          <Col md={12} xs={24}>
            <FormInput
              required={false}
              label="Quận"
              name="districtId"
              placeholder={"Quận"}
            />
          </Col>
          <Col md={12} xs={24}>
            <FormInput
              required={false}
              label="Xã"
              name="wardId"
              placeholder={"Xã"}
            />
          </Col>
          <Col md={12} xs={24}>
            <FormInput
              required={false}
              label="Tên tài khoản"
              name="userName"
              placeholder={"Tên tài khoản"}
            />
          </Col>
          <Col md={12} xs={24}>
            <FormInput
              required={false}
              label="Tên người vận chuyển"
              name="transporterName"
              placeholder={"Tên người vận chuyển"}
            />
          </Col>
          <Col md={12} xs={24}>
            <FormInput
              required={false}
              label="Id vận chuyển"
              name="transporterId"
              placeholder={"Id vận chuyển"}
            />
          </Col>
          <Col md={12} xs={24}>
            <FormInput
              required={false}
              label="Mã vận chuyển"
              name="transporterCode"
              placeholder={"Mã vận chuyển"}
            />
          </Col>
          <Col md={12} xs={24}>
            <FormInputNumber
              required={false}
              label="Phí"
              name="fee"
              placeholder={"Phí"}
            />
          </Col>
          <Col md={12} xs={24}>
            <FormInputNumber
              required={false}
              label="Tiền hàng"
              name="cod"
              placeholder={"Tiền hàng"}
            />
          </Col>
          <Col md={12} xs={24}>
            <FormInputNumber
              required={false}
              label="Số lượng"
              name="quality"
              placeholder={"Số lượng"}
            />
          </Col>
          <Col md={12} xs={24}>
            <FormSelect
              required
              name="status"
              label="Trạng thái"
              placeholder="Trạng thái"
              resourceData={shipStatus || []}
              valueProp="id"
              titleProp="name"
            />
          </Col>
          <Col md={12} xs={24}>
            <FormSelect
              required
              name="stockId"
              label="Kho Hàng"
              placeholder="Kho Hàng"
              resourceData={stockData || []}
              valueProp="id"
              titleProp="name"
            />
          </Col>
          {/* <Col md={24} xs={24}>
            <FormSelect
              required
              name="source"
              label="Nguồn"
              placeholder="Chọn Nguồn"
              resourceData={resourceData || []}
              valueProp="id"
              titleProp="name"
            />
          </Col> */}
          <Col md={24} xs={24}>
            <div style={{ display: 'flex', marginBottom: 20, justifyContent: 'end' }}>
              <CustomButton
                htmlType="submit"
                title="Hoàn thành"
                color="danger"
                variant="solid"
              />
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default OrderDetaiWareHouselForm
