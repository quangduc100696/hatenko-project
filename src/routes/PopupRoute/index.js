import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { HASH_POPUP, HASH_POPUP_CLOSE } from 'configs/constant';
import { InAppEvent } from 'utils/FuseUtils';
import { Modal } from 'antd';
import { random } from 'lodash';

const modalRoutes = [];
const log = (key, val) => console.log('[routes.popup-routes] ' + key + ' ', val);

const getPopupRoute = (currentModal) => {
  const routeNotFound = { Component: () => <div /> }
  if(!currentModal) {
    return routeNotFound;
  }
  const modalRoute = modalRoutes.find(route => currentModal.includes(route.path));
  if (modalRoute) {
    if(modalRoute['Component']) {
      delete modalRoute.routes;
      return modalRoute;
    }
    const route = modalRoute.routes.find(route => currentModal.includes(route.path));
    return route ? route : routeNotFound;
  }
  return routeNotFound;
};

function MyPopup() {

  const [ params, setParams ] = useState({ open: false });
  const [ triggerOnOk, setTrigger ] = useState();

  const handleEventDraw = useCallback( ({ hash, data, title }) => {
    log('#hash', {hash, data});
    setParams({open: true, hash, data, title});
  }, []);

  const handleCloseDraw = useCallback( () => {
    setParams({open: false});
  }, []);

  useEffect( () => {
      InAppEvent.addEventListener(HASH_POPUP, handleEventDraw);
      InAppEvent.addEventListener(HASH_POPUP_CLOSE, handleCloseDraw);
      return () => {
        InAppEvent.removeListener(HASH_POPUP, handleEventDraw);
        InAppEvent.removeListener(HASH_POPUP_CLOSE, handleCloseDraw);
      };
  }, [handleEventDraw, handleCloseDraw]);

  const closePopup =useCallback(() => {
    setParams({open: false})
  }, []);

  const PopupRoute = useMemo(
    () => getPopupRoute(params.hash),
    [params.hash],
  );
  
  return (
    <Modal
      {...PopupRoute?.modalOptions}
      title={params?.title}
      open={params.open}
      onCancel={closePopup}
      onOk={() => setTrigger(random())}
    >
      <PopupRoute.Component 
        closeModal={closePopup} 
        {...params} 
        triggerOnOk={triggerOnOk} 
      />
    </Modal>
  );
}

export default MyPopup;
