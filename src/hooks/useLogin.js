import { useState } from 'react';
import RequestUtils from 'utils/RequestUtils';
import jwtService from 'utils/jwtService';

/* const log = (key, val) => console.log('[hooks.useLogin] ' + key, val); */
function useLogin() {

  const [loading, setLoading] = useState(false);
  const login = (payload) => {
    setLoading(true);
    RequestUtils.Post('/auth/sign-in', payload).then(({ data, success }) => {
      debugger
      if (success) {
        jwtService.setSession(data);
      }
      setLoading(false);
    }).catch(e => {
      setLoading(false);
    })
  };

  return { login, loading };
}

export default useLogin;
