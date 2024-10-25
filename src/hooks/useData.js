import { isArray } from "lodash";
import { useContext, useCallback, useEffect, useState } from "react";
import RequestUtils from "utils/RequestUtils";
import MyContext from 'DataContext';
import { useUpdateEffect } from "hooks/MyHooks";

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
            return Promise.resolve();
        }
        setLoading(true);
        const { data, success } = await RequestUtils.Get('/' + api, values);
        setLoading(false);
        if(!success) {
            return Promise.reject(api + " not fetch success .!");
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
        const { data, success } = await RequestUtils.Get('/' + api, {[filterField]: defaultValue});
        if(!success) {
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

export const useGetAllExtraServiceTypesQuery = ({queryParams, onCompleted}) =>
    useData({queryParams, onCompleted, api: 'resource/service-add/list'});

export const useGetAllExtraServiceCategoriesQuery = ({queryParams}) => 
    useData({queryParams, api: 'extra-service/cate'});

export const useGetAllCustomersSummaryQuery = (queryParams) => 
    useData({queryParams, api: 'customer/summary'});

export const useGetAllCustomersSimpleQuery = ({queryParams, onCompleted}) => 
    useData({queryParams, onCompleted, api: 'customer/list'});

export const useGetContractSummaryQuery = (queryParams) => 
    useData({queryParams, api: 'contracts/sumary'});

export const useGetAllBookingsQuery = ({queryParams}) => 
    useData({queryParams, api: 'order/list'});

export const useGetAllIncidentsQuery = ({queryParams}) => 
    useData({queryParams, api: 'incident/list'});

export const useGetAllInboxesQuery = ({queryParams}) => 
    useData({queryParams, api: 'inboxes/list'});

export const useGetAllMessagesQuery = ({queryParams}) => 
    useData({queryParams, api: 'messages/list'});

export const useGetAllParentInboxesQuery = ({queryParams}) => 
    useData({queryParams, api: 'parent-inboxes/list'});

export const useGetAllBusinessUsersQuery = ({queryParams, onCompleted}) => 
    useData({queryParams, onCompleted, api: 'user/list'});

export default useData;
