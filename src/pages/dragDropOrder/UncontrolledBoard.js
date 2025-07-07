import React from 'react'
import Board from "@asseinfo/react-kanban";
import '@asseinfo/react-kanban/dist/styles.css'
import { Button, Col, Row, Tag } from 'antd';
import { useEffect } from 'react';
import RequestUtils from 'utils/RequestUtils';
import { useState } from 'react';
import { formatMoney, formatTime } from 'utils/dataUtils';
import ModaleStyles from 'pages/lead/style';
import FormSelectAPI from 'components/form/FormSelectAPI';
import { InAppEvent } from 'utils/FuseUtils';
import { ContainerStyles } from './style';

const convertData = (data) => {
  return {
    columns: (data?.columns || []).map(column => ({
      id: column.id,
      title: column.title,
      cards: (column.card || []).map(card => ({
        id: card.id,
        title: card.code || "No title",
        description: `${card.customerName || ''} - ${(card.total || 0).toLocaleString()} VNĐ`,
        customerName: card.customerName,    // thêm
        total: card.total,                  // thêm
        createDate: card.createDate,
        status: card.status,
      })),
    })),
  };
};

const UncontrolledBoard = () => {
  const [newOrder, setNewOrder] = useState({});
  const [open, setOpen] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [dataOrder, setDataOrder] = useState([]);
  const [openDetail, setOpenDetail] = useState(false);
  const [refect, setRefect] = useState(false);
  const [detailDataOrder, setDetailDataOrder] = useState({});

  useEffect(() => {
    (async () => {
      const { data } = await RequestUtils.Get(`/order-status/fetch`);
      const order = await RequestUtils.Get(`/order/fetch?limit=10&page=1`);
      const newItem = data?.map(item => {
        const findItem = order?.data?.embedded.filter(f => f.status === item.id);
        const newCard = findItem?.map(f => {
          return {
            id: f?.id,
            code: f?.code,
            total: f?.total,
            customerName: f?.customerReceiverName,
            createDate: f?.createdAt,
            status: item.status
          }
        })
        const newData = {
          id: item.id,
          title: item?.name,
          card: newCard
        }
        return newData;
      })
      const newColumn = { columns: newItem };
      setNewOrder(newColumn);
      setDataOrder(order?.data.embedded);
    })()
  }, [shouldRefetch, refect])

  const converted = convertData(newOrder);

  return (
    <ContainerStyles>
      <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 20 }}>
        <Button onClick={() => setOpen(true)} type="primary">Tạo trạng thái đơn</Button>
      </div>
      <div style={{ border: '1px solid #0088cd', borderRadius: 10 }}>
        <Board
          key={JSON.stringify(converted)}
          initialBoard={converted}
          renderColumnHeader={(column) => {
            const totalCols = converted.columns.length;
            const idx = converted.columns.findIndex(c => c.id === column.id);
            const hue = (idx * 360 / totalCols) % 360;
            const bg = `hsl(${hue}, 80%, 50%)`;
            return (
              <div
                style={{
                  padding: '5px',
                  backgroundColor: bg,
                  marginBottom: 15,
                  borderRadius: 50,
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center', color: '#fff' }}>
                  {column.title}
                </div>
              </div>
            )
          }}
          allowRemoveLane
          allowRenameColumn={false}
          allowRemoveCard
          onLaneRemove={console.log}
          onCardRemove={console.log}
          renderCard={(card, { dragging }) => {
            const date = formatTime(card.createDate);
            return (
              <div>
                <div
                  style={{
                    position: 'relative',
                    width: '250px',
                    padding: 12,
                    background: dragging ? '#f0f8ff' : 'white',
                    borderRadius: 8,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    marginBottom: 8
                  }}
                  onClick={() => {
                    const findItem = dataOrder.find(f => f.id === card.id);
                    setOpenDetail(true);
                    setDetailDataOrder(findItem)
                  }}
                >
                  <h4>{card.title}</h4>
                  <p style={{ fontSize: 12, color: '#333', margin: 0, padding: 0 }}>
                    Khách hàng: <strong>{card.customerName}</strong>
                  </p>
                  <p style={{ fontSize: 12, color: '#333', margin: 0, padding: 0 }}>
                    Tổng: <strong>{formatMoney(card.total)}</strong>
                  </p>
                  <p style={{ fontSize: 12, color: '#666', margin: 0, padding: 0 }}>
                    Ngày tạo: {date}
                  </p>
                  {/* <p style={{ fontSize: 12, color: '#666', margin: 0, padding: 0 }}>
                    Trạng thái: {card?.status}
                  </p> */}
                  {/* Khung hover hiển thị */}
                </div>
              </div>
            );
          }}
          onNewCardConfirm={draftCard => ({
            id: new Date().getTime(),
            ...draftCard
          })}
          onCardNew={console.log}
          onCardDragEnd={async (card, source, destination, column) => {
            const orderId = source.id;
            const statusId = column.toColumnId;
            const findOrder = newOrder?.columns?.find(f => f.id === statusId);
            try {
              setRefect(true)
              const data = await RequestUtils.Post(`/customer-order/update-status-order?orderId=${orderId}&statusId=${statusId}`, '');
              if (data.errorCode === 200) {
                setRefect(false)
                return InAppEvent.normalSuccess(`Chuyển đơn hàng ${source?.title} sang trạng thái ${findOrder?.title} thành công!`);
              }
            } catch (error) {
              console.log(error);
            }
          }}
        />
      </div>
      <ModaleStyles title={
        <div style={{ color: '#fff' }}>
          Tạo trạng thái đơn hàng
        </div>
      } open={open} footer={false} onCancel={() => setOpen(false)}>
        <div style={{ padding: 15 }}>
          <FormSelectAPI
            required
            apiPath='order-status/fetch'
            apiAddNewItem='order-status/save'
            onData={(data) => data ?? []}
            label=""
            title="Trạng thái đơn hàng"
            name="name"
            placeholder="Trạng thái"
            keyCheck={true}
            setShouldRefetch={setShouldRefetch}
          />
        </div>
      </ModaleStyles>

      <ModaleStyles title={
        <div style={{ color: '#fff' }}>
          Chi tiết đơn hàng {detailDataOrder?.code}
        </div>
      } open={openDetail} footer={false} onCancel={() => {
        setDetailDataOrder({});
        setOpenDetail(false)
      }}>
        <div style={{ padding: 15 }}>
          {detailDataOrder?.details?.map(item => {
            const newDetailStatus = newOrder?.columns.find(f => f.id === detailDataOrder?.status);
            return (
              <Row>
                <Col md={12} sm={24}>
                  <p>Mã đơn: <span>{item?.code}</span></p>
                </Col>
                <Col md={12} sm={24}>
                  <p><span> <Tag color="#f50">Trạng thái: {newDetailStatus?.title}</Tag></span></p>
                </Col>
                <Col md={12} sm={24}>
                  <p>Ngày tạo: <span>{item?.createdAt}</span></p>
                </Col>
                <Col md={12} sm={24}>
                  <p>Tiền: <span>{formatMoney(item?.total)}</span></p>
                </Col>
              </Row>
            )
          })}
          <hr />
          <p style={{ fontSize: 14, fontWeight: 700 }}>Danh sách đơn:</p>
          <p>
            Tên sản phẩm:{" "}
            {(detailDataOrder?.details ?? []).map(detail =>
              (detail?.items ?? []).map(item =>
                `${item?.name}, Số lượng ${item?.quantity}`
              )
            )
              .flat()
              .join("; ")}
          </p>
          <hr />
          <p style={{ fontSize: 14, fontWeight: 700 }}>Thông tin thanh toán</p>
          <Row>
            <Col md={12} sm={24}>
              <p>Tên KH: <span>{detailDataOrder?.customerReceiverName}</span></p>
            </Col>
            <Col md={12} sm={24}>
              <p>SĐT: <span>{detailDataOrder?.customerMobilePhone}</span></p>
            </Col>
            <Col md={12} sm={24}>
              <p>Email: <span>{detailDataOrder?.customerEmail}</span></p>
            </Col>
            <Col md={12} sm={24}>
              <p>Địa chỉ: <span>{detailDataOrder?.customerAddress || 'N/A'}</span></p>
            </Col>
             <Col md={12} sm={24}>
              <p>Ghi chú: <span>{detailDataOrder?.customerNote || 'N/A'}</span></p>
            </Col>
             <Col md={12} sm={24}>
              <p>Tổng tiền: <span>{formatMoney(detailDataOrder?.total)}</span></p>
            </Col>
             <Col md={12} sm={24}>
              <p>Đã thanh toán: <span>{formatMoney(detailDataOrder?.paid)}</span></p>
            </Col>
          </Row>
        </div>
      </ModaleStyles>
    </ContainerStyles>
  )
}

export default UncontrolledBoard
