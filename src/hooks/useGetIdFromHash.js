import { HASH_MODAL } from 'configs/constant';
import { useLocation } from 'react-router';

const useGetIdFromHash = (resource, suffix = 'edit') => {
  const { hash } = useLocation();
  const idFromHash = hash.match(`${HASH_MODAL}/${resource}/(.*)/${suffix}`);
  return idFromHash && idFromHash[1];
};

export default useGetIdFromHash;
