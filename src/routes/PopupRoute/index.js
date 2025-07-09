import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { HASH_POPUP, HASH_POPUP_CLOSE } from 'configs/constant';
import { InAppEvent } from 'utils/FuseUtils';
import { Modal } from 'antd';
import { NoFooter } from 'components/common/NoFooter';
import styled from 'styled-components';
import ChoiseSKU from './ChoiseSKU';

const CustomModalWrapper = styled.div`
  .custom-modal {
    top: 50%;
    max-height: 90vh;
    overflow: auto;
  }
`;

const modalRoutes = [
  ...ChoiseSKU
];

const getPopupRoute = (currentModal) => {
  const routeNotFound = { Component: () => <div /> }
  if(!currentModal) {
    return routeNotFound;
  }
  const modalRoute = modalRoutes.find(route => currentModal.includes(route.path));
  if (modalRoute && modalRoute['Component']) {
    return modalRoute;
  }
  return routeNotFound;
};

function MyPopup() {

  const [ params, setParams ] = useState({ open: false });
  const handleEventDraw = useCallback( ({ hash, data, title }) => {
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
    <CustomModalWrapper>
      <Modal
        {...PopupRoute?.modalOptions}
        title={params?.title || ''}
        open={params.open}
        onCancel={closePopup}
        footer={<NoFooter />}
        wrapClassName="custom-modal"
        width={PopupRoute?.modalOptions?.width || 800}
      >
        <PopupRoute.Component 
          closeModal={closePopup} 
          {...(params.data || {})}
        />
      </Modal>
    </CustomModalWrapper>
  );
}

export default MyPopup;
