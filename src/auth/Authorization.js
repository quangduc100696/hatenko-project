import React, { useCallback, useEffect, useState } from 'react';
import FuseUtils from 'utils/FuseUtils';
import { useStore } from "DataContext";
import { useLocation, useNavigate } from "react-router-dom";

const LOGIN_PATH = '/login';
/* const log = (key, value) => console.log('[auth.Authorization] ' + key + ' ', value); */
const Authorization = (props) => {

    const [ accessGranted, setAccessGranted ] = useState(true);
    let location = useLocation();
    let navigate = useNavigate();

    const { routes, user } = useStore();
    const { pathname } = location;

    useEffect(() => {
        const matched = routes.find(r => r.path === pathname);
        const granted = matched ? FuseUtils.hasPermission(matched.auth, (user?.id || '') !== '') : false;
        setAccessGranted(granted);
        /* eslint-disable-next-line */
    }, [pathname, user]);

    const redirectRoute = useCallback(() => {
        const { pathname, state } = location;
        let redirectUrl = state?.redirectUrl ?? '/';
        if (!user?.id) {
            let strParams = window.location.search.substring(1)
            navigate(LOGIN_PATH, {
                state: { redirectUrl: pathname.concat(strParams ? '?' + strParams : '') }
            });
        } else {
            navigate(redirectUrl);
        }
    }, [navigate, location, user])

    useEffect(() => {
        if(!accessGranted || (user?.id && pathname === LOGIN_PATH)) {
            redirectRoute();
        }
        /* eslint-disable-next-line */
    }, [accessGranted, redirectRoute]);

    return accessGranted ? <React.Fragment>{ props.children }</React.Fragment> : '';
}

export default Authorization;
