import Order from 'containers/Order';
import { Helmet } from 'react-helmet';
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import { useState } from 'react';

const title = 'Tạo cơ hội bán hàng';
const BanHangPage = (props) => {
	const [ orderId ] = useState(33994);
	return <>
		<Helmet>
			<title>{title}</title>
		</Helmet>
		<CustomBreadcrumb
			data={[{ title: 'Trang chủ' }, { title: title }]}
		/>
		<Order
			orderId={orderId}
			{...props} 
		/>
	</>;
}

export default BanHangPage;