import { useCallback, useEffect, useState } from "react";
import RequestUtils from "utils/RequestUtils";

function useGetOneQuery({ filter, uri, onBeforeProcessData }) {

    const [ loading, setLoading ] = useState(false);
    const [ data, setData ] = useState({});

    const fetchResource = useCallback( () => {
        if(loading) {
            return Promise.reject("===== fetch api on loading .!");
        }
        setLoading(true);
        if(uri) {
            RequestUtils.Get('/'.concat(uri), filter).then( ({data, success}) => success && setData(data));
        }
        setLoading(false);
    }, [filter, uri, loading]);

    useEffect(() => {
        fetchResource();
        /* eslint-disable-next-line */
    }, []);

    return {
        loading,
        record: onBeforeProcessData ? onBeforeProcessData(data) : data,
        refetch: () => fetchResource(filter)
    };
}

export default useGetOneQuery;
