import { useState, useCallback } from 'react';
import { f5List } from 'utils/dataUtils';
import { InAppEvent } from 'utils/FuseUtils';
import RequestUtils from 'utils/RequestUtils';

const useUpdateIncident = () => {
  
  const [ loading, setLoading ] = useState();
  const updateIncident = useCallback(async ({
    input, 
    isRefetchAfterUpdate = true, 
    onCompleted = (values) => values
  }) => {
    setLoading(true);
    const { success, data } = await RequestUtils.Post('/incident/save', input);
    setLoading(false);
    if(!success) {
      InAppEvent.normalError("Lỗi cập nhật sự cố cố.!");
      return;
    }
    if(isRefetchAfterUpdate) {
      f5List('incident/list');
    }
    onCompleted(data);
  }, []);

  return {
    loading,
    updateIncident
  };
};

export default useUpdateIncident;
