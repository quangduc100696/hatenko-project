import { useEffect, useState } from 'react';
import FormSelect from './FormSelect';
import RequestUtils from 'utils/RequestUtils';
import { dataArray } from 'utils/dataUtils';

const FormSelectUser = ({name, label, filter, ...props}) => {

	const [ data, setData ] = useState([]);
	useEffect(() => {
		RequestUtils.Get('/user/fetch-all', filter).then(dataArray).then(setData);
	}, [filter]);

	return (
		<FormSelect
			label={label}
			placeholder={label}
			name={name || 'ssoId'}
			valueProp="id"
			titleProp="ssoId"
			resourceData={data}
			{...props}
		/>
  );
}

export default FormSelectUser;