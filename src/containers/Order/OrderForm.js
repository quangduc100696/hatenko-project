import { Form, Tag, Tabs, Row } from "antd";
import { SnippetsOutlined } from '@ant-design/icons';
import ORderDetailForm from "./ORderDetailForm";
import ORderPaymentForm from "./ORderPaymentForm";

const OrderForm = () => {
  const items = [
    { key: '1', label: 'Chi tiết đơn hàng', children: <ORderDetailForm />},
    { key: '2', label: 'Thanh toán', children: <ORderPaymentForm /> },
    { key: '3', label: 'Thông tin công ty', children: '' }
  ];
  return <>
    <Row justify="center">
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
    </Row>
    <Tabs defaultActiveKey="1" items={items}/>
  </>
}

export default OrderForm;