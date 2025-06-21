import { HASH_MODAL, HASH_MODAL_CLOSE } from 'configs';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { InAppEvent } from 'utils/FuseUtils';
import DrawerCustom from 'components/DrawerCustom';
import ProductRoute from './ProductRoute.js';
import OrderRoute from './OrderRoute';
import LeadRoute from './LeadRouter.js';
import LeadNotTakeRouter from './LeadNotTakeRouter.js';
import LeadTakeRouter from './LeadTakeRouter.js';
import CohoiRouter from './CohoiRouter.js';
import WareHoseRouter from './WareHouseRouter.js';
import CutomerRetailRouter from './CustomerRetailRouter.js';
import ActionXuatkhoRouter from './ActionXuatkhoRouter.js';
import WareHoseActionRouter from './WareHouseActionRouter.js';
import OrderRouter from './UserAccountRouter.js';
import UserGroupRouter from './UserGroupRouter.js';
import CohoiNotTakeRouter from './CohoiNotTakeRouter.js';
import DuyetTienRouter from './DuyetTienRouter.js';
import ActionChamSocDonHangRouter from './ChamSocDonHangRouter.js';
import TranferRouter from './tranferRouter.js';
import TypeContactRouter from './TypeContactRouter.js';

const modalRoutes = [
  ...ProductRoute,
  ...OrderRoute,
  ...LeadRoute,
  ...LeadNotTakeRouter,
  ...LeadTakeRouter,
  ...CohoiRouter,
  ...WareHoseRouter,
  ...CutomerRetailRouter,
  ...ActionXuatkhoRouter,
  ...WareHoseActionRouter,
  ...OrderRouter,
  ...UserGroupRouter,
  ...CohoiNotTakeRouter,
  ...DuyetTienRouter,
  ...ActionChamSocDonHangRouter,
  ...TranferRouter,
  ...TypeContactRouter
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
  if (!modalRoute) {
    return notFoundHash;
  }
  if(modalRoute['Component']) {
    delete modalRoute.routes;
    return modalRoute;
  }
  const route = modalRoute.routes.find(route => iHash.includes(route.path));
  return route || notFoundHash;
};

function ModalRoutes() {

  const [ params, setParams ] = useState({ open: false });
  const handleEventDraw = useCallback( ({ hash, data, title }) => {
    log('#hash', {hash, data});
    setParams({open: true, hash, data, title});
  }, []);

  const handleCloseDraw = useCallback( () => {
    setParams({open: false});
  }, []);

  useEffect( () => {
    InAppEvent.addEventListener(HASH_MODAL, handleEventDraw);
    InAppEvent.addEventListener(HASH_MODAL_CLOSE, handleCloseDraw);
    return () => {
      InAppEvent.removeListener(HASH_MODAL, handleEventDraw);
      InAppEvent.removeListener(HASH_MODAL_CLOSE, handleCloseDraw);
    };
  }, [handleEventDraw, handleCloseDraw]);

  const closeModal =useCallback(() => {
    setParams({open: false})
  }, []);

  const ModalRoute = useMemo(
    () => getModalRoute(params.hash),
    [params.hash],
  );

  return (
    <DrawerCustom
      {...ModalRoute?.modalOptions}
      title={params?.title || ModalRoute?.modalOptions?.title}
      open={params.open}
      onClose={closeModal}
    >
      <ModalRoute.Component closeModal={closeModal} {...params} />
    </DrawerCustom>
  );
}

export default ModalRoutes;
