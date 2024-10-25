import { useNavigate } from 'react-router';
import { convertObjToSearchStr } from 'utils/tools';

const getPath = (name) => name.startsWith('/') ? name : '/'.concat(name);

export const useNavigateSearch = () => {
  const navigate = useNavigate();
  return (pathname, params) => navigate({ 
    pathname: getPath(pathname), 
    search: `?${convertObjToSearchStr(params)}` 
  });
};
