import { useCallback, useContext, useEffect, useState } from "react";
import RequestUtils from "utils/RequestUtils";
import MyContext from 'DataContext';
import { useUpdateEffect } from "hooks/MyHooks";

function useGetRestApi({ 
    queryParams: filter, 
    onData = (values) => values
}) {

    const { f5List } = useContext(MyContext)
    const [ loading, setLoading ] = useState(false);
    const [ data, setData ] = useState({});
    const fetchResource = useCallback( async(values) => {
        if(loading) {
            return Promise.reject("===== fetch api on loading .!");
        }
        const { resource, ...params } = values;
        if(!resource) {
            return Promise.reject("Call api without apiPath .!");
        }
        setLoading(true);
        RequestUtils.Get(`/${resource}`, params ).then(async({data, success}) => {
            if(success) {
                Promise.resolve(onData(data)).then(setData);
            }
            setLoading(false);
        }).catch(e => {
            console.log('[hooks.useGetApi] ', e);
            setLoading(false);
        });
    }, [onData, loading]);

    useEffect(() => {
        fetchResource(filter);
        /* eslint-disable-next-line */
    }, []);

    useUpdateEffect(() => {
        fetchResource(filter);
    }, [f5List, filter]);

    return {
        data,
        loading
    };
}

export default useGetRestApi;
