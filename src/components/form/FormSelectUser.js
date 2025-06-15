import { useEffect, useState } from 'react';
import FormSelect from './FormSelect';
import RequestUtils from 'utils/RequestUtils';
import { arrayNotEmpty, dataArray } from 'utils/dataUtils';

const FormSelectUser = ({
	name,
	api = '/user/list',
	label,
	placeholder,
	valueProp = 'id',
	titleProp = 'ssoId',
	filter,
	onData = (values) => values,
	...props
}) => {

	const [data, setData] = useState([]);
	useEffect(() => {
		if (api == '/user/list') {
			RequestUtils.Get('/user/list', filter).then(data => {
				if (arrayNotEmpty(data?.data?.embedded)) {
					setData(data?.data?.embedded);
				}
			});
		}
		else {
			RequestUtils.Get(api, filter).then(dataArray).then(onData).then(setData);
		}
		/* eslint-disable-next-line */
	}, [filter, api]);

	return (
		<FormSelect
			label={label}
			placeholder={placeholder || label}
			name={name || 'id'}
			valueProp={valueProp}
			titleProp={titleProp}
			resourceData={data}
			{...props}
		/>
	);
}

export default FormSelectUser;