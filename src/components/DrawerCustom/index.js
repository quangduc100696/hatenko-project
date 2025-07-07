import React from 'react';
import DrawerContent from './DrawerContent';
import DrawerRoute from './DrawerRoute';

const DrawerCustom = ({ children, onClose, title, ...props }) => (
  <DrawerRoute 
    onClose={onClose} 
    title={title}
    {...props}
  >
    <DrawerContent
      title={title}
      onClose={onClose}
      {...props}
    >
      { children }
    </DrawerContent>
  </DrawerRoute>
);

export default DrawerCustom;
