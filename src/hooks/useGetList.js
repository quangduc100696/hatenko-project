import { useCallback, useEffect, useState, useContext } from "react";
import RequestUtils from "utils/RequestUtils";
import MyContext from 'DataContext';
import { useUpdateEffect } from "hooks/MyHooks";

function useGetList({
	queryParams: filter, 
	onData
}) {
	
	const { f5List } = useContext(MyContext)
	const [ loading, setLoading ] = useState(true);
	const [ data, setData ] = useState();

	const fetchResource = useCallback((values) => {
		const { apiPath, ...params } = values;
		setLoading(true);
		RequestUtils.Get('/' + apiPath, params).then( async ({data, errorCode}) => {
			if(errorCode !== 200) {
				return Promise.reject("Get not success from server .!");
			}
			Promise.resolve(onData(data)).then(setData);
			setLoading(false);
		}).catch(e => {
			console.log('[hook.useGetList] Error ', e);
			setLoading(false);
		});
	}, [onData]);

	useEffect(() => {
		fetchResource(filter);
		/* eslint-disable-next-line */
	}, [filter]);

	useUpdateEffect(() => {
		if(f5List?.apiPath === filter.apiPath) {
			fetchResource(filter);
		}
	}, [f5List, filter]);

	return {
		data,
		loading
	};
}

export default useGetList;
