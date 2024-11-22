import { useState, useCallback } from 'react';

const useServiceId = () => {
  
  const [ data, setData ] = useState();
  const setServiceId = useCallback((id) => {
    setData({serviceId: id});
  }, []);

  return {
    serviceId: data?.serviceId,
    setServiceId,
  };
};

export default useServiceId;
