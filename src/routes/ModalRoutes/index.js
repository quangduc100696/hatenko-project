import DrawerRoute from 'components/DrawerCustom';
import { HASH_MODAL } from 'configs';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { InAppEvent } from 'utils/FuseUtils';
import productRoute from './productRoute';

const modalRoutes = [
  ...productRoute
]

const log = (key, val) => console.log('[routes.draw-routes] ' + key + ' ', val);
const notFoundHash = { Component: () => <div /> };

const getModalRoute = (urlHash) => {
  if(!urlHash) {
    return notFoundHash;
  }
  const iHash = urlHash.replaceAll('/', '.')
  const modalRoute = modalRoutes.find(route => iHash.includes(route.path));
  log('==== modalRoute', modalRoute)
  if (modalRoute) {
    if(modalRoute['Component']) {
      delete modalRoute.routes;
      return modalRoute;
    }
    const route = modalRoute.routes.find(route => iHash.includes(route.path));
    return route ? route : notFoundHash;
  }
  return notFoundHash;
};

function ModalRoutes() {

  const [ params, setParams ] = useState({});
  const [ visibleModal, setVisibleModal ] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    setVisibleModal(location.hash.includes(HASH_MODAL));
  }, [location.hash]);

  const closeModal = () => {
    setVisibleModal(false);
    /* replace with location.search */
    const { pathname, search } = location;
    const isEmpty = (str) => (!str?.length);
    const pathSearch = isEmpty(search) ? '' : search;
    navigate(pathname.concat(pathSearch), { replace: true })
  };

  const GetModalRoute = useMemo(
    () => getModalRoute(location.hash || params.hash),
    [location.hash, params.hash],
  );

  const handleEventDraw = useCallback( ({ hash, data, title }) => {
    log('#hash', { hash, title, data});
    if(!data) {
      setVisibleModal(false);
      return;
    }
    setVisibleModal(true);
    setParams({ hash, data, title});
  }, []);

  useEffect( () => {
    InAppEvent.addEventListener(HASH_MODAL, handleEventDraw);
    return () => {
      InAppEvent.removeListener(HASH_MODAL, handleEventDraw);
    };
  }, [handleEventDraw]);

  return (
    <DrawerRoute
      {...GetModalRoute?.modalOptions}
      open={visibleModal}
      onClose={closeModal}
    >
      <GetModalRoute.Component closeModal={closeModal} {...params} />
    </DrawerRoute>
  );
}

export default ModalRoutes;
