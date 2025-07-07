import { Tabs } from "antd";
import ORderDetailForm from "./ORderDetailForm";
import OrderPayment from "./OrderPayment";
import { OrderProvider } from "./OrderContext";

const OrderForm = ({ data, title }) => {
  const items = [
    { key: '1', label: 'Chi tiết đơn hàng', children: <ORderDetailForm data={data} title={title}/> },
    /* Chỉ thêm tab "Thanh toán" nếu paid !== total */
    ...(data?.paid !== data?.total
      ? [{ key: '2', label: 'Thanh toán', children: <OrderPayment data={data} title={title}/> }]
      : []
    ),
    { key: '3', label: 'Thông tin công ty', children: '' }
  ];

  return <>
    {/* <Row justify="center">
      <Form.Item 
        noStyle
        shouldUpdate={ (prevValues, curValues) => 
          prevValues.code !== curValues.code || prevValues.name !== curValues.name
        }
      >
        {({ getFieldValue }) => {
          let name = getFieldValue('name');
          let code = getFieldValue('code');
          return (
            <Tag className="code-ch" color="blue">Tên cơ hội: {!name ? (code ?? 'Tạo mới') : name}
              {!name ? <SnippetsOutlined style={{ marginLeft: 5, cursor: 'pointer' }} /> : ""}
            </Tag>
          )
        }}
      </Form.Item>
    </Row> */}
    <OrderProvider data={data}>
      <Tabs defaultActiveKey="1" items={items}/>
    </OrderProvider>
  </>
}

export default OrderForm;