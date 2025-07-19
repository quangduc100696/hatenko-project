import React from 'react';
import { Table, Typography } from "antd";
import styled from "styled-components";
const { Text } = Typography;

const COL_SPAN_0 = { props:{ colSpan: 0}};
const COL_SPAN_4 = { props:{ colSpan: 4}};

const StyledTable = styled.div`
	.main-row td:first-child {
		position: relative;
	}

	/* Đường viền nằm dưới cùng của ô STT (dưới dòng phụ) */
	.main-row td:first-child::after {
		content: "";
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		border-bottom: 1px solid #d9d9d9;
	}
`;

const OrderTextTableOnly = () => {
	const rawData = [
		{
			key: "1",
			tenSanPham: "Tem nhãn",
			soLuong: 1000,
			donGia: 780,
			thanhTien: 780000
		},
		{
			key: "2",
			tenSanPham: "Tem nhãn",
			soLuong: 500,
			donGia: 1040,
			thanhTien: 520000
		}
	];

	let data = rawData.flatMap((item, index) => [
		{ ...item, isNoiDungMoRong: false, key: `${item.key}-main` },
		{
			isNoiDungMoRong: true,
			key: `${item.key}-sub`,
			content: "Ngày dự kiến sản xuất xong: 09-07-2025, Ngày dự kiến sản xuất xong: 09-07-2025, Ngày dự kiến sản xuất xong: 09-07-2025",
		}
	]);
	
	const columns = [
		{
			title: "STT",
			dataIndex: "key",
			width: 60,
			align: "center",
			render: (_, record, index) => {
				if (record.isNoiDungMoRong) {
					return { children: null, ...COL_SPAN_0 };
				}
				return {
					children: Math.floor(index / 2) + 1,
					props: { rowSpan: 2 }
				};
			}
		},
		{
			title: "Nội dung",
			key: "noidung",
			render: (_, record) => {
				if (record.isNoiDungMoRong) {
					return {
						children: <Text type="secondary">{record.content}</Text>,
						...COL_SPAN_4
					};
				}
				return (
					<div>
						<Text strong>Tên sản phẩm: </Text> {record.tenSanPham}
						<br />
						<Text strong>Quy cách in ấn và gia công:</Text>
					</div>
				)
			}
		},
		{
			title: "Số lượng",
			dataIndex: "soLuong",
			align: "center",
			render: (text, record) =>
				record.isNoiDungMoRong ? COL_SPAN_0 : text
		},
		{
			title: "Đơn giá",
			dataIndex: "donGia",
			align: "center",
			render: (text, record) =>
				record.isNoiDungMoRong ? COL_SPAN_0 : text.toLocaleString("vi-VN")
		},
		{
			title: "Thành tiền",
			dataIndex: "thanhTien",
			align: "center",
			render: (text, record) =>
				record.isNoiDungMoRong ? COL_SPAN_0 : <Text strong>{text.toLocaleString("vi-VN")}</Text>
		}
	];

	return (
		<StyledTable>
			<Table
				columns={columns}
				dataSource={data}
				pagination={false}
				bordered
				rowClassName={(record) => (record.isNoiDungMoRong ? "sub-row" : "main-row")}
			/>
		</StyledTable>
	)
};

export default OrderTextTableOnly;