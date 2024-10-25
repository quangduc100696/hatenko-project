import { useState, useCallback } from "react";

function useQueryParamsOnHeader() {
    
  const [ data, setData ] = useState();
  const setQueryParamsOnHeader = useCallback( (params) => {
    setData(pre => ({...pre, ...params}))
  }, []);

  return {
    queryParamsOnHeader: data?.queryParamsOnHeader,
    setQueryParamsOnHeader,
  };
}

export default useQueryParamsOnHeader;
