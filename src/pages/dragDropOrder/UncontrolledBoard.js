import React from 'react'
import Board from "@asseinfo/react-kanban";
import '@asseinfo/react-kanban/dist/styles.css'
import { Button, Col, Row } from 'antd';
import { useEffect } from 'react';
import RequestUtils from 'utils/RequestUtils';
import { useState } from 'react';
import { formatMoney, formatTime } from 'utils/dataUtils';

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
      const newColumn = { columns: newItem }
      setNewOrder(newColumn)
    })()
  }, [])

  const converted = convertData(newOrder);

  return (
    <div style={{border: '1px solid #0088cd', borderRadius: 10}}>
      <Board
        key={JSON.stringify(converted)}    // mỗi lần data mới, React unmount/remount
        initialBoard={converted}
        allowRemoveLane
        allowRenameColumn={false}
        allowRemoveCard
        onLaneRemove={console.log}
        onCardRemove={console.log}
        allowAddCard={{ on: "top" }}
        renderCard={(card, { dragging }) => {
          const date = formatTime(card.createDate);
          return (
            <div
              style={{
                width: '250px',
                padding: 12,
                background: dragging ? '#f0f8ff' : 'white',
                borderRadius: 8,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: 8
              }}
            >
              <h4>{card.title}</h4>
              <p style={{fontSize: 12, color: '#333', margin: 0, padding: 0 }}>
                Khách hàng: <strong>{card.customerName}</strong>
              </p>
              <p style={{fontSize: 12, color: '#333',  margin: 0, padding: 0 }}>
                Tổng: <strong>{formatMoney(card.total)}</strong>
              </p>
              <p style={{ margin: 0, fontSize: 12, color: '#666',  margin: 0, padding: 0 }}>
                Ngày tạo: {date}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: '#666',  margin: 0, padding: 0 }}>
                Trạng thái: {card?.status}
              </p>
            </div>
          );
        }}
        onNewCardConfirm={draftCard => ({
          id: new Date().getTime(),
          ...draftCard
        })}
        onCardNew={console.log}
      />

    </div>
  )
}

export default UncontrolledBoard
