import useGetOneQuery from 'hooks/useGetOneQuery';
import { Col } from 'antd';
import FormSelect from 'components/form/FormSelect';
import { useEffect } from 'react';

const DistrictForm = ( {provinceId}) => {

	const { refetch, record: resourceData } = useGetOneQuery({ 
		uri: provinceId ? ('province/list?parentId=' + provinceId) : null 
	});
	
	useEffect(() => {
		refetch();
		/* eslint-disable-next-line */
	}, [provinceId]);

	return (
		<Col md={8} xs={24}>
			<FormSelect
				required
				name="districtId"
				label="Quận/Huyện"
				placeholder="Chọn Quận/Huyện"
				resourceData={resourceData || []}
				valueProp="id"
				titleProp="name"
			/>
		</Col>
	)
}

export default DistrictForm;