import { isArray } from "lodash";
import { useContext, useCallback, useEffect, useState } from "react";
import RequestUtils from "utils/RequestUtils";
import MyContext from 'DataContext';
import { useUpdateEffect } from "hooks/MyHooks";
import { SUCCESS_CODE } from "configs";

const log = (val, key = '') => console.log('[hooks.useData] ' + key, val);
function useData({ 
    queryParams, 
    onCompleted = values => values, 
    api 
}) {

    const [ loading, setLoading ] = useState(false);
    const [ data, setData ] = useState({});
    const { f5List } = useContext(MyContext)

    /* refetch dành cho fetch các page tăng dần */
    const refetch = useCallback(async (values) => {
        if(loading) {
            return Promise.resolve({eMsg: "loading"});
        }
        setLoading(true);
        const { data, errorCode } = await RequestUtils.Get('/' + api, values);
        setLoading(false);
        if(errorCode !== SUCCESS_CODE) {
            return Promise.resolve({ eMsg: api + " not fetch success .!" });
        }
        let myData = data;
        if(isArray(myData)){
            myData = { embedded: myData, page: {} }
        }
        setData(myData);
        onCompleted(myData);
        return myData;
    }, [onCompleted, api, loading]);

    useEffect(() => {
        refetch(queryParams);
        /* eslint-disable-next-line */
    }, [queryParams]);

    /* fetchMore dành cho search kết quả đã có săn của Form để có dữ liệu hiển thị trong form select */
    const fetchMore = useCallback(async ({ filterField, defaultValue }) => {
        log({ queryParams, filterField, defaultValue }, 'fetchMore');
        const { data, errorCode } = await RequestUtils.Get('/' + api, {[filterField]: defaultValue});
        if(errorCode !== SUCCESS_CODE) {
            return { embedded: [], page: {} }
        }
        let myData = data;
        if(isArray(myData)){
            myData = { embedded: myData, page: {} }
        }
        return myData;
    }, [queryParams, api]);

    useUpdateEffect(() => {
        refetch(queryParams);
    }, [f5List]);

    return {
        loading, data, refetch, fetchMore
    };
}

export const useGetAllCustomersSimpleQuery = ({queryParams, onCompleted}) => 
    useData({queryParams, onCompleted, api: 'customer/find'});

export const useGetAllBusinessUsersQuery = ({queryParams, onCompleted}) => 
    useData({queryParams, onCompleted, api: 'user/list'});

export const useGetAllProductQuery = ({queryParams, onCompleted}) => 
    useData({queryParams, onCompleted, api: 'product/fetch'});

export default useData;
