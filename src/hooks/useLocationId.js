import { useState, useCallback } from 'react';

const useLocationId = () => {
  
  const [ data, setData ] = useState();
  const setLocationId = useCallback((id) => {
    setData({locationId: id});
  }, []);

  return {
    locationId: data?.locationId,
    setLocationId,
  };
};

export default useLocationId;
