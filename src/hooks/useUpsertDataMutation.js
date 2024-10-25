import { useCallback, useState } from "react";
import { InAppEvent } from "utils/FuseUtils";
import RequestUtils from "utils/RequestUtils";

const log = (k, v) => console.log('[hooks.useUpsertDataMutation] ' + k, v);
function useUpsertDataMutation() {
	const [ loading, setLoading ] = useState(false);
	
	const upsertDataMutation = useCallback(async ({ endpoint, values, callback }) => {
		setLoading(true);
		const { data, success } = await RequestUtils.Post(endpoint, values);
		log('data', data);
		InAppEvent.normalInfo(success);
		if(success && callback) {
			callback(data);
		}
		setLoading(false);
		return data;
	}, []);

	return [
		upsertDataMutation, 
		{ loading }
	];
}

export default useUpsertDataMutation;
