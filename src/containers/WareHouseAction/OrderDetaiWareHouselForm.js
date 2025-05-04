import { Form, Image, Table } from 'antd'
import CustomButton from 'components/CustomButton';
import FormInput from 'components/form/FormInput';
import { GATEWAY, HASH_MODAL_CLOSE } from 'configs';
import React from 'react'
import { dateFormatOnSubmit, f5List, formatMoney } from 'utils/dataUtils';
import { InAppEvent } from 'utils/FuseUtils';
import RequestUtils from 'utils/RequestUtils';

const OrderDetaiWareHouselForm = ({ title, data }) => {


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
    const newItem = data.items[0]?.detaiItems.map(item => {
      return {
        productId: item?.productId,
        warehouseId: item?.warehouseId,
        quantity: item?.quantity,
        skuId: item?.skuId,
        sku_info: item?.sku_info
      }
    })
    const params = {
      warehouseDeliveryId: data?.warehouseDeliveryId,
      warehouseReceivingId: data?.warehouseReceivingId,
      status: data?.status,
      note: !data?.note ? value?.note : data?.note,
      items: newItem
    }
    const item = await RequestUtils.Post('/warehouse-export/created-not-order', params);
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
        <p style={{ fontWeight: 700, margin: 0, padding: 0 }}>Thông tin sản phẩm</p><br />
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
        </div>
      </Form>
    </div>
  )
}

export default OrderDetaiWareHouselForm
