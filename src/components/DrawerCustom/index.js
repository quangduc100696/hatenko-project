import DrawerRoute from './DrawerRoute';

const DrawerCustom = ({
  children,
  onClose,
  ...props
}) => (
  <DrawerRoute onClose={onClose} {...props}>
    { children }
  </DrawerRoute>
);

export default DrawerCustom;
