import React, { useEffect } from 'react';
import { notification } from 'antd';
import { INAPP_NOTIFICATION_EMITTER } from 'configs';
import { InAppEvent } from 'utils/FuseUtils';

const InAppNotify = () => {

  const showNotify = (data) => {
    const { type, content, title } = data;
    notification[type]({
      message: title || 'Thông báo',
      description: content,
      duration: 5
    });
  }

  useEffect( () => {
    InAppEvent.addEventListener(INAPP_NOTIFICATION_EMITTER, showNotify);
    return () => {
      InAppEvent.removeListener(INAPP_NOTIFICATION_EMITTER, showNotify);
    };
  }, []);

  return <div className="in-app-noti" style={{display: 'none'}}></div>
}

export default InAppNotify;