import { useState } from 'react';

const useAccessLocations = () => {
  const [restLocations] = useState([]);
  return {
    isAll: true,
    locations: restLocations,
  };
};

export default useAccessLocations;
