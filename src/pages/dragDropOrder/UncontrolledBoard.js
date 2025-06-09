import React from 'react'
import Board from "@asseinfo/react-kanban";
import '@asseinfo/react-kanban/dist/styles.css'
import { Button } from 'antd';
import { useEffect } from 'react';
import RequestUtils from 'utils/RequestUtils';
import { useState } from 'react';
import { formatMoney, formatTime } from 'utils/dataUtils';
// import { FlastAi } from 'flast-chat';
import ModaleStyles from 'pages/lead/style';
import FormSelectAPI from 'components/form/FormSelectAPI';

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
  const [hoveredCardId, setHoveredCardId] = useState(null);


  // useEffect(() => {
  //   try {
  //     const FLAST_KEY = String("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.")
  //       .concat("eyJhdWQiOiJhaWN1YXR1aS52biIsImJJZCI6MiwiZXhwIjoxNzUzMzUxMjEwLCJpYXQiOjE3NDgxNjcyMTAsImlkIjoxLCJpc3MiOiJhaWN1YXR1aS52biIsIm5iZiI6MTc0ODE2NzIxMH0.")
  //       .concat("QHG7r4HNEFOL5eV7koVezd34kou13tNjBudgMff3Ino");
  //     FlastAi.loadConfigWithApiKey(FLAST_KEY).then((mUser) => {
  //       FlastAi.connect();
  //     });
  //     FlastAi.addEventListener("notify", (data) => {
  //       const path = window.location.pathname;
  //       if (path.startsWith("/data/chat") || !data.uuid) {
  //         return;
  //       }
  //       const num = FlastAi.incrementCountMessageUnread(data.uuid);
  //       console.log(num);

  //     });
  //   } catch (e) {
  //     console.error('[src.layouts.DbaLayout]', e.message);
  //   }
  //   return () => FlastAi.close();
  // }, []);


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
  }, [shouldRefetch])

  const converted = convertData(newOrder);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 20 }}>
        <Button onClick={() => setOpen(true)}>Tạo trạng thái đơn</Button>
      </div>
      <div style={{ border: '1px solid #0088cd', borderRadius: 10 }}>
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
            const isHovered = hoveredCardId === card.id;
            const date = formatTime(card.createDate);
            return (
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
                onMouseEnter={() => setHoveredCardId(card.id)}
                onMouseLeave={() => setHoveredCardId(null)}
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
                <p style={{ fontSize: 12, color: '#666', margin: 0, padding: 0 }}>
                  Trạng thái: {card?.status}
                </p>
                {/* Khung hover hiển thị */}
                {isHovered && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '97%',
                      marginLeft: 12,
                      width: 200,
                      background: '#fffbe6',
                      border: '1px solid #ffe58f',
                      borderRadius: 8,
                      padding: 8,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      zIndex: 9999
                    }}
                  >
                    <p style={{ fontSize: 12, margin: 0, paddingBottom: 5 }}>📌 Ghi chú thêm</p>
                    <p style={{ fontSize: 12, color: '#333', margin: 0, padding: 0 }}>
                      Tổng: <strong>{formatMoney(card.total)}</strong>
                    </p>
                    <p style={{ fontSize: 12, color: '#666', margin: 0, padding: 0 }}>
                      Ngày tạo: {date}
                    </p>
                    <p style={{ fontSize: 12, margin: 0 }}>{card?.note || "Không có ghi chú"}</p>
                  </div>
                )}
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
    </div>
  )
}

export default UncontrolledBoard
