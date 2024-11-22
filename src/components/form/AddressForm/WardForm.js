import useGetOneQuery from 'hooks/useGetOneQuery';
import { Col } from 'antd';
import FormSelect from 'components/form/FormSelect';
import { useEffect } from 'react';

const WardForm = ( {districtId}) => {

	const { refetch, record: resourceData } = useGetOneQuery({ 
		uri: districtId ? ('province/list?parentId=' + districtId) : null 
	});
	
	useEffect(() => {
		refetch();
		/* eslint-disable-next-line */
	}, [districtId]);

	return (
		<Col md={8} xs={24}>
			<FormSelect
				required
				name="wardId"
				label="Phường/Xã"
				placeholder="Chọn Phường/Xã"
				resourceData={resourceData || []}
				valueProp="id"
				titleProp="name"
			/>
		</Col>
	)
}

export default WardForm;