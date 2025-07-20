import React, { useRef, useState } from 'react';
import { Layout, Row, Col, Table, Typography } from 'antd';
import OrderTextTableOnly from './OrderTextTableOnly';
import { useReactToPrint } from "react-to-print";
import CustomButton from 'components/CustomButton';
import styled from "styled-components";
import { formatMoney } from 'utils/dataUtils';
import { formatPhoneNumber } from 'utils/tools';
import { useEffectAsync } from 'hooks/MyHooks';
import UserService from 'services/UserService';

const { Title, Text } = Typography;
const StyledHeader = styled(Layout)`
	.logo {
		border-right: 2px solid rgb(249, 199, 39);
    height: 100px;
    align-items: center;
    display: flex;
	}
	.company {
		text-align: left;
		margin-left: 20px;
	}
	.contact {
		margin-top: 10px;
	}
	.left20 {
		margin-left: 20px;
	}
	.title {
		margin-bottom: 20px;
		color: #1890ff;
	}
`;

const InvoicePage = ({
	customer,
	customerOrder
}) => {
	const { userCreateId } = customerOrder;
	const [ user, setUser ] = useState();

	useEffectAsync(async () => {
		const [ error, data ] = await UserService.findId(userCreateId);
		if(!error) {
			setUser(data);
		}
	}, [userCreateId]);

  return (
    <StyledHeader style={{background: '#fff', marginBottom: 40}}>
      <Row justify="start" align="middle">
        <Col span={7} className='logo'>
          <img
            src="/logo.png"
            alt="Logo"
            style={{ maxHeight: 40, width: 'auto' }}
          />
        </Col>
        <Col span={14} className='company'>
          <p><strong>CÔNG TY CỔ PHẦN FLAST SOLUTUON</strong></p>
					<div className='contact'>
						<Text>Hà Nội: Số 35 Lê Văn Lương, Thanh Xuân, TP.Hà Nội</Text>
						<Row justify="start" style={{ marginTop: '10px' }}>
							<Text>(0987) 938-491</Text>
							<Text className='left20'>flast.vn@printgo.vn</Text>
							<Text className='left20'>www.flast.vn</Text>
						</Row>
					</div>
        </Col>
      </Row>

      <Title level={3} style={{ textAlign: 'center', marginTop: '20px' }}>
        HÓA ĐƠN BÁN HÀNG
      </Title>

      <Row gutter={4} style={{ marginTop: '20px' }}>
        <Col span={12}>
          <p className='title'>THÔNG TIN KHÁCH HÀNG</p>
          <Table
						showHeader={false}
            dataSource={[
              { key: '1', label: 'Công ty:', value: customer.companyName || 'N/A' },
              { key: '2', label: 'Địa chỉ:', value: customer.address || '' },
              { key: '3', label: 'Số điện thoại:', value: formatPhoneNumber(customer.mobile) },
              { key: '4', label: 'Người liên hệ:', value: customer.name }
            ]}
            columns={[
              { dataIndex: 'label', key: 'label' },
              { dataIndex: 'value', key: 'value' }
            ]}
            pagination={false}
            bordered
          />
        </Col>
        <Col span={12}>
          <p className='title'>
            THÔNG TIN ĐẠI DIỆN
          </p>
          <Table
						showHeader={false}
            dataSource={[
              { key: '1', label: 'Bộ phận:', value: 'Phòng kinh doanh' },
              { key: '2', label: 'Đại diện:', value: user?.ssoId },
              { key: '3', label: 'Số điện thoại:', value: formatPhoneNumber(user?.phone) },
              { key: '4', label: 'Email:', value: user?.email }
            ]}
            columns={[
              { dataIndex: 'label', key: 'label' },
              { dataIndex: 'value', key: 'value' }
            ]}
            pagination={false}
            bordered
          />
        </Col>
      </Row>
    </StyledHeader>
  )
};

const Invoice = ({ data }) => {

	const contentRef = useRef();
	const reactToPrintFn = useReactToPrint({ contentRef });

	const { customer, details, customerOrder } = data;
	const monneyVAT = customerOrder.subtotal * (customerOrder.vat || 0) / 100;

	return <>
		<div ref={contentRef} style={{ padding: 25, marginTop: 20 }}>
			<InvoicePage 
				customer={customer}
				customerOrder={customerOrder}
			/>
			<p><strong>Đơn hàng #{customerOrder?.code || ''}</strong></p>
			<OrderTextTableOnly details={details} />
			<table
				id="pay__order__info"
				cellSpacing={0}
				cellPadding={0}
				border={0}
				width="100%"
				style={{ textAlign: "right", marginTop: 30 }}
			>
				<tbody>
					<tr id="tpri">
						<td align="right" width="70%" style={{ padding: "4px 12px" }}>
							Tổng chi phí:
						</td>
						<td className="total" width="30%" style={{ padding: "4px 12px" }}>
							{formatMoney(customerOrder.subtotal)}
						</td>
					</tr>
					<tr>
						<td align="right" width="70%" style={{ padding: "4px 12px" }}>
							Chiết khấu:
						</td>
						<td className="ck" width="30%" style={{ padding: "4px 12px" }}>
							{formatMoney(customerOrder.priceOff)}
						</td>
					</tr>
					<tr>
						<td align="right" width="70%" style={{ padding: "4px 12px" }}>
							Phí vận chuyển:
						</td>
						<td width="30%" style={{ padding: "4px 12px" }}>
							{formatMoney(customerOrder.shippingCost)}
						</td>
					</tr>
					<tr>
						<td align="right" width="70%" style={{ padding: "4px 12px" }}>
							Phí VAT:
						</td>
						<td className="vt" width="30%" style={{ padding: "4px 12px" }}>
							{formatMoney(monneyVAT)}
						</td>
					</tr>
					<tr id="vorh">
						<td align="right" width="70%" style={{ padding: "12px 12px 0" }}>
							<b>Tổng thanh toán:</b>
						</td>
						<td className="total" width="30%" style={{ padding: "12px 12px 0" }}>
							<div style={{ fontSize: 16, fontWeight: 700 }}>{formatMoney(customerOrder.total)}</div>
						</td>
					</tr>
				</tbody>
			</table>
			<Row justify="space-between" style={{ marginTop: '40px', padding: '10px 0' }}>
				<Col style={{textAlign: 'center'}} span={8}>
					<Text strong>Khách hàng</Text>
				</Col>
				<Col span={8} offset={8}>
					<Text strong>Người lập hóa đơn</Text>
					<div style={{height: 100}} />
					<Text style={{ display: 'block', marginTop: '5px' }}>Ngày .... tháng .... năm 202..</Text>
				</Col>
			</Row>
		</div>
		<div style={{ display: 'flex', justifyContent: 'end', marginTop: 20 }}>
			<CustomButton onClick={reactToPrintFn} title="In PDF"/>
		</div>
	</>
}

export default Invoice;