import Order from 'containers/Order';
import { Helmet } from 'react-helmet';
import CustomBreadcrumb from 'components/BreadcrumbCustom';

const title = 'Tạo cơ hội bán hàng';
const BanHangPage = (props) => {
	return <>
		<Helmet>
			<title>{title}</title>
		</Helmet>
		<CustomBreadcrumb
			data={[{ title: 'Trang chủ' }, { title: title }]}
		/>
		<Order {...props} />
	</>;
}

export default BanHangPage;