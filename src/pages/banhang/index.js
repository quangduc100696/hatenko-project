import Order from 'containers/Order';
import { Helmet } from 'react-helmet';
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import { useParams } from "react-router-dom";

const title = 'Tạo cơ hội bán hàng';
const BanHangPage = (props) => {
	const { orderId } = useParams();
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