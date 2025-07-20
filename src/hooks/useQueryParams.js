import { useLocation } from "react-router-dom";

export function useQueryParams() {

  const { search } = useLocation();

  const get = (key) => {
    return new URLSearchParams(search).get(key);
  };

  const getAll = () => {
    const params = new URLSearchParams(search);
    const result = {};
    for (const [key, value] of params.entries()) {
      result[key] = value;
    }
    return result;
  };
  
  return { get, getAll };
}
